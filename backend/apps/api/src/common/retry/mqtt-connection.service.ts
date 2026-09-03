import { Injectable, Logger, OnModuleDestroy, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { CircuitBreaker } from './circuit-breaker.util';
import { retryWithExponentialBackoff } from './retry.util';

@Injectable()
export class MqttConnectionService implements OnModuleDestroy {
  private readonly logger = new Logger(MqttConnectionService.name);
  private readonly breaker = new CircuitBreaker({
    failureThreshold: 3,
    windowMs: 30_000,
    resetTimeoutMs: 15_000,
  });
  private client: mqtt.MqttClient | null = null;
  private connectionPromise: Promise<mqtt.MqttClient> | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleDestroy() {
    if (this.client) {
      this.client.end(true, () => {
        this.logger.log('MQTT broker connection closed cleanly.');
      });
      this.client = null;
    }
  }

  async ensureConnected(): Promise<mqtt.MqttClient> {
    if (this.client && this.client.connected) {
      return this.client;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = retryWithExponentialBackoff(
      async () => {
        const brokerHost = this.configService.get<string>('MQTT_BROKER_HOST', 'localhost');
        const brokerPort = this.configService.get<number>('MQTT_BROKER_PORT', 1883);
        const username = this.configService.get<string>('MQTT_BROKER_USERNAME', '');
        const password = this.configService.get<string>('MQTT_BROKER_PASSWORD', '');
        const tls = this.configService.get<boolean>('MQTT_TLS', false);
        const clientId = this.configService.get<string>('MQTT_CLIENT_ID', 'greenmind-fx-dev');
        const protocol = tls ? 'mqtts' : 'mqtt';

        const client = mqtt.connect(`${protocol}://${brokerHost}:${brokerPort}`, {
          clientId,
          username: username || undefined,
          password: password || undefined,
          reconnectPeriod: 1000,
          connectTimeout: 5000,
        });

        await new Promise<void>((resolve, reject) => {
          const onConnect = () => {
            client.removeListener('error', onError);
            resolve();
          };

          const onError = (error: Error) => {
            client.removeListener('connect', onConnect);
            reject(error);
          };

          client.once('connect', onConnect);
          client.once('error', onError);
        });

        this.client = client;
        return client;
      },
      {
        maxRetries: 5,
        baseDelayMs: 250,
        maxDelayMs: 4000,
        shouldRetry: (error) => !!error,
        onRetry: (attempt, error, delayMs) => {
          this.logger.warn(
            `MQTT reconnect attempt ${attempt} after ${delayMs}ms. Error: ${String(error)}`,
          );
        },
      },
    ).finally(() => {
      this.connectionPromise = null;
    });

    return this.connectionPromise;
  }

  async connect() {
    return this.ensureConnected();
  }

  async publish(topic: string, payload: Record<string, unknown>): Promise<void> {
    return this.breaker.execute(async () => {
      const client = await this.ensureConnected();

      await retryWithExponentialBackoff(
        async () => {
          await new Promise<void>((resolve, reject) => {
            const message = JSON.stringify(payload);
            client.publish(topic, message, { qos: 1 }, (error) => {
              if (error) {
                reject(error);
                return;
              }
              resolve();
            });
          });
        },
        {
          maxRetries: 2,
          baseDelayMs: 150,
          maxDelayMs: 1000,
          shouldRetry: (error) => Boolean(error),
          onRetry: (attempt, error, delayMs) => {
            this.logger.warn(
              `MQTT message publish retry ${attempt} after ${delayMs}ms for topic ${topic}. Error: ${String(error)}`,
            );
          },
        },
      );
    }, async () => {
      this.logger.warn(`MQTT circuit open for topic ${topic}: device offline / automation paused.`);
      throw new ServiceUnavailableException('Device offline / automation paused');
    });
  }
}

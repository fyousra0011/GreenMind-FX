import { Injectable, Logger } from '@nestjs/common';
import { retryWithExponentialBackoff } from './retry.util';

@Injectable()
export class MqttConnectionService {
  private readonly logger = new Logger(MqttConnectionService.name);

  async connect() {
    await retryWithExponentialBackoff(
      async () => {
        try {
          // Replace with the real broker client connection in production.
          // Example: await this.mqttClient.connectAsync();
          return true;
        } catch (error) {
          this.logger.warn('MQTT connection failed, retrying...');
          throw error;
        }
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
    );
  }
}

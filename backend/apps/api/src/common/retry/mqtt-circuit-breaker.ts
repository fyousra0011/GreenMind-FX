import { Injectable, Logger } from '@nestjs/common';
import { CircuitBreaker } from './circuit-breaker.util';

@Injectable()
export class MqttCircuitBreaker {
  private readonly logger = new Logger(MqttCircuitBreaker.name);
  private readonly breaker = new CircuitBreaker({
    failureThreshold: 3,
    windowMs: 30_000,
    resetTimeoutMs: 15_000,
  });

  async execute<T>(operation: () => Promise<T>, fallback?: () => Promise<T> | T): Promise<T> {
    return this.breaker.execute(operation, async () => {
      this.logger.warn('MQTT circuit open: device offline / automation paused.');
      if (fallback) {
        return fallback();
      }

      throw new Error('Device offline / automation paused');
    });
  }
}

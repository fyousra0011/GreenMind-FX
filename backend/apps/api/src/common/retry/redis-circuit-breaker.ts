import { Injectable, Logger } from '@nestjs/common';
import { CircuitBreaker } from './circuit-breaker.util';

@Injectable()
export class RedisCircuitBreaker {
  private readonly logger = new Logger(RedisCircuitBreaker.name);
  private readonly breaker = new CircuitBreaker({
    failureThreshold: 3,
    windowMs: 30_000,
    resetTimeoutMs: 15_000,
  });

  async execute<T>(operation: () => Promise<T>, fallback?: () => Promise<T> | T): Promise<T> {
    return this.breaker.execute(operation, async () => {
      this.logger.warn('Redis circuit open: automation paused and fallback used.');
      if (fallback) {
        return fallback();
      }

      throw new Error('Redis unavailable: automation paused');
    });
  }
}

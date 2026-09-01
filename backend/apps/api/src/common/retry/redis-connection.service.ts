import { Injectable, Logger } from '@nestjs/common';
import { retryWithExponentialBackoff } from './retry.util';

@Injectable()
export class RedisConnectionService {
  private readonly logger = new Logger(RedisConnectionService.name);

  async connect() {
    await retryWithExponentialBackoff(
      async () => {
        try {
          // Replace with the real Redis client connection in production.
          // Example: await this.redisClient.connect();
          return true;
        } catch (error) {
          this.logger.warn('Redis connection failed, retrying...');
          throw error;
        }
      },
      {
        maxRetries: 6,
        baseDelayMs: 300,
        maxDelayMs: 5000,
        shouldRetry: (error) => !!error,
        onRetry: (attempt, error, delayMs) => {
          this.logger.warn(
            `Redis reconnect attempt ${attempt} after ${delayMs}ms. Error: ${String(error)}`,
          );
        },
      },
    );
  }
}

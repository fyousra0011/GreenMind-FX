import { ServiceUnavailableException } from '@nestjs/common';

export type CircuitBreakerOptions = {
  failureThreshold: number;
  windowMs: number;
  resetTimeoutMs: number;
  successThreshold?: number;
};

export class CircuitBreaker {
  private failureCount = 0;
  private openedAt = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private readonly failureThreshold: number;
  private readonly windowMs: number;
  private readonly resetTimeoutMs: number;
  private readonly successThreshold: number;

  constructor({
    failureThreshold,
    windowMs,
    resetTimeoutMs,
    successThreshold = 2,
  }: CircuitBreakerOptions) {
    this.failureThreshold = failureThreshold;
    this.windowMs = windowMs;
    this.resetTimeoutMs = resetTimeoutMs;
    this.successThreshold = successThreshold;
  }

  async execute<T>(
    operation: () => Promise<T>,
    fallback?: () => Promise<T> | T,
  ): Promise<T> {
    if (this.state === 'open') {
      const elapsed = Date.now() - this.openedAt;

      if (elapsed < this.resetTimeoutMs) {
        if (fallback) {
          return await fallback();
        }

        throw new ServiceUnavailableException('Device offline / automation paused');
      }

      this.state = 'half-open';
      this.failureCount = 0;
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();

      if (fallback) {
        return await fallback();
      }

      throw new ServiceUnavailableException('Device offline / automation paused');
    }
  }

  private onSuccess() {
    if (this.state === 'half-open') {
      this.failureCount = 0;
      this.state = 'closed';
      return;
    }

    this.failureCount = 0;
  }

  private onFailure() {
    const now = Date.now();

    if (this.state === 'half-open') {
      this.state = 'open';
      this.openedAt = now;
      this.failureCount = this.failureThreshold;
      return;
    }

    if (this.failureCount === 0 || now - this.openedAt > this.windowMs) {
      this.failureCount = 1;
      this.openedAt = now;
    } else {
      this.failureCount += 1;
    }

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open';
      this.openedAt = now;
    }
  }
}

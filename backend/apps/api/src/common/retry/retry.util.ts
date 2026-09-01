export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  shouldRetry?: (error: unknown) => boolean;
  onRetry?: (attempt: number, error: unknown, delayMs: number) => void;
}

export async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxRetries = 4,
    baseDelayMs = 250,
    maxDelayMs = 4000,
    shouldRetry = () => true,
    onRetry = () => undefined,
  } = options;

  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= maxRetries || !shouldRetry(error)) {
        throw error;
      }

      const delayMs = Math.min(baseDelayMs * 2 ** attempt, maxDelayMs);
      onRetry(attempt + 1, error, delayMs);
      attempt += 1;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

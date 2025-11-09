// src/hooks/common/useRetryHandler.ts

/**
 * Utility function to wait for a specified time
 * @param ms - Milliseconds to wait
 */
const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Progress information for retry callbacks
 */
export interface RetryProgress {
  /** Current attempt number (1-based) */
  attempt: number;
  /** Maximum number of attempts */
  maxAttempts: number;
  /** Time elapsed since start (ms) */
  elapsedTime: number;
  /** Maximum polling time allowed (ms) */
  maxPollingTime: number;
  /** Progress percentage (0-100) - optional for operations with trackable progress */
  progress?: number;
  /** Number of processed items - optional */
  processedItems?: number;
  /** Total number of items - optional */
  totalItems?: number;
  /** Custom status message */
  statusMessage?: string;
}

/**
 * Configuration options for retry behavior
 */
export interface RetryOptions {
  /** Initial delay before first attempt (ms). Default: 3000 */
  initialDelay?: number;
  /** Maximum total time to process (ms). Default: 120000 (2 minutes) */
  maxPollingTime?: number;
  /** Maximum number of retry attempts. Default: 20 */
  maxAttempts?: number;
  /** Base delay between retries (ms). Default: 3000 */
  retryDelay?: number;
  /** Whether to use exponential backoff. Default: true */
  useExponentialBackoff?: boolean;
  /** Maximum delay for exponential backoff (ms). Default: 10000 */
  maxBackoffDelay?: number;
  /** Callback function called on each retry attempt with progress info */
  onRetry?: (progress: RetryProgress) => void;
  /** Custom log prefix for console messages. Default: '[Retry Handler]' */
  logPrefix?: string;
}

export function useRetryHandler() {
  /**
   * Process with retry logic and progress tracking
   * @param fetchFn - Function that fetches data
   * @param validateFn - Function that validates if response is successful
   * @param getProgressFn - Optional function to extract progress information from response
   * @param options - Configuration options for retry behavior
   * @returns Promise with response or null if all retries exhausted
   */
  const processWithRetry = async <T>(
    fetchFn: () => Promise<T>,
    validateFn: (response: T) => boolean,
    getProgressFn?: (response: T) => {
      processed: number;
      total: number;
      statusMessage?: string;
    },
    options: RetryOptions = {},
  ): Promise<T | null> => {
    const {
      initialDelay = 3000,
      maxPollingTime = 120000,
      maxAttempts = 20,
      retryDelay = 3000,
      useExponentialBackoff = true,
      maxBackoffDelay = 10000,
      onRetry,
      logPrefix = "[Retry Handler]",
    } = options;

    const startTime = Date.now();

    try {
      // Initial wait to give the backend time to start processing
      if (initialDelay > 0) {
        console.log(
          `${logPrefix} Waiting ${String(initialDelay)}ms before first attempt...`,
        );
        await wait(initialDelay);
      }

      let lastResponse: T | null = null;
      let currentDelay = retryDelay;
      let attempt = 0;

      // Continue polling until success or hit limits (dual exit conditions)
      while (attempt < maxAttempts) {
        const elapsedTime = Date.now() - startTime;

        // Check if we've exceeded max polling time
        if (elapsedTime > maxPollingTime) {
          console.warn(
            `${logPrefix} ⏱️ Max polling time (${String(maxPollingTime)}ms) exceeded`,
          );
          break;
        }

        attempt++;

        try {
          const response = await fetchFn();
          lastResponse = response;

          // Build progress info
          let progressInfo: RetryProgress = {
            attempt,
            maxAttempts,
            elapsedTime,
            maxPollingTime,
          };

          // Extract progress if function provided
          if (getProgressFn) {
            const progressData = getProgressFn(response);
            const { processed, total, statusMessage } = progressData;

            progressInfo = {
              ...progressInfo,
              processedItems: processed,
              totalItems: total,
              progress: total > 0 ? Math.round((processed / total) * 100) : 0,
              statusMessage,
            };

            // Log detailed progress
            console.log(
              `${logPrefix} ⏳ Progress: ${String(processed)}/${String(total)} (${String(progressInfo.progress)}%) - ${statusMessage ?? "Processing..."}`,
            );
          } else {
            // Log basic progress for operations without trackable items
            console.log(
              `${logPrefix} ⏳ Attempt ${String(attempt)}/${String(maxAttempts)} (${String(Math.round(elapsedTime / 1000))}s elapsed)`,
            );
          }

          // Call UI callback
          if (onRetry) {
            onRetry(progressInfo);
          }

          // Check if successful
          if (validateFn(response)) {
            const successTime = Math.round(elapsedTime / 1000);
            console.log(
              `${logPrefix} ✅ SUCCESS after ${String(attempt)} attempts (${String(successTime)}s)`,
            );
            return response;
          }

          // Wait before next attempt (if not last attempt)
          if (attempt < maxAttempts) {
            const waitTimeSeconds = Math.round(currentDelay / 1000);
            console.log(
              `${logPrefix} Waiting ${String(waitTimeSeconds)}s before next attempt...`,
            );
            await wait(currentDelay);

            // Apply exponential backoff
            if (useExponentialBackoff) {
              currentDelay = Math.min(currentDelay * 1.5, maxBackoffDelay);
            }
          }
        } catch (attemptError) {
          console.warn(
            `${logPrefix} ⚠️ Attempt ${String(attempt)} failed:`,
            attemptError,
          );

          // Call retry callback even on error
          if (onRetry) {
            onRetry({
              attempt,
              maxAttempts,
              elapsedTime: Date.now() - startTime,
              maxPollingTime,
              statusMessage: "Retrying after error...",
            });
          }

          // Continue polling even if there's an API error
          if (attempt < maxAttempts) {
            console.log(
              `${logPrefix} Retrying after error, waiting ${String(Math.round(currentDelay / 1000))}s...`,
            );
            await wait(currentDelay);

            if (useExponentialBackoff) {
              currentDelay = Math.min(currentDelay * 1.5, maxBackoffDelay);
            }
          }
        }
      }

      // All retries exhausted - log final status
      const finalElapsedTime = Date.now() - startTime;
      console.warn(
        `${logPrefix} ⚠️ Completed after ${String(attempt)} attempts (${String(Math.round(finalElapsedTime / 1000))}s)`,
      );

      // Check if we have partial results
      if (lastResponse && getProgressFn) {
        const progressData = getProgressFn(lastResponse);
        if (progressData.processed > 0) {
          console.log(
            `${logPrefix} Returning partial results: ${String(progressData.processed)}/${String(progressData.total)} items processed`,
          );
        } else {
          console.warn(
            `${logPrefix} No items were successfully processed. Processing may still be ongoing.`,
          );
        }
      } else if (lastResponse) {
        console.warn(
          `${logPrefix} Max retries reached. Processing may still be ongoing.`,
        );
      }

      return lastResponse;
    } catch (error) {
      console.error(`${logPrefix} ✗ Fatal processing error:`, error);
      return null;
    }
  };

  return {
    processWithRetry,
  };
}

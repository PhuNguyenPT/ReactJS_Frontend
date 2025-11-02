import {
  getAdmissionForStudent,
  type AdmissionResponse,
} from "../../services/studentAdmission/studentAdmissionService";

/**
 * Utility function to wait for a specified time
 * @param ms - Milliseconds to wait
 */
const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Check if admission response has valid data
 * @param response - The admission response to check
 * @returns boolean indicating if the response contains valid admission data
 */
const isAdmissionSuccessful = (response: AdmissionResponse | null): boolean => {
  if (!response?.success) {
    return false;
  }

  // Check if we have any meaningful data
  const { data } = response;
  if (!data) {
    return false;
  }

  // Check if data is an array (AdmissionProgram[])
  if (Array.isArray(data)) {
    return data.length > 0;
  }

  // Check if data has content property (AdmissionApiResponse)
  if (
    typeof data === "object" &&
    "content" in data &&
    Array.isArray(data.content)
  ) {
    return data.content.length > 0;
  }

  return false;
};

/**
 * Get a status message based on the admission response
 * @param response - The admission response
 * @param isAuthenticated - Whether the user is authenticated
 * @returns Status message string
 */
const getAdmissionStatusMessage = (
  response: AdmissionResponse | null,
  isAuthenticated: boolean,
): string => {
  if (!response) {
    return "No admission response received";
  }

  if (isAdmissionSuccessful(response)) {
    return `Successfully retrieved admission data for ${isAuthenticated ? "authenticated" : "guest"} user`;
  }

  if (response.data) {
    return "Admission processing is still in progress. Please try again in a moment.";
  }

  return "Unable to retrieve admission data at this time";
};

/**
 * Configuration options for admission processing retry behavior
 */
export interface AdmissionProcessingOptions {
  /** Initial delay before first attempt (ms). Default: 3000 */
  initialDelay?: number;
  /** Maximum number of retry attempts. Default: 12 */
  maxRetries?: number;
  /** Base delay between retries (ms). Default: 3000 */
  retryDelay?: number;
  /** Whether to use exponential backoff. Default: true */
  useExponentialBackoff?: boolean;
  /** Maximum delay for exponential backoff (ms). Default: 10000 */
  maxBackoffDelay?: number;
  /** Callback function called on each retry attempt */
  onRetry?: (attempt: number, maxRetries: number) => void;
}

/**
 * Custom hook for handling admission processing
 * Provides a clean interface for triggering and managing admission operations
 */
export function useAdmissionHandler() {
  /**
   * Handle admission processing with exponential backoff retry logic
   * @param studentId - The student ID
   * @param isAuthenticated - Whether the user is authenticated
   * @param options - Configuration options for retry behavior
   * @returns Promise with admission response or null if max attempts reached
   */
  const processAdmission = async (
    studentId: string,
    isAuthenticated: boolean,
    options: AdmissionProcessingOptions = {},
  ): Promise<AdmissionResponse | null> => {
    // Updated defaults to match common usage pattern from NinthFormPage
    const {
      initialDelay = 3000, // Wait 3s for ML to initialize
      maxRetries = 12, // Try up to 12 times (aligned with NinthFormPage)
      retryDelay = 3000, // Start with 3s between retries
      useExponentialBackoff = true, // Enable smart retry delays
      maxBackoffDelay = 10000, // Cap retry delay at 10s (aligned with NinthFormPage)
      onRetry,
    } = options;

    try {
      console.log(
        "[Admission Handler] Initiating admission processing for student:",
        studentId,
      );
      console.log("[Admission Handler] Configuration:", {
        initialDelay: `${String(initialDelay / 1000)}s`,
        maxRetries,
        retryDelay: `${String(retryDelay / 1000)}s`,
        useExponentialBackoff,
        maxBackoffDelay: `${String(maxBackoffDelay / 1000)}s`,
      });

      // Initial wait to allow ML processing to start
      if (initialDelay > 0) {
        console.log(
          `[Admission Handler] Waiting ${String(initialDelay / 1000)}s for ML processing to initialize...`,
        );
        await wait(initialDelay);
      }

      let lastResponse: AdmissionResponse | null = null;
      let currentDelay = retryDelay;

      // Polling loop with retry logic
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(
          `[Admission Handler] Attempt ${String(attempt)}/${String(maxRetries)} - Checking admission status...`,
        );

        try {
          const response = await getAdmissionForStudent(
            studentId,
            isAuthenticated,
          );
          lastResponse = response;

          // Check if we got successful results
          if (isAdmissionSuccessful(response)) {
            console.log(
              `[Admission Handler] ✓ ML prediction completed successfully on attempt ${String(attempt)}`,
            );
            const statusMessage = getAdmissionStatusMessage(
              response,
              isAuthenticated,
            );
            console.log(`[Admission Handler] ${statusMessage}`);
            return response;
          }

          // Check if response indicates processing is still ongoing
          const hasPartialData = response.data !== undefined;

          if (attempt < maxRetries) {
            if (hasPartialData) {
              console.log(
                `[Admission Handler] ML processing in progress, retrying in ${String(currentDelay / 1000)}s...`,
              );
            } else {
              console.log(
                `[Admission Handler] No data yet, retrying in ${String(currentDelay / 1000)}s...`,
              );
            }

            // Call retry callback if provided
            if (onRetry) {
              onRetry(attempt, maxRetries);
            }

            await wait(currentDelay);

            // Apply exponential backoff for next attempt
            if (useExponentialBackoff) {
              currentDelay = Math.min(currentDelay * 1.5, maxBackoffDelay);
            }
          }
        } catch (attemptError) {
          console.warn(
            `[Admission Handler] Attempt ${String(attempt)} failed:`,
            attemptError,
          );

          // Continue retrying even if individual attempt fails
          if (attempt < maxRetries) {
            console.log(
              `[Admission Handler] Retrying after error in ${String(currentDelay / 1000)}s...`,
            );

            // Call retry callback even on error
            if (onRetry) {
              onRetry(attempt, maxRetries);
            }

            await wait(currentDelay);

            if (useExponentialBackoff) {
              currentDelay = Math.min(currentDelay * 1.5, maxBackoffDelay);
            }
          }
        }
      }

      // All retries exhausted
      const statusMessage = getAdmissionStatusMessage(
        lastResponse,
        isAuthenticated,
      );
      console.warn(`[Admission Handler] ${statusMessage}`);
      console.warn(
        `[Admission Handler] Max retries (${String(maxRetries)}) reached. ML processing may still be ongoing.`,
      );
      console.warn(
        "[Admission Handler] Consider increasing maxRetries or checking ML service status.",
      );

      return lastResponse;
    } catch (error) {
      console.error(
        "[Admission Handler] Fatal error during admission processing:",
        error,
      );
      return null;
    }
  };

  return {
    processAdmission,
    isAdmissionSuccessful,
    getAdmissionStatusMessage,
  };
}

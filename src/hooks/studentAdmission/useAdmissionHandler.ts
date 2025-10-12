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
    options: {
      initialDelay?: number;
      maxRetries?: number;
      retryDelay?: number;
      useExponentialBackoff?: boolean;
      maxBackoffDelay?: number;
      onRetry?: (attempt: number, maxRetries: number) => void;
    } = {},
  ): Promise<AdmissionResponse | null> => {
    const {
      initialDelay = 3000, // Wait 3s initially (reduced from 20s for faster first check)
      maxRetries = 10, // Increased from 5 for ML processing
      retryDelay = 3000, // Base retry delay
      useExponentialBackoff = true,
      maxBackoffDelay = 15000, // Max 15s between retries
      onRetry,
    } = options;

    try {
      console.log(
        "[Admission Handler] Initiating admission processing for student...",
      );

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
            console.log(statusMessage);
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

      return lastResponse;
    } catch (error) {
      console.error(
        "[Admission Handler] Fatal error during admission processing:",
        error,
      );
      return null;
    }
  };

  /**
   * Process admission with custom wait time and single retry
   * Useful when you know the ML processing time
   * @param studentId - The student ID
   * @param isAuthenticated - Whether the user is authenticated
   * @param waitTime - Time to wait before checking (default: 30000ms)
   * @returns Promise with admission response or null
   */
  const processAdmissionWithWait = async (
    studentId: string,
    isAuthenticated: boolean,
    waitTime = 30000,
  ): Promise<AdmissionResponse | null> => {
    return processAdmission(studentId, isAuthenticated, {
      initialDelay: waitTime,
      maxRetries: 1,
      retryDelay: 0,
    });
  };

  /**
   * Process admission with immediate polling (no initial wait)
   * Starts checking immediately with retries
   * @param studentId - The student ID
   * @param isAuthenticated - Whether the user is authenticated
   * @returns Promise with admission response or null
   */
  const processAdmissionWithPolling = async (
    studentId: string,
    isAuthenticated: boolean,
  ): Promise<AdmissionResponse | null> => {
    return processAdmission(studentId, isAuthenticated, {
      initialDelay: 0,
      maxRetries: 15,
      retryDelay: 2000,
      useExponentialBackoff: true,
    });
  };

  /**
   * Process admission without any wait time (immediate single call)
   * @param studentId - The student ID
   * @param isAuthenticated - Whether the user is authenticated
   * @returns Promise with admission response or null
   */
  const processAdmissionImmediate = async (
    studentId: string,
    isAuthenticated: boolean,
  ): Promise<AdmissionResponse | null> => {
    return processAdmission(studentId, isAuthenticated, {
      initialDelay: 0,
      maxRetries: 1,
      retryDelay: 0,
    });
  };

  return {
    processAdmission,
    processAdmissionWithWait,
    processAdmissionWithPolling,
    processAdmissionImmediate,
    isAdmissionSuccessful,
    getAdmissionStatusMessage,
  };
}

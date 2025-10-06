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
   * Handle admission processing with retry logic
   * @param studentId - The student ID
   * @param isAuthenticated - Whether the user is authenticated
   * @param initialWaitTime - Fixed wait time before first attempt (default: 7000ms = 7s)
   * @param maxRetries - Maximum number of retry attempts (default: 3)
   * @param retryDelay - Delay between retries in milliseconds (default: 2000ms)
   * @returns Promise with admission response or null if error occurs
   */
  const processAdmission = async (
    studentId: string,
    isAuthenticated: boolean,
    initialWaitTime = 10000,
    maxRetries = 3,
    retryDelay = 2000,
  ): Promise<AdmissionResponse | null> => {
    try {
      console.log(
        "[Admission Handler] Initiating admission processing for student...",
      );

      // Wait for the initial fixed time to allow admission processing to complete
      console.log(
        `[Admission Handler] Waiting ${String(initialWaitTime / 1000)} seconds for admission processing to complete...`,
      );
      await wait(initialWaitTime);
      console.log(
        "[Admission Handler] Initial wait complete, checking admission results...",
      );

      let lastResponse: AdmissionResponse | null = null;

      // Try multiple times with delay, as admission processing might take time
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(
          `[Admission Handler] Attempt ${String(attempt)}/${String(maxRetries)}`,
        );

        const response = await getAdmissionForStudent(
          studentId,
          isAuthenticated,
        );
        lastResponse = response;

        // Check if we got successful results
        if (isAdmissionSuccessful(response)) {
          console.log(
            `[Admission Handler] Successfully received admission results on attempt ${String(attempt)}`,
          );
          const statusMessage = getAdmissionStatusMessage(
            response,
            isAuthenticated,
          );
          console.log(statusMessage);
          return response;
        }

        // If not the last attempt, wait before retrying
        if (attempt < maxRetries) {
          const hasData = response.data !== undefined;

          if (hasData) {
            console.log(
              `[Admission Handler] Admission processing still in progress, waiting ${String(retryDelay)}ms before retry...`,
            );
          } else {
            console.log(
              `[Admission Handler] No admission data found, waiting ${String(retryDelay)}ms before retry...`,
            );
          }
          await wait(retryDelay);
        }
      }

      // All retries exhausted
      const statusMessage = getAdmissionStatusMessage(
        lastResponse,
        isAuthenticated,
      );
      console.warn(`[Admission Handler] ${statusMessage}`);
      console.warn(
        `[Admission Handler] Admission processing may still be in progress. Results will be available later.`,
      );

      return lastResponse;
    } catch (admissionError) {
      console.error(
        "[Admission Handler] Admission processing error:",
        admissionError,
      );
      // Don't fail the entire process if admission fails
      // Admission is supplementary to the main profile
      return null;
    }
  };

  /**
   * Process admission without retries and with custom wait time
   * @param studentId - The student ID
   * @param isAuthenticated - Whether the user is authenticated
   * @param waitTime - Time to wait before checking (default: 30000ms = 30s)
   * @returns Promise with admission response or null if error occurs
   */
  const processAdmissionWithWait = async (
    studentId: string,
    isAuthenticated: boolean,
    waitTime = 30000,
  ): Promise<AdmissionResponse | null> => {
    return processAdmission(studentId, isAuthenticated, waitTime, 1, 0);
  };

  /**
   * Process admission without any wait time (immediate single call)
   * @param studentId - The student ID
   * @param isAuthenticated - Whether the user is authenticated
   * @returns Promise with admission response or null if error occurs
   */
  const processAdmissionImmediate = async (
    studentId: string,
    isAuthenticated: boolean,
  ): Promise<AdmissionResponse | null> => {
    return processAdmission(studentId, isAuthenticated, 0, 1, 0);
  };

  return {
    processAdmission,
    processAdmissionWithWait,
    processAdmissionImmediate,
    isAdmissionSuccessful,
    getAdmissionStatusMessage,
  };
}

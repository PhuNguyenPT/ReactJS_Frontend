import {
  triggerOcrForStudent,
  isOcrSuccessful,
  getOcrStatusMessage,
  type OcrResponse,
} from "../../services/fileUpload/ocrAnalyseService";

/**
 * Get student ID from localStorage
 * @throws Error if studentId is not found
 */
function getStudentIdFromStorage(): string {
  const studentId = localStorage.getItem("studentId");
  if (!studentId) {
    throw new Error(
      "Student ID not found in localStorage. Please complete profile creation first.",
    );
  }
  return studentId;
}

/**
 * Utility function to wait for a specified time
 * @param ms - Milliseconds to wait
 */
const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Custom hook for handling OCR processing
 * Provides a clean interface for triggering and managing OCR operations
 */
export function useOcrHandler() {
  /**
   * Handle OCR processing for uploaded files with retry logic
   * @param isAuthenticated - Whether the user is authenticated
   * @param studentId - Optional student ID (defaults to localStorage value)
   * @param initialWaitTime - Fixed wait time before first attempt (default: 10000ms = 10s)
   * @param maxRetries - Maximum number of retry attempts (default: 3)
   * @param retryDelay - Delay between retries in milliseconds (default: 2000ms)
   * @returns Promise with OCR response or null if error occurs
   */
  const processOcr = async (
    isAuthenticated: boolean,
    studentId?: string,
    initialWaitTime = 10000,
    maxRetries = 3,
    retryDelay = 2000,
  ): Promise<OcrResponse | null> => {
    const targetStudentId = studentId ?? getStudentIdFromStorage();

    try {
      console.log(
        "[OCR Handler] Initiating OCR processing for uploaded files...",
      );
      console.log("[OCR Handler] Using student ID:", targetStudentId);

      // Wait for the initial fixed time (10s by default) to allow OCR processing to complete
      console.log(
        `[OCR Handler] ⏳ Waiting ${String(initialWaitTime / 1000)} seconds for OCR processing to complete...`,
      );
      await wait(initialWaitTime);
      console.log(
        "[OCR Handler] ✓ Initial wait complete, checking OCR results...",
      );

      let lastResponse: OcrResponse | null = null;

      // Try multiple times with delay, as OCR processing might take time
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(
          `[OCR Handler] Attempt ${String(attempt)}/${String(maxRetries)}`,
        );

        const response = await triggerOcrForStudent(
          isAuthenticated,
          targetStudentId,
        );
        lastResponse = response;

        // Check if we got successful results
        if (isOcrSuccessful(response)) {
          console.log(
            `[OCR Handler] ✓ Successfully received OCR results on attempt ${String(attempt)}`,
          );
          const statusMessage = getOcrStatusMessage(response, isAuthenticated);
          console.log(statusMessage);
          return response;
        }

        // If not the last attempt, wait before retrying
        if (attempt < maxRetries) {
          const hasData = response.data && response.data.length > 0;
          const allNull = response.data?.every((item) => item.scores === null);

          if (hasData && allNull) {
            console.log(
              `[OCR Handler] ⏳ OCR processing still in progress, waiting ${String(retryDelay)}ms before retry...`,
            );
            await wait(retryDelay);
          } else if (!hasData) {
            console.log(
              `[OCR Handler] ⚠ No OCR data found, waiting ${String(retryDelay)}ms before retry...`,
            );
            await wait(retryDelay);
          }
        }
      }

      // All retries exhausted
      const statusMessage = getOcrStatusMessage(lastResponse, isAuthenticated);
      console.warn(`[OCR Handler] ⚠ ${statusMessage}`);
      console.warn(
        `[OCR Handler] OCR processing may still be in progress. Results will be available later.`,
      );

      return lastResponse;
    } catch (ocrError) {
      console.error("[OCR Handler] ✗ OCR processing error:", ocrError);
      // Don't fail the entire process if OCR fails
      // OCR is supplementary to the main profile
      return null;
    }
  };

  /**
   * Process OCR without retries and with custom wait time
   * @param isAuthenticated - Whether the user is authenticated
   * @param studentId - Optional student ID (defaults to localStorage value)
   * @param waitTime - Time to wait before checking (default: 30000ms = 30s)
   * @returns Promise with OCR response or null if error occurs
   */
  const processOcrWithWait = async (
    isAuthenticated: boolean,
    studentId?: string,
    waitTime = 30000,
  ): Promise<OcrResponse | null> => {
    return processOcr(isAuthenticated, studentId, waitTime, 1, 0);
  };

  /**
   * Process OCR without any wait time (immediate single call)
   * @param isAuthenticated - Whether the user is authenticated
   * @param studentId - Optional student ID (defaults to localStorage value)
   * @returns Promise with OCR response or null if error occurs
   */
  const processOcrImmediate = async (
    isAuthenticated: boolean,
    studentId?: string,
  ): Promise<OcrResponse | null> => {
    return processOcr(isAuthenticated, studentId, 0, 1, 0);
  };

  return {
    processOcr,
    processOcrWithWait,
    processOcrImmediate,
    isOcrSuccessful,
    getOcrStatusMessage,
  };
}

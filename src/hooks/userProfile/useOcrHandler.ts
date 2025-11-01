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
 * Check if all OCR results have valid scores
 * @param response - The OCR response to check
 * @returns boolean indicating if all files have scores
 */
const hasAllValidScores = (response: OcrResponse | null): boolean => {
  if (!response?.success || !response.data || response.data.length === 0) {
    return false;
  }

  // Check if ALL files have scores (not just some)
  return response.data.every(
    (item) =>
      item.scores !== null &&
      Array.isArray(item.scores) &&
      item.scores.length > 0,
  );
};

/**
 * Custom hook for handling OCR processing
 * Provides a clean interface for triggering and managing OCR operations
 */
export function useOcrHandler() {
  /**
   * Handle OCR processing for uploaded files with polling until all files have scores
   * @param isAuthenticated - Whether the user is authenticated
   * @param studentId - Optional student ID (defaults to localStorage value)
   * @param options - Configuration options for polling behavior
   * @returns Promise with OCR response or null if error occurs
   */
  const processOcr = async (
    isAuthenticated: boolean,
    studentId?: string,
    options?: {
      initialWaitTime?: number; // Initial wait before first attempt (default: 7000ms)
      maxPollingTime?: number; // Maximum total time to poll (default: 120000ms = 2 minutes)
      pollingInterval?: number; // Interval between polling attempts (default: 3000ms)
      maxAttempts?: number; // Maximum number of attempts (default: 12)
    },
  ): Promise<OcrResponse | null> => {
    const {
      initialWaitTime = 7000,
      maxPollingTime = 120000,
      pollingInterval = 3000,
      maxAttempts = 20,
    } = options ?? {};

    const targetStudentId = studentId ?? getStudentIdFromStorage();
    const startTime = Date.now();

    try {
      console.log(
        "[OCR Handler] Initiating OCR processing for uploaded files...",
      );
      console.log("[OCR Handler] Using student ID:", targetStudentId);
      console.log("[OCR Handler] Configuration:", {
        initialWaitTime: `${String(initialWaitTime)}ms`,
        maxPollingTime: `${String(maxPollingTime)}ms`,
        pollingInterval: `${String(pollingInterval)}ms`,
        maxAttempts: String(maxAttempts),
      });

      // Initial wait to give the backend time to start processing
      if (initialWaitTime > 0) {
        console.log(
          `[OCR Handler] Waiting ${String(initialWaitTime / 1000)} seconds before first check...`,
        );
        await wait(initialWaitTime);
      }

      let lastResponse: OcrResponse | null = null;
      let attempt = 0;

      // Continue polling until we have all scores or hit limits
      while (attempt < maxAttempts) {
        const elapsedTime = Date.now() - startTime;

        // Check if we've exceeded max polling time
        if (elapsedTime > maxPollingTime) {
          console.warn(
            `[OCR Handler] ⏱️ Maximum polling time (${String(maxPollingTime)}ms) exceeded after ${String(attempt)} attempts`,
          );
          break;
        }

        attempt++;
        console.log(
          `[OCR Handler] Attempt ${String(attempt)}/${String(maxAttempts)} (${String(Math.round(elapsedTime / 1000))}s elapsed)`,
        );

        try {
          const response = await triggerOcrForStudent(
            isAuthenticated,
            targetStudentId,
          );
          lastResponse = response;

          // Check if ALL files have valid scores
          if (hasAllValidScores(response)) {
            const totalFiles = response.data?.length ?? 0;
            console.log(
              `[OCR Handler] ✅ SUCCESS! All ${String(totalFiles)} files have valid scores after ${String(attempt)} attempts (${String(Math.round(elapsedTime / 1000))}s)`,
            );

            // Log summary of scores
            if (response.data) {
              response.data.forEach((item, index) => {
                const avgScore = item.scores
                  ? item.scores.reduce((sum, s) => sum + s.score, 0) /
                    item.scores.length
                  : 0;
                console.log(
                  `[OCR Handler]   File ${String(index + 1)}: ${String(item.scores?.length ?? 0)} subjects, avg score: ${String(avgScore.toFixed(1))}`,
                );
              });
            }

            return response;
          }

          // Log progress
          if (response.data) {
            const totalFiles = response.data.length;
            const filesWithScores = response.data.filter(
              (item) => item.scores !== null && item.scores.length > 0,
            ).length;
            const progress =
              totalFiles > 0
                ? Math.round((filesWithScores / totalFiles) * 100)
                : 0;

            console.log(
              `[OCR Handler] ⏳ Progress: ${String(filesWithScores)}/${String(totalFiles)} files processed (${String(progress)}%)`,
            );

            // If we have partial results, show which files are still pending
            if (filesWithScores < totalFiles) {
              const pendingFiles = response.data
                .filter((item) => !item.scores || item.scores.length === 0)
                .map((item) => item.fileId);
              console.log(
                `[OCR Handler]   Pending files: ${pendingFiles.slice(0, 3).join(", ")}${pendingFiles.length > 3 ? "..." : ""}`,
              );
            }
          }

          // Wait before next poll
          console.log(
            `[OCR Handler] Waiting ${String(pollingInterval)}ms before next check...`,
          );
          await wait(pollingInterval);
        } catch (apiError) {
          console.error(
            `[OCR Handler] ⚠️ API error on attempt ${String(attempt)}:`,
            apiError,
          );

          // Continue polling even if there's an API error
          // The backend might be temporarily unavailable
          if (attempt < maxAttempts) {
            console.log(
              `[OCR Handler] Retrying after error, waiting ${String(pollingInterval)}ms...`,
            );
            await wait(pollingInterval);
          }
        }
      }

      // Polling completed without getting all scores
      const finalElapsedTime = Date.now() - startTime;
      console.warn(
        `[OCR Handler] ⚠️ Polling completed after ${String(attempt)} attempts (${String(Math.round(finalElapsedTime / 1000))}s)`,
      );

      if (lastResponse?.data) {
        const totalFiles = lastResponse.data.length;
        const filesWithScores = lastResponse.data.filter(
          (item) => item.scores !== null && item.scores.length > 0,
        ).length;

        if (filesWithScores > 0) {
          console.log(
            `[OCR Handler] Partial results: ${String(filesWithScores)}/${String(totalFiles)} files processed`,
          );
          console.log(
            `[OCR Handler] Returning partial results. Remaining files may complete later.`,
          );
        } else {
          console.warn(
            `[OCR Handler] No files were successfully processed. OCR may still be in progress.`,
          );
        }
      }

      return lastResponse;
    } catch (error) {
      console.error("[OCR Handler] ✗ Fatal OCR processing error:", error);
      return null;
    }
  };

  return {
    processOcr,
    hasAllValidScores,
    isOcrSuccessful,
    getOcrStatusMessage,
  };
}

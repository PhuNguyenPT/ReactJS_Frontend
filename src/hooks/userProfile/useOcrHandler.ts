import {
  triggerOcrForStudent,
  isOcrSuccessful,
  getOcrStatusMessage,
  type OcrResponse,
} from "../../services/fileUpload/ocrAnalyseService";
import { useRetryHandler, type RetryOptions } from "../common/useRetryHandler";

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
 * Extract progress information from OCR response
 */
const getOcrProgress = (
  response: OcrResponse,
): { processed: number; total: number; statusMessage?: string } => {
  if (!response.data || response.data.length === 0) {
    return { processed: 0, total: 0, statusMessage: "No files to process" };
  }

  const totalFiles = response.data.length;
  const filesWithScores = response.data.filter(
    (item) => item.scores !== null && item.scores.length > 0,
  ).length;

  // Build status message with pending files info
  let statusMessage = `Processing files (${String(filesWithScores)}/${String(totalFiles)})`;

  if (filesWithScores < totalFiles) {
    const pendingFiles = response.data
      .filter((item) => !item.scores || item.scores.length === 0)
      .map((item) => item.fileId);

    const pendingPreview =
      pendingFiles.length > 3
        ? `${pendingFiles.slice(0, 3).join(", ")}...`
        : pendingFiles.join(", ");

    statusMessage += ` | Pending: ${pendingPreview}`;
  }

  return {
    processed: filesWithScores,
    total: totalFiles,
    statusMessage,
  };
};

/**
 * Custom hook for handling OCR processing with advanced retry logic
 */
export function useOcrHandler() {
  const { processWithRetry } = useRetryHandler();

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
    options?: Partial<RetryOptions>,
  ): Promise<OcrResponse | null> => {
    const targetStudentId = studentId ?? getStudentIdFromStorage();

    return processWithRetry<OcrResponse>(
      () => triggerOcrForStudent(isAuthenticated, targetStudentId),
      hasAllValidScores,
      getOcrProgress,
      {
        logPrefix: "[OCR Handler]",
        ...options,
      },
    );
  };

  return {
    processOcr,
    hasAllValidScores,
    isOcrSuccessful,
    getOcrStatusMessage,
  };
}

import apiFetch from "../../utils/apiFetch";
import type { OcrResultItem, OcrResponse } from "../../type/interface/ocrTypes";

// Re-export types for convenience
export type { OcrResultItem, OcrResponse } from "../../type/interface/ocrTypes";

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
 * Normalize OCR response to ensure consistent structure
 * The API returns an array directly: [{ id: "...", subjectScores: [...] }]
 */
function normalizeOcrResponse(
  response: OcrResultItem[] | { data: OcrResultItem[] },
): OcrResultItem[] {
  // Handle array response (direct from API)
  if (Array.isArray(response)) {
    return response;
  }

  // Handle wrapped response with data property
  if ("data" in response && Array.isArray(response.data)) {
    return response.data;
  }

  // Unexpected structure - return empty array
  return [];
}

/**
 * Trigger OCR processing for a student (authenticated users)
 * @param studentId - Optional student ID (defaults to localStorage value)
 * @returns Promise with OCR response
 */
export async function triggerStudentOcr(
  studentId?: string,
): Promise<OcrResponse> {
  const targetStudentId = studentId ?? getStudentIdFromStorage();

  try {
    const response = await apiFetch<
      OcrResultItem[] | { data: OcrResultItem[] },
      null
    >(`/ocr/${targetStudentId}`, {
      method: "GET",
      requiresAuth: true,
    });

    const ocrResults = normalizeOcrResponse(response);

    // Count how many have actual scores
    const withScores = ocrResults.filter(
      (item) => item.subjectScores.length > 0,
    );

    return {
      success: true,
      message: `OCR processing completed: ${String(withScores.length)}/${String(ocrResults.length)} files processed`,
      data: ocrResults,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "OCR processing failed",
      data: undefined,
    };
  }
}

/**
 * Trigger OCR processing for a guest student (no authentication required)
 * @param studentId - Optional student ID (defaults to localStorage value)
 * @returns Promise with OCR response
 */
export async function triggerGuestStudentOcr(
  studentId?: string,
): Promise<OcrResponse> {
  const targetStudentId = studentId ?? getStudentIdFromStorage();

  try {
    const response = await apiFetch<
      OcrResultItem[] | { data: OcrResultItem[] },
      null
    >(`/ocr/guest/${targetStudentId}`, {
      method: "GET",
      requiresAuth: false,
    });

    const ocrResults = normalizeOcrResponse(response);

    // Count how many have actual scores
    const withScores = ocrResults.filter(
      (item) => item.subjectScores.length > 0,
    );

    return {
      success: true,
      message: `OCR processing completed: ${String(withScores.length)}/${String(ocrResults.length)} files processed`,
      data: ocrResults,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "OCR processing failed",
      data: undefined,
    };
  }
}

/**
 * Smart OCR function that chooses the right endpoint based on authentication
 * @param isAuthenticated - Whether the user is authenticated
 * @param studentId - Optional student ID (defaults to localStorage value)
 * @returns Promise with OCR response
 */
export async function triggerOcrForStudent(
  isAuthenticated: boolean,
  studentId?: string,
): Promise<OcrResponse> {
  const targetStudentId = studentId ?? getStudentIdFromStorage();

  if (isAuthenticated) {
    return triggerStudentOcr(targetStudentId);
  } else {
    return triggerGuestStudentOcr(targetStudentId);
  }
}

/**
 * Check if OCR processing was successful
 * @param response - The OCR response to check
 * @returns boolean indicating success
 */
export function isOcrSuccessful(response: OcrResponse | null): boolean {
  if (!response?.success) {
    return false;
  }

  // Check if we have data and at least some results with scores
  const hasData = response.data && response.data.length > 0;
  const hasScores = response.data?.some(
    (item) => item.subjectScores.length > 0,
  );

  return hasData === true && hasScores === true;
}

/**
 * Get a user-friendly status message for OCR processing
 * @param response - The OCR response
 * @param isAuthenticated - Whether the user was authenticated
 * @returns Status message string
 */
export function getOcrStatusMessage(
  response: OcrResponse | null,
  isAuthenticated: boolean,
): string {
  if (!response) {
    return "No OCR processing performed";
  }

  const userType = isAuthenticated ? "authenticated" : "guest";

  if (response.success && response.data) {
    const totalFiles = response.data.length;
    const processedFiles = response.data.filter(
      (item) => item.subjectScores.length > 0,
    ).length;
    const pendingFiles = totalFiles - processedFiles;

    if (pendingFiles > 0) {
      return `OCR processing for ${userType} user: ${String(processedFiles)}/${String(totalFiles)} files completed, ${String(pendingFiles)} still processing`;
    }

    return `OCR processing completed for ${userType} user: ${String(processedFiles)}/${String(totalFiles)} files processed successfully`;
  }

  return `OCR processing failed for ${userType} user: ${response.message ?? "Unknown error"}`;
}

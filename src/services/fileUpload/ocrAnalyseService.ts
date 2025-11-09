import apiFetch from "../../utils/apiFetch";
import type { OcrResultItem } from "../../type/interface/ocrTypes";

export interface OcrResponse {
  success: boolean;
  message?: string;
  data?: OcrResultItem[];
}

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

    // Handle different response structures
    let ocrResults: OcrResultItem[];

    // Check if response is wrapped in a data property
    if (typeof response === "object" && "data" in response) {
      ocrResults = response.data;
    } else if (Array.isArray(response)) {
      // Response is directly an array
      ocrResults = response;
    } else {
      console.warn("[OCR] Unexpected response structure:", response);
      ocrResults = [];
    }
    // Count how many have actual scores
    const withScores = ocrResults.filter(
      (item) => item.scores !== null && item.scores.length > 0,
    );

    return {
      success: true,
      message: `OCR processing completed: ${String(withScores.length)}/${String(ocrResults.length)} files processed`,
      data: ocrResults,
    };
  } catch (error) {
    console.error("[OCR] Authenticated OCR error:", error);
    throw error;
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

    // Handle different response structures
    let ocrResults: OcrResultItem[];

    // Check if response is wrapped in a data property
    if (typeof response === "object" && "data" in response) {
      ocrResults = response.data;
    } else if (Array.isArray(response)) {
      // Response is directly an array
      ocrResults = response;
    } else {
      console.warn("[OCR] Unexpected response structure:", response);
      ocrResults = [];
    }

    // Count how many have actual scores
    const withScores = ocrResults.filter(
      (item) => item.scores !== null && item.scores.length > 0,
    );

    return {
      success: true,
      message: `OCR processing completed: ${String(withScores.length)}/${String(ocrResults.length)} files processed`,
      data: ocrResults,
    };
  } catch (error) {
    console.error("[OCR] Guest OCR error:", error);
    throw error;
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
    (item) => item.scores !== null && item.scores.length > 0,
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
      (item) => item.scores !== null && item.scores.length > 0,
    ).length;
    const pendingFiles = totalFiles - processedFiles;

    if (pendingFiles > 0) {
      return `OCR processing for ${userType} user: ${String(processedFiles)}/${String(totalFiles)} files completed, ${String(pendingFiles)} still processing`;
    }

    return `OCR processing completed for ${userType} user: ${String(processedFiles)}/${String(totalFiles)} files processed successfully`;
  }

  return `OCR processing failed for ${userType} user: ${response.message ?? "Unknown error"}`;
}

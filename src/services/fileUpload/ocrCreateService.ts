import apiFetch from "../../utils/apiFetch";
import type {
  SubjectScorePayload,
  OcrCreatePayload,
  OcrCreateResponse,
} from "../../type/interface/ocrServiceTypes";

/**
 * Create new OCR data for authenticated user
 * POST /ocr/{studentId}
 * @param studentId - The student ID from localStorage
 * @param payload - The subject scores to save (including grade and semester)
 * @returns Response with success status and the new OCR ID
 */
export async function createOcrForAuthenticatedUser(
  studentId: string,
  payload: OcrCreatePayload,
): Promise<OcrCreateResponse> {
  try {
    const response = await apiFetch<{ id: string }, OcrCreatePayload>(
      `/ocr/${studentId}`,
      {
        method: "POST",
        body: payload,
        requiresAuth: true,
      },
    );

    return {
      success: true,
      data: response,
      ocrId: response.id,
      message: "OCR data created successfully",
    };
  } catch (error) {
    console.error(
      "[OcrCreateService] Error creating OCR for authenticated user:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create OCR data",
    };
  }
}

/**
 * Create new OCR data for guest user
 * POST /ocr/guest/{studentId}
 * @param studentId - The student ID from localStorage
 * @param payload - The subject scores to save (including grade and semester)
 * @returns Response with success status and the new OCR ID
 */
export async function createOcrForGuestUser(
  studentId: string,
  payload: OcrCreatePayload,
): Promise<OcrCreateResponse> {
  try {
    const response = await apiFetch<{ id: string }, OcrCreatePayload>(
      `/ocr/guest/${studentId}`,
      {
        method: "POST",
        body: payload,
        requiresAuth: false,
      },
    );

    return {
      success: true,
      data: response,
      ocrId: response.id,
      message: "OCR data created successfully",
    };
  } catch (error) {
    console.error(
      "[OcrCreateService] Error creating OCR for guest user:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create OCR data",
    };
  }
}

/**
 * Create OCR data based on authentication status
 * Automatically routes to the correct endpoint
 * @param studentId - The student ID from localStorage
 * @param payload - The subject scores to save (including grade and semester)
 * @param isAuthenticated - Whether the user is authenticated
 * @returns Response with success status and the new OCR ID
 */
export async function createOcrData(
  studentId: string,
  payload: OcrCreatePayload,
  isAuthenticated: boolean,
): Promise<OcrCreateResponse> {
  if (isAuthenticated) {
    return createOcrForAuthenticatedUser(studentId, payload);
  } else {
    return createOcrForGuestUser(studentId, payload);
  }
}

// Re-export types for convenience
export type { SubjectScorePayload, OcrCreatePayload, OcrCreateResponse };

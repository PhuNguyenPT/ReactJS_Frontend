import apiFetch from "../../utils/apiFetch";

export interface SubjectScorePayload {
  name: string;
  score: number;
}

export interface OcrUpdatePayload {
  subjectScores: SubjectScorePayload[];
}

export interface OcrUpdateResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

/**
 * Update OCR data for authenticated user
 * PATCH /ocr/{id}
 */
export async function updateOcrForAuthenticatedUser(
  ocrId: string,
  payload: OcrUpdatePayload,
): Promise<OcrUpdateResponse> {
  try {
    const response = await apiFetch<unknown, OcrUpdatePayload>(
      `/ocr/${ocrId}`,
      {
        method: "PATCH",
        body: payload,
        requiresAuth: true,
      },
    );

    return {
      success: true,
      data: response,
      message: "OCR data updated successfully",
    };
  } catch (error) {
    console.error(
      "[OcrUpdateService] Error updating OCR for authenticated user:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update OCR data",
    };
  }
}

/**
 * Update OCR data for guest user
 * PATCH /ocr/guest/{id}
 */
export async function updateOcrForGuestUser(
  ocrId: string,
  payload: OcrUpdatePayload,
): Promise<OcrUpdateResponse> {
  try {
    const response = await apiFetch<unknown, OcrUpdatePayload>(
      `/ocr/guest/${ocrId}`,
      {
        method: "PATCH",
        body: payload,
        requiresAuth: false,
      },
    );

    return {
      success: true,
      data: response,
      message: "OCR data updated successfully",
    };
  } catch (error) {
    console.error(
      "[OcrUpdateService] Error updating OCR for guest user:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update OCR data",
    };
  }
}

/**
 * Update OCR data based on authentication status
 */
export async function updateOcrData(
  ocrId: string,
  payload: OcrUpdatePayload,
  isAuthenticated: boolean,
): Promise<OcrUpdateResponse> {
  if (isAuthenticated) {
    return updateOcrForAuthenticatedUser(ocrId, payload);
  } else {
    return updateOcrForGuestUser(ocrId, payload);
  }
}

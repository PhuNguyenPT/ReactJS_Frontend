/**
 * Shared types for OCR services
 */

export interface SubjectScorePayload {
  name: string;
  score: number;
}

export interface OcrPayloadBase {
  subjectScores: SubjectScorePayload[];
}

export interface OcrResponseBase {
  success: boolean;
  message?: string;
  data?: unknown;
}

// Re-export for convenience
export type OcrCreatePayload = OcrPayloadBase;
export type OcrUpdatePayload = OcrPayloadBase;

export interface OcrCreateResponse extends OcrResponseBase {
  ocrId?: string; // Only present in create responses
}

export type OcrUpdateResponse = OcrResponseBase;

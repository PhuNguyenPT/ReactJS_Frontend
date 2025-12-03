// OCR score item structure - matches API response
export interface OcrScoreItem {
  name: string;
  score: number;
}

// OCR result item structure - matches actual API response
export interface OcrResultItem {
  id: string;
  subjectScores: OcrScoreItem[];
}

// OCR API response structure
export interface OcrResponse {
  success: boolean;
  message?: string;
  data?: OcrResultItem[];
}

// Type guard to check if response is successful
export function isSuccessfulOcrResponse(
  response: unknown,
): response is OcrResponse & { success: true; data: OcrResultItem[] } {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === true &&
    "data" in response &&
    Array.isArray(response.data)
  );
}

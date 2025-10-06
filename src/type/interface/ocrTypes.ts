// OCR score item structure
export interface OcrScoreItem {
  name: string;
  score: number;
}

// OCR result item structure (matches your API response)
export interface OcrResultItem {
  createdAt: string;
  fileId: string;
  id: string;
  processedBy: string;
  scores: OcrScoreItem[] | null;
}

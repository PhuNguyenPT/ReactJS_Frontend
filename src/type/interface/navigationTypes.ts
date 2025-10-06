import type { OcrResultItem } from "./ocrTypes";

// Type for the navigation state
export interface NinthFormNavigationState {
  submissionSuccess: boolean;
  responseData: unknown;
  wasAuthenticated: boolean;
  filesUploaded: boolean;
  uploadedFilesCount: number;
  // OCR-related properties
  ocrProcessed?: boolean;
  ocrResults?: OcrResultItem[]; // Direct array of OCR results
}

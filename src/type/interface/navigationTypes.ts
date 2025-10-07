import type { OcrResultItem } from "./ocrTypes";

// Type for the navigation state from EighthForm to NinthForm
export interface NinthFormNavigationState {
  submissionSuccess: boolean;
  responseData: unknown;
  wasAuthenticated: boolean;
  filesUploaded: boolean;
  uploadedFilesCount: number;
  // OCR-related properties
  ocrProcessed?: boolean;
  ocrResults?: OcrResultItem[];
}

// Type for the navigation state after login redirect back to EighthForm
export interface EighthFormNavigationState {
  returnedFromLogin?: boolean;
  redirectedFrom?: string;
}

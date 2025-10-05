// Response structure from the /students API
export interface StudentResponse {
  success?: boolean;
  message?: string;
  id?: string;
  userId?: string;
  majors?: string[];
  data?: {
    id?: string;
    userId?: string;
    email?: string;
    name?: string;
    majors?: string[];
    [key: string]: unknown;
  };
}

// File upload response structure
export interface FileUploadResponse {
  success: boolean;
  message?: string;
  data?: {
    uploadedFiles?: {
      fileName: string;
      fileUrl: string;
      grade: string;
      semester: string;
    }[];
  };
}

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

// Helper type guard to check if response has userId/id
export function hasUserId(response: StudentResponse): string | null {
  // Check for id/userId in different possible locations
  // Priority order: root level id, then data.id, then userId, then data.userId
  const studentId =
    response.id ??
    response.data?.id ??
    response.userId ??
    response.data?.userId;

  if (studentId) {
    console.log("Found student ID:", studentId);
  } else {
    console.warn("No student ID found in response:", response);
  }

  return studentId ?? null;
}

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

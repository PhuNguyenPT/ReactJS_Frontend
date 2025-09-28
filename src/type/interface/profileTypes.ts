// Response structure from the /students API
export interface StudentResponse {
  success?: boolean;
  message?: string;
  userId?: string;
  data?: {
    userId: string;
    email?: string;
    name?: string;
    // Add other fields as needed based on your API response
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

// Helper type guard to check if response has userId
export function hasUserId(response: StudentResponse): string | null {
  // Check for userId in different possible locations
  const userId = response.data?.userId ?? response.userId;
  return userId ?? null;
}

// Type for the navigation state
export interface NinthFormNavigationState {
  submissionSuccess: boolean;
  responseData: StudentResponse["data"] | StudentResponse;
  wasAuthenticated: boolean;
  filesUploaded?: boolean;
  uploadedFilesCount?: number;
}

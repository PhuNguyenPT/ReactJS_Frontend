// File upload response structure
export interface FileUploadResponse {
  success: boolean;
  message?: string;
  data?: {
    uploadedFiles?: {
      fileName: string;
      fileUrl: string;
      previewUrl: string;
      grade: string;
      semester: string;
    }[];
  };
}

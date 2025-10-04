import {
  uploadStudentFiles,
  uploadGuestStudentFiles,
} from "../../services/fileUpload/fileUploadService";
import { isUserAuthenticated } from "../../utils/profileAuthUtils";
import type { FileUploadResponse } from "../../type/interface/profileTypes";

export interface FileUploadPayload {
  grade: string;
  semester: number;
  file: File;
}

/**
 * Main function that automatically uploads files to the correct endpoint
 * based on user authentication status
 */
export async function uploadStudentFilesAuto(
  studentId: string,
  files: FileUploadPayload[],
): Promise<FileUploadResponse> {
  // Prepare files with metadata
  const filePayloads = files.map(({ grade, semester, file }) => ({
    grade,
    semester,
    file,
    fileType: "transcript" as const,
  }));

  // Choose endpoint based on authentication
  if (isUserAuthenticated()) {
    return uploadStudentFiles(studentId, filePayloads);
  } else {
    return uploadGuestStudentFiles(studentId, filePayloads);
  }
}

/**
 * Helper function to check if file upload was successful
 * Handles various response formats
 */
export function isUploadSuccessful(
  response: FileUploadResponse | null,
): boolean {
  if (!response) return false;
  // If success field exists, use it; otherwise assume success if we got a response
  return response.success;
}

/**
 * Get upload status message based on response
 */
export function getUploadStatusMessage(
  response: FileUploadResponse | null,
  isAuthenticated: boolean,
): string {
  if (!response) {
    return "No upload attempted";
  }

  if (isUploadSuccessful(response)) {
    return `Files uploaded successfully via ${isAuthenticated ? "authenticated" : "guest"} endpoint`;
  }

  return response.message ?? "File upload failed";
}

// Re-export for convenience
export { isUserAuthenticated } from "../../utils/profileAuthUtils";
export type { FileUploadResponse } from "../../type/interface/profileTypes";

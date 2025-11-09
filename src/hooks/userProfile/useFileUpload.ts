import {
  uploadStudentFiles,
  uploadGuestStudentFiles,
} from "../../services/fileUpload/fileUploadService";
import { isUserAuthenticated } from "../../utils/profileAuthUtils";
import type { FileUploadResponse } from "../../type/interface/fileUploadTypes";

/**
 * Get student ID from localStorage
 * @throws Error if studentId is not found
 */
function getStudentIdFromStorage(): string {
  const studentId = localStorage.getItem("studentId");
  if (!studentId) {
    throw new Error(
      "Student ID not found in localStorage. Please complete profile creation first.",
    );
  }
  return studentId;
}

export interface FileUploadPayload {
  grade: string;
  semester: number;
  file: File;
}

/**
 * Main function that automatically uploads files to the correct endpoint
 * based on user authentication status
 * @param files - Array of files with metadata
 * @param studentId - Optional student ID (defaults to localStorage value)
 */
export async function uploadStudentFilesAuto(
  files: FileUploadPayload[],
  studentId?: string,
): Promise<FileUploadResponse> {
  const targetStudentId = studentId ?? getStudentIdFromStorage();

  // Prepare files with metadata
  const filePayloads = files.map(({ grade, semester, file }) => ({
    grade,
    semester,
    file,
    fileType: "transcript" as const,
  }));

  // Choose endpoint based on authentication
  if (isUserAuthenticated()) {
    return uploadStudentFiles(filePayloads, targetStudentId);
  } else {
    return uploadGuestStudentFiles(filePayloads, targetStudentId);
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
export type { FileUploadResponse } from "../../type/interface/fileUploadTypes";

import apiFetch from "../../utils/apiFetch";
import type { FileUploadResponse } from "../../type/interface/fileUploadTypes";

export type AllowedFileType =
  | "certificate"
  | "document"
  | "image"
  | "other"
  | "portfolio"
  | "resume"
  | "transcript";

export interface FileUploadPayload {
  grade: string;
  semester: number; // 1-based semester index
  file: File;
  fileType?: AllowedFileType; // optional, defaults to "transcript"
}

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

/**
 * Upload multiple files for a student (authenticated users)
 * @param files - Array of files with metadata
 * @param studentId - Optional student ID (defaults to localStorage value)
 * @returns Promise with upload response
 */
export async function uploadStudentFiles(
  files: FileUploadPayload[],
  studentId?: string,
): Promise<FileUploadResponse> {
  const targetStudentId = studentId ?? getStudentIdFromStorage();

  const formData = new FormData();

  // Append files
  files.forEach(({ file }) => {
    formData.append("files", file);
  });

  // Build metadata (must match file count + order)
  const filesMetadata = files.map(({ grade, semester, file, fileType }) => ({
    fileType: fileType ?? "transcript", // default to transcript
    fileName: file.name,
    description: `Grade ${grade} Semester ${semester.toString()}`,
    tags: `grade-${grade},semester-${semester.toString()}`,
  }));

  // Append metadata JSON string
  formData.append("filesMetadata", JSON.stringify(filesMetadata));

  // Log the metadata for debugging
  console.log("Files metadata being sent (authenticated):", filesMetadata);
  console.log("Using student ID:", targetStudentId);

  // Call API with authentication
  try {
    const response = await apiFetch<FileUploadResponse, FormData>(
      `/files/upload/multiple/${targetStudentId}`,
      {
        method: "POST",
        body: formData,
        requiresAuth: true,
      },
    );

    // If we get here, the request was successful (2xx status)
    // Ensure we return a consistent structure
    return {
      success: true,
      message: response.message ?? "Files uploaded successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Authenticated upload error:", error);
    throw error;
  }
}

/**
 * Upload multiple files for a guest student (no authentication required)
 * @param files - Array of files with metadata
 * @param studentId - Optional student ID (defaults to localStorage value)
 * @returns Promise with upload response
 */
export async function uploadGuestStudentFiles(
  files: FileUploadPayload[],
  studentId?: string,
): Promise<FileUploadResponse> {
  const targetStudentId = studentId ?? getStudentIdFromStorage();

  const formData = new FormData();

  // Append files
  files.forEach(({ file }) => {
    formData.append("files", file);
  });

  // Build metadata (must match file count + order)
  const filesMetadata = files.map(({ grade, semester, file, fileType }) => ({
    fileType: fileType ?? "transcript", // default to transcript
    fileName: file.name,
    description: `Grade ${grade} Semester ${semester.toString()}`,
    tags: `grade-${grade},semester-${semester.toString()}`,
  }));

  // Append metadata JSON string
  formData.append("filesMetadata", JSON.stringify(filesMetadata));

  // Log the metadata for debugging
  console.log("Files metadata being sent (guest):", filesMetadata);
  console.log("Using student ID:", targetStudentId);

  // Call API without authentication
  try {
    const response = await apiFetch<FileUploadResponse, FormData>(
      `/files/upload/multiple/guest/${targetStudentId}`,
      {
        method: "POST",
        body: formData,
        requiresAuth: false, // No auth required for guest upload
      },
    );

    // If we get here, the request was successful (2xx status)
    // Ensure we return a consistent structure
    return {
      success: true,
      message: response.message ?? "Files uploaded successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Guest upload error:", error);
    throw error;
  }
}

/**
 * Smart upload function that chooses the right endpoint based on authentication
 * @param files - Array of files with metadata
 * @param isAuthenticated - Whether the user is authenticated
 * @param studentId - Optional student ID (defaults to localStorage value)
 * @returns Promise with upload response
 */
export async function uploadFilesForStudent(
  files: FileUploadPayload[],
  isAuthenticated: boolean,
  studentId?: string,
): Promise<FileUploadResponse> {
  if (isAuthenticated) {
    return uploadStudentFiles(files, studentId);
  } else {
    return uploadGuestStudentFiles(files, studentId);
  }
}

/**
 * Helper to prepare files from FileData context
 * Converts 0-based semester index to 1-based for API
 */
export function prepareFilesForUpload(
  getAllEighthFormFiles: () => {
    grade: string;
    semester: number;
    file: File;
  }[],
): FileUploadPayload[] {
  return getAllEighthFormFiles().map(({ grade, semester, file }) => ({
    grade,
    semester: semester + 1, // API expects 1 or 2
    file,
    fileType: "transcript", // default type for semester transcripts
  }));
}

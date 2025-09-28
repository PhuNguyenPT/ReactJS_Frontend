import apiFetch from "../../utils/apiFetch";
import type { FileUploadResponse } from "../../type/interface/profileTypes";

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
 * Upload multiple files for a student
 * @param studentId - The student ID from the profile creation response
 * @param files - Array of files with metadata
 * @returns Promise with upload response
 */
export async function uploadStudentFiles(
  studentId: string,
  files: FileUploadPayload[],
): Promise<FileUploadResponse> {
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
    tags: [`grade-${grade}`, `semester-${semester.toString()}`],
  }));

  // Append metadata JSON string
  formData.append("filesMetadata", JSON.stringify(filesMetadata));

  // Call API
  return await apiFetch<FileUploadResponse, FormData>(
    `/files/upload/multiple/${studentId}`,
    {
      method: "POST",
      body: formData,
      requiresAuth: true,
    },
  );
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

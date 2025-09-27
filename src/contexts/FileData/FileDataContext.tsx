import { createContext } from "react";

export type GradeKey = "10" | "11" | "12";
export type SemesterKey = 0 | 1; // 0 for semester 1, 1 for semester 2

export interface FileEntry {
  file: File | null;
  previewUrl: string | null;
}

export interface FileData {
  eighthForm: {
    files: Record<GradeKey, FileEntry[]>; // Each grade has 2 files (2 semesters)
  };
}

export interface FileDataContextType {
  fileData: FileData;
  updateEighthFormFile: (
    grade: GradeKey,
    semesterIndex: SemesterKey,
    file: File | null,
  ) => void;
  getEighthFormFile: (
    grade: GradeKey,
    semesterIndex: SemesterKey,
  ) => File | null;
  getEighthFormPreviewUrl: (
    grade: GradeKey,
    semesterIndex: SemesterKey,
  ) => string | null;
  getAllEighthFormFiles: () => {
    grade: GradeKey;
    semester: SemesterKey;
    file: File;
  }[];
  clearEighthFormFiles: () => void;
  resetFileData: () => void;
  getFileDataForApi: () => FormData; // FormData for API submission
}

export const FileDataContext = createContext<FileDataContextType | undefined>(
  undefined,
);

export const initialFileData: FileData = {
  eighthForm: {
    files: {
      "10": [
        { file: null, previewUrl: null }, // Semester 1
        { file: null, previewUrl: null }, // Semester 2
      ],
      "11": [
        { file: null, previewUrl: null }, // Semester 1
        { file: null, previewUrl: null }, // Semester 2
      ],
      "12": [
        { file: null, previewUrl: null }, // Semester 1
        { file: null, previewUrl: null }, // Semester 2
      ],
    },
  },
};

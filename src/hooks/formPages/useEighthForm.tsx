import React from "react";
import { useTranslation } from "react-i18next";
import { useFileData } from "../../contexts/FileData/useFileData";
import type {
  GradeKey,
  SemesterKey,
} from "../../contexts/FileData/FileDataContext";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";

// Supported file types configuration
export const ACCEPTED_FILE_TYPES = {
  images: ".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg",
  documents: ".pdf,.doc,.docx,.txt,.odt,.rtf",
} as const;

export const ALL_ACCEPTED_TYPES = `${ACCEPTED_FILE_TYPES.images},${ACCEPTED_FILE_TYPES.documents}`;

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  maxSize: Number(import.meta.env.VITE_MAXSIZE_UPLOAD_MB), // You can add minSize or other limits if needed
} as const;

export interface FileUploadData {
  grade: GradeKey;
  semester: SemesterKey;
  file: File | null;
  previewUrl: string | null;
}

export const useEighthForm = () => {
  const { t } = useTranslation();
  const { updateEighthFormFile, getEighthFormFile, getEighthFormPreviewUrl } =
    useFileData();

  // Configuration
  const grades: GradeKey[] = ["10", "11", "12"];
  const semesters = [t("eighthForm.semester1"), t("eighthForm.semester2")];

  // File handling
  const handleFileChange = (
    grade: GradeKey,
    semesterIndex: SemesterKey,
    file: File | null,
  ) => {
    // Validate file before updating
    if (file && !validateFile(file)) {
      return;
    }
    updateEighthFormFile(grade, semesterIndex, file);
  };

  const handleClearFile = (
    grade: GradeKey,
    semesterIndex: SemesterKey,
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    handleFileChange(grade, semesterIndex, null);
  };

  // File validation
  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > FILE_SIZE_LIMITS.maxSize) {
      console.error(
        `File size exceeds ${String(FILE_SIZE_LIMITS.maxSize / 1024 / 1024)}MB limit`,
      );
      return false;
    }

    // Check file type
    const isValidType = isImageFile(file) || isDocumentFile(file);
    if (!isValidType) {
      console.error("Invalid file type");
      return false;
    }

    return true;
  };

  // File type checking
  const isImageFile = (file: File): boolean => {
    return file.type.startsWith("image/");
  };

  const isDocumentFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const documentExtensions = [
      ".pdf",
      ".doc",
      ".docx",
      ".txt",
      ".odt",
      ".rtf",
    ];
    return (
      file.type.includes("document") ||
      file.type === "application/pdf" ||
      file.type === "text/plain" ||
      documentExtensions.some((ext) => fileName.endsWith(ext))
    );
  };

  // Get appropriate icon for file type
  const getFileIcon = (file: File): React.ReactElement => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    if (fileType.startsWith("image/")) {
      return <ImageIcon sx={{ fontSize: 48, color: "#4CAF50" }} />;
    } else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      return <PictureAsPdfIcon sx={{ fontSize: 48, color: "#F44336" }} />;
    } else if (
      fileType.includes("document") ||
      fileName.endsWith(".doc") ||
      fileName.endsWith(".docx")
    ) {
      return <DescriptionIcon sx={{ fontSize: 48, color: "#2196F3" }} />;
    } else {
      return <InsertDriveFileIcon sx={{ fontSize: 48, color: "#757575" }} />;
    }
  };

  // Get file data for a specific grade and semester
  const getFileData = (
    grade: GradeKey,
    semester: SemesterKey,
  ): FileUploadData => {
    const file = getEighthFormFile(grade, semester);
    const previewUrl = getEighthFormPreviewUrl(grade, semester);

    return {
      grade,
      semester,
      file,
      previewUrl,
    };
  };

  // Get all uploaded files
  const getAllUploadedFiles = (): FileUploadData[] => {
    const allFiles: FileUploadData[] = [];

    grades.forEach((grade) => {
      ([0, 1] as SemesterKey[]).forEach((semester) => {
        const fileData = getFileData(grade, semester);
        if (fileData.file) {
          allFiles.push(fileData);
        }
      });
    });

    return allFiles;
  };

  // Check if all files are uploaded
  const areAllFilesUploaded = (): boolean => {
    for (const grade of grades) {
      for (const semester of [0, 1] as SemesterKey[]) {
        if (!getEighthFormFile(grade, semester)) {
          return false;
        }
      }
    }
    return true;
  };

  // Check if any files are uploaded
  const hasAnyFiles = (): boolean => {
    return getAllUploadedFiles().length > 0;
  };

  // Get count of uploaded files
  const getUploadedFileCount = (): number => {
    return getAllUploadedFiles().length;
  };

  // Get total expected files
  const getTotalExpectedFiles = (): number => {
    return grades.length * 2; // 2 semesters per grade
  };

  // Clear all files for a specific grade
  const clearGradeFiles = (grade: GradeKey) => {
    ([0, 1] as SemesterKey[]).forEach((semester) => {
      updateEighthFormFile(grade, semester, null);
    });
  };

  // Clear all files
  const clearAllFiles = () => {
    grades.forEach((grade) => {
      clearGradeFiles(grade);
    });
  };

  return {
    // Configuration
    grades,
    semesters,
    acceptedTypes: ALL_ACCEPTED_TYPES,

    // File handlers
    handleFileChange,
    handleClearFile,
    clearGradeFiles,
    clearAllFiles,

    // File utilities
    getFileIcon,
    isImageFile,
    isDocumentFile,
    validateFile,

    // Data getters
    getEighthFormFile,
    getEighthFormPreviewUrl,
    getFileData,
    getAllUploadedFiles,

    // Status checkers
    areAllFilesUploaded,
    hasAnyFiles,
    getUploadedFileCount,
    getTotalExpectedFiles,

    // Translations
    translations: {
      grade: t("eighthForm.grade"),
      upload: t("eighthForm.upload"),
      replace: t("eighthForm.replace"),
      clearFile: t("eighthForm.clearFile"),
      imageDocument: t("eighthForm.imageDocument"),
    },
  };
};

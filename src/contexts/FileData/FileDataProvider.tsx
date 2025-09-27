import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import {
  FileDataContext,
  initialFileData,
  type FileData,
  type GradeKey,
  type SemesterKey,
} from "./FileDataContext";

const FILE_DATA_STORAGE_KEY = "eighth_form_file_metadata";
const FILE_DATA_TIMESTAMP_KEY = "eighth_form_file_timestamp";

// Set expiration time (in milliseconds) - 2 hours
const FILE_DATA_EXPIRATION_TIME = 2 * 60 * 60 * 1000;

// File metadata for persistence (we can't store actual File objects in localStorage)
interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface StoredFileData {
  eighthForm: {
    fileMetadata: Record<GradeKey, (FileMetadata | null)[]>;
  };
}

// Helper function to check if stored data is expired
function isFileDataExpired(): boolean {
  try {
    const timestamp = localStorage.getItem(FILE_DATA_TIMESTAMP_KEY);
    if (!timestamp) return true;

    const savedTime = parseInt(timestamp);
    const currentTime = Date.now();
    const isExpired = currentTime - savedTime > FILE_DATA_EXPIRATION_TIME;

    if (isExpired) {
      console.log("File data has expired, clearing storage");
      localStorage.removeItem(FILE_DATA_STORAGE_KEY);
      localStorage.removeItem(FILE_DATA_TIMESTAMP_KEY);
    }

    return isExpired;
  } catch (error) {
    console.error("Error checking file data expiration:", error);
    return true;
  }
}

// Helper function to save file metadata with timestamp
function saveFileMetadataWithTimestamp(metadata: StoredFileData): void {
  try {
    localStorage.setItem(FILE_DATA_STORAGE_KEY, JSON.stringify(metadata));
    localStorage.setItem(FILE_DATA_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error("Error saving file metadata to localStorage:", error);
  }
}

// Helper function to extract metadata from FileData
function extractFileMetadata(fileData: FileData): StoredFileData {
  return {
    eighthForm: {
      fileMetadata: {
        "10": fileData.eighthForm.files["10"].map((entry) =>
          entry.file
            ? {
                name: entry.file.name,
                size: entry.file.size,
                type: entry.file.type,
                lastModified: entry.file.lastModified,
              }
            : null,
        ),
        "11": fileData.eighthForm.files["11"].map((entry) =>
          entry.file
            ? {
                name: entry.file.name,
                size: entry.file.size,
                type: entry.file.type,
                lastModified: entry.file.lastModified,
              }
            : null,
        ),
        "12": fileData.eighthForm.files["12"].map((entry) =>
          entry.file
            ? {
                name: entry.file.name,
                size: entry.file.size,
                type: entry.file.type,
                lastModified: entry.file.lastModified,
              }
            : null,
        ),
      },
    },
  };
}

export function FileDataProvider({ children }: { children: ReactNode }) {
  // Initialize state - Note: we start with initialFileData since File objects can't be persisted
  const [fileData, setFileData] = useState<FileData>(initialFileData);

  // Save file metadata whenever fileData changes
  useEffect(() => {
    const metadata = extractFileMetadata(fileData);
    saveFileMetadataWithTimestamp(metadata);
  }, [fileData]);

  // Check for expiration periodically (every 5 minutes)
  useEffect(() => {
    const checkExpiration = () => {
      if (isFileDataExpired()) {
        setFileData(initialFileData);
      }
    };

    // Check immediately
    checkExpiration();

    // Set up periodic check (every 5 minutes)
    const intervalId = setInterval(checkExpiration, 5 * 60 * 1000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Cleanup URLs on component unmount
  useEffect(() => {
    return () => {
      Object.values(fileData.eighthForm.files)
        .flat()
        .forEach((entry) => {
          if (entry.previewUrl) {
            URL.revokeObjectURL(entry.previewUrl);
          }
        });
    };
  }, [fileData.eighthForm.files]);

  // Update a specific file for eighth form
  const updateEighthFormFile = useCallback(
    (grade: GradeKey, semesterIndex: SemesterKey, file: File | null) => {
      setFileData((prev) => {
        const newFileData = { ...prev };
        const currentEntry = newFileData.eighthForm.files[grade][semesterIndex];

        // Clean up previous preview URL
        if (currentEntry.previewUrl) {
          URL.revokeObjectURL(currentEntry.previewUrl);
        }

        // Create new preview URL if file exists
        const previewUrl = file ? URL.createObjectURL(file) : null;

        // Update the specific entry
        newFileData.eighthForm.files[grade][semesterIndex] = {
          file,
          previewUrl,
        };

        return newFileData;
      });
    },
    [],
  );

  // Get a specific file
  const getEighthFormFile = useCallback(
    (grade: GradeKey, semesterIndex: SemesterKey): File | null => {
      return fileData.eighthForm.files[grade][semesterIndex].file;
    },
    [fileData],
  );

  // Get a specific preview URL
  const getEighthFormPreviewUrl = useCallback(
    (grade: GradeKey, semesterIndex: SemesterKey): string | null => {
      return fileData.eighthForm.files[grade][semesterIndex].previewUrl;
    },
    [fileData],
  );

  // Get all uploaded files for API submission
  const getAllEighthFormFiles = useCallback((): {
    grade: GradeKey;
    semester: SemesterKey;
    file: File;
  }[] => {
    const allFiles: { grade: GradeKey; semester: SemesterKey; file: File }[] =
      [];

    (Object.keys(fileData.eighthForm.files) as GradeKey[]).forEach((grade) => {
      fileData.eighthForm.files[grade].forEach((entry, index) => {
        if (entry.file) {
          allFiles.push({
            grade,
            semester: index as SemesterKey,
            file: entry.file,
          });
        }
      });
    });

    return allFiles;
  }, [fileData]);

  // Clear all eighth form files
  const clearEighthFormFiles = useCallback(() => {
    // Clean up all preview URLs
    Object.values(fileData.eighthForm.files)
      .flat()
      .forEach((entry) => {
        if (entry.previewUrl) {
          URL.revokeObjectURL(entry.previewUrl);
        }
      });

    setFileData(initialFileData);
  }, [fileData]);

  // Reset all file data
  const resetFileData = useCallback(() => {
    // Clean up all preview URLs
    Object.values(fileData.eighthForm.files)
      .flat()
      .forEach((entry) => {
        if (entry.previewUrl) {
          URL.revokeObjectURL(entry.previewUrl);
        }
      });

    setFileData(initialFileData);

    // Also clear from localStorage
    try {
      localStorage.removeItem(FILE_DATA_STORAGE_KEY);
      localStorage.removeItem(FILE_DATA_TIMESTAMP_KEY);
    } catch (error) {
      console.error("Error removing file data from localStorage:", error);
    }
  }, [fileData]);

  // Get file data formatted for API submission
  const getFileDataForApi = useCallback((): FormData => {
    const formData = new FormData();
    const allFiles = getAllEighthFormFiles();

    allFiles.forEach(({ grade, semester, file }) => {
      // Create a descriptive field name for the API
      const fieldName = `grade_${grade}_semester_${(semester + 1).toString()}`;
      formData.append(fieldName, file);
    });

    return formData;
  }, [getAllEighthFormFiles]);

  // Get remaining time until expiration (in milliseconds)
  const getRemainingTime = useCallback((): number => {
    try {
      const timestamp = localStorage.getItem(FILE_DATA_TIMESTAMP_KEY);
      if (!timestamp) return 0;

      const savedTime = parseInt(timestamp);
      const currentTime = Date.now();
      const remainingTime =
        FILE_DATA_EXPIRATION_TIME - (currentTime - savedTime);

      return Math.max(0, remainingTime);
    } catch (error) {
      console.error("Error getting remaining time:", error);
      return 0;
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      fileData,
      updateEighthFormFile,
      getEighthFormFile,
      getEighthFormPreviewUrl,
      getAllEighthFormFiles,
      clearEighthFormFiles,
      resetFileData,
      getFileDataForApi,
      getRemainingTime,
    }),
    [
      fileData,
      updateEighthFormFile,
      getEighthFormFile,
      getEighthFormPreviewUrl,
      getAllEighthFormFiles,
      clearEighthFormFiles,
      resetFileData,
      getFileDataForApi,
      getRemainingTime,
    ],
  );

  return <FileDataContext value={contextValue}>{children}</FileDataContext>;
}

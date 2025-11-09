import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useFormData } from "../../contexts/FormData/useFormData";
import { useFileData } from "../../contexts/FileData/useFileData";
import { submitStudentProfile, isUserAuthenticated } from "./useCreateProfile";
import {
  uploadStudentFilesAuto,
  isUploadSuccessful,
  getUploadStatusMessage,
  type FileUploadResponse,
} from "./useFileUpload";
import { useOcrHandler } from "./useOcrHandler";
import { type NinthFormNavigationState } from "../../type/interface/navigationTypes";
import { hasUserId } from "../../type/interface/profileTypes";
import type { ErrorDetails } from "../../type/interface/error.details";
import APIError from "../../utils/apiError";
import { saveStudentId } from "../../utils/sessionManager"; // ✅ Import session manager

interface UseStudentProfileReturn {
  isSubmitting: boolean;
  error: string | null;
  handleSubmit: () => Promise<void>;
  clearError: () => void;
  uploadProgress: number;
}

export function useStudentProfile(): UseStudentProfileReturn {
  const navigate = useNavigate();
  const { getFormDataForApi } = useFormData();
  const { getAllEighthFormFiles, clearEighthFormFiles } = useFileData();
  const { processOcr, isOcrSuccessful } = useOcrHandler();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUploads = async (
    isAuthenticated: boolean,
  ): Promise<FileUploadResponse | null> => {
    const files = getAllEighthFormFiles();

    if (files.length === 0) {
      return null;
    }

    try {
      const filePayloads = files.map(({ grade, semester, file }) => ({
        grade,
        semester: semester + 1,
        file,
      }));

      const response = await uploadStudentFilesAuto(filePayloads);

      const statusMessage = getUploadStatusMessage(response, isAuthenticated);
      if (isUploadSuccessful(response)) {
        // console.log("File upload successful:", statusMessage);
      } else {
        console.warn(statusMessage);
      }

      return response;
    } catch (uploadError) {
      console.error("File upload error:", uploadError);
      return null;
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setError(null);
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formData = getFormDataForApi();
      const isAuthenticated = isUserAuthenticated();

      // Step 1: Submit student profile
      setUploadProgress(25);
      const response = await submitStudentProfile(formData);

      if (response.success ?? true) {
        setUploadProgress(50);

        const studentId = hasUserId(response);

        if (!studentId) {
          throw new Error("No student ID received from server");
        }

        // ✅ Use session manager to save studentId with proper tracking
        saveStudentId(studentId, !isAuthenticated);

        // Step 2: Upload files
        const fileUploadResponse = await handleFileUploads(isAuthenticated);
        setUploadProgress(65);

        // Step 3: Trigger OCR processing
        const ocrResponse = isUploadSuccessful(fileUploadResponse)
          ? await processOcr(isAuthenticated)
          : null;
        setUploadProgress(85);

        if (isUploadSuccessful(fileUploadResponse)) {
          clearEighthFormFiles();
        }

        setUploadProgress(100);

        const navigationState: NinthFormNavigationState = {
          submissionSuccess: true,
          responseData: response.data ?? response,
          wasAuthenticated: isAuthenticated,
          filesUploaded: isUploadSuccessful(fileUploadResponse),
          uploadedFilesCount: getAllEighthFormFiles().length,
          ocrProcessed: isOcrSuccessful(ocrResponse),
          ocrResults: ocrResponse?.data,
        };

        void navigate("/ninthForm", { state: navigationState });
      } else {
        setError(response.message ?? "Submission failed. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Error submitting form:", err);

      let message = "An unexpected error occurred. Please try again.";

      if (err instanceof APIError) {
        const errorData = err.data as ErrorDetails;

        if (errorData.validationErrors) {
          const validationErrors = errorData.validationErrors;

          const fieldErrors = Object.entries(validationErrors)
            .map(([field, errorMsg]) => {
              const formattedField = field
                .replace(/\./g, " → ")
                .replace(/(\d+)/g, "[$1]");
              return `${formattedField}: ${String(errorMsg)}`;
            })
            .join("\n");

          message = fieldErrors || errorData.message || err.message;
        } else if (errorData.message) {
          message = errorData.message;
        } else {
          message = err.message;
        }
      } else if (axios.isAxiosError(err)) {
        const apiError = err as AxiosError<ErrorDetails>;

        if (apiError.response?.data.validationErrors) {
          const validationErrors = apiError.response.data.validationErrors;

          const fieldErrors = Object.entries(validationErrors)
            .map(([field, errorMsg]) => {
              const formattedField = field
                .replace(/\./g, " → ")
                .replace(/(\d+)/g, "[$1]");
              return `${formattedField}: ${String(errorMsg)}`;
            })
            .join("\n");

          message =
            fieldErrors || apiError.response.data.message || apiError.message;
        } else if (apiError.response?.data.message) {
          message = apiError.response.data.message;
        } else if (apiError.message) {
          message = apiError.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    isSubmitting,
    error,
    handleSubmit,
    clearError,
    uploadProgress,
  };
}

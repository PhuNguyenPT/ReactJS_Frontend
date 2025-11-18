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
import { saveStudentId } from "../../utils/sessionManager";

interface RetryProgress {
  attempt: number;
  maxAttempts: number;
}

interface UseStudentProfileReturn {
  isSubmitting: boolean;
  error: string | null;
  handleSubmit: () => Promise<void>;
  clearError: () => void;
  uploadProgress: number;
  processingStatus: string | null;
  retryProgress: RetryProgress;
}

export function useStudentProfile(): UseStudentProfileReturn {
  const navigate = useNavigate();
  const { getFormDataForApi } = useFormData();
  const { getAllEighthFormFiles, clearEighthFormFiles } = useFileData();
  const { processOcr, isOcrSuccessful } = useOcrHandler();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [retryProgress, setRetryProgress] = useState<RetryProgress>({
    attempt: 0,
    maxAttempts: 3,
  });

  const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleFileUploads = async (
    isAuthenticated: boolean,
  ): Promise<FileUploadResponse | null> => {
    const files = getAllEighthFormFiles();

    if (files.length === 0) {
      return null;
    }

    try {
      setProcessingStatus("Uploading files...");
      const filePayloads = files.map(({ grade, semester, file }) => ({
        grade,
        semester: semester + 1,
        file,
      }));

      const response = await uploadStudentFilesAuto(filePayloads);

      const statusMessage = getUploadStatusMessage(response, isAuthenticated);
      if (isUploadSuccessful(response)) {
        setProcessingStatus("Files uploaded successfully");
      } else {
        console.warn(statusMessage);
      }

      return response;
    } catch (uploadError) {
      console.error("File upload error:", uploadError);
      return null;
    }
  };

  const submitWithRetry = async (
    formData: ReturnType<typeof getFormDataForApi>,
    maxAttempts = 3,
  ): Promise<Awaited<ReturnType<typeof submitStudentProfile>>> => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        setRetryProgress({ attempt, maxAttempts });
        setProcessingStatus(
          attempt === 1
            ? "Submitting student profile..."
            : `Retrying submission (${String(attempt)}/${String(maxAttempts)})...`,
        );

        const response = await submitStudentProfile(formData);

        // Reset retry progress on success
        setRetryProgress({ attempt: 0, maxAttempts });
        return response;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));

        if (attempt < maxAttempts) {
          const delayTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          setProcessingStatus(
            `Retrying in ${String(delayTime / 1000)} seconds...`,
          );
          await delay(delayTime);
        }
      }
    }

    throw lastError ?? new Error("Submission failed after all retries");
  };

  const handleSubmit = async (): Promise<void> => {
    setError(null);
    setIsSubmitting(true);
    setUploadProgress(0);
    setProcessingStatus("Preparing submission...");
    setRetryProgress({ attempt: 0, maxAttempts: 3 });

    try {
      const formData = getFormDataForApi();
      const isAuthenticated = isUserAuthenticated();

      // Step 1: Submit student profile with retry logic
      setUploadProgress(10);
      const response = await submitWithRetry(formData, 3);

      if (response.success ?? true) {
        setUploadProgress(50);
        setProcessingStatus("Profile submitted successfully");

        const studentId = hasUserId(response);

        if (!studentId) {
          throw new Error("No student ID received from server");
        }

        // Save studentId with proper tracking
        saveStudentId(studentId, !isAuthenticated);

        // Step 2: Upload files
        setUploadProgress(55);
        const fileUploadResponse = await handleFileUploads(isAuthenticated);
        setUploadProgress(70);

        // Step 3: Trigger OCR processing
        if (isUploadSuccessful(fileUploadResponse)) {
          setProcessingStatus("Processing OCR...");
        }

        const ocrResponse = isUploadSuccessful(fileUploadResponse)
          ? await processOcr(isAuthenticated)
          : null;
        setUploadProgress(90);

        if (isUploadSuccessful(fileUploadResponse)) {
          clearEighthFormFiles();
          setProcessingStatus("Cleaning up...");
        }

        setUploadProgress(100);
        setProcessingStatus("Submission complete!");

        const navigationState: NinthFormNavigationState = {
          submissionSuccess: true,
          responseData: response.data ?? response,
          wasAuthenticated: isAuthenticated,
          filesUploaded: isUploadSuccessful(fileUploadResponse),
          uploadedFilesCount: getAllEighthFormFiles().length,
          ocrProcessed: isOcrSuccessful(ocrResponse),
          ocrResults: ocrResponse?.data,
        };

        // Small delay to show completion message
        await delay(500);

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
      setProcessingStatus(null);
      setRetryProgress({ attempt: 0, maxAttempts: 3 });
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
    processingStatus,
    retryProgress,
  };
}

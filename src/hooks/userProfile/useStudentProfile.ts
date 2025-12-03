import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { useNinthForm } from "../../contexts/ScoreBoardData/useScoreBoardContext";
import { type NinthFormNavigationState } from "../../type/interface/navigationTypes";
import { hasUserId } from "../../type/interface/profileTypes";
import type { ErrorDetails } from "../../type/interface/error.details";
import type { OcrResponse } from "../../type/interface/ocrTypes";
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
  const { t } = useTranslation();
  const { getFormDataForApi } = useFormData();
  const { getAllEighthFormFiles, clearEighthFormFiles } = useFileData();
  const { processOcr, isOcrSuccessful } = useOcrHandler();
  const { clearAllData } = useNinthForm();

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
      setProcessingStatus(t("studentProfile.status.uploadingFiles"));

      const filePayloads = files.map(({ grade, semester, file }) => ({
        grade,
        semester: semester + 1,
        file,
      }));
      const response = await uploadStudentFilesAuto(filePayloads);

      const statusMessage = getUploadStatusMessage(response, isAuthenticated);

      if (isUploadSuccessful(response)) {
        setProcessingStatus(t("studentProfile.status.filesUploaded"));
      } else {
        console.warn("[useStudentProfile] File upload issues:", statusMessage);
      }

      return response;
    } catch (uploadError) {
      console.error("[useStudentProfile] File upload error:", uploadError);
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
            ? t("studentProfile.status.submittingProfile")
            : t("studentProfile.status.retryingSubmission", {
                attempt: String(attempt),
                maxAttempts: String(maxAttempts),
              }),
        );
        const response = await submitStudentProfile(formData);

        setRetryProgress({ attempt: 0, maxAttempts });
        return response;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < maxAttempts) {
          const delayTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          setProcessingStatus(
            t("studentProfile.status.retryingIn", {
              seconds: String(delayTime / 1000),
            }),
          );
          await delay(delayTime);
        }
      }
    }

    throw lastError ?? new Error(t("studentProfile.errors.submissionFailed"));
  };

  const handleSubmit = async (): Promise<void> => {
    setError(null);
    setIsSubmitting(true);
    setUploadProgress(0);
    setProcessingStatus(t("studentProfile.status.preparing"));
    setRetryProgress({ attempt: 0, maxAttempts: 3 });

    try {
      const formData = getFormDataForApi();
      const isAuthenticated = isUserAuthenticated();

      // Clear ninth form data BEFORE starting submission
      clearAllData();

      // Step 1: Submit student profile with retry logic
      setUploadProgress(10);
      const response = await submitWithRetry(formData, 3);

      if (response.success ?? true) {
        setUploadProgress(50);
        setProcessingStatus(t("studentProfile.status.profileSubmitted"));

        const studentId = hasUserId(response);

        if (!studentId) {
          throw new Error(t("studentProfile.errors.noStudentId"));
        }

        saveStudentId(studentId, !isAuthenticated);

        // Step 2: Upload files (if any)
        setUploadProgress(55);
        const fileUploadResponse = await handleFileUploads(isAuthenticated);
        setUploadProgress(70);

        // Step 3: Trigger OCR processing (only if files were uploaded)
        let ocrResponse: OcrResponse | null = null;

        if (isUploadSuccessful(fileUploadResponse)) {
          setProcessingStatus(t("studentProfile.status.processingOcr"));

          try {
            // ✅ FIXED: Proper null handling instead of type assertion
            ocrResponse = await processOcr(isAuthenticated);

            if (ocrResponse) {
              console.log(
                "[useStudentProfile] OCR processing completed:",
                ocrResponse,
              );
            } else {
              console.warn("[useStudentProfile] OCR processing returned null");
            }
          } catch (ocrError) {
            console.error(
              "[useStudentProfile] OCR processing failed:",
              ocrError,
            );
            ocrResponse = null;
          }

          setUploadProgress(90);
        } else {
          setUploadProgress(90);
        }

        // Step 4: Cleanup
        if (isUploadSuccessful(fileUploadResponse)) {
          clearEighthFormFiles();
          setProcessingStatus(t("studentProfile.status.cleaningUp"));
        }

        setUploadProgress(100);
        setProcessingStatus(t("studentProfile.status.complete"));

        // Prepare navigation state
        const navigationState: NinthFormNavigationState = {
          submissionSuccess: true,
          responseData: response.data ?? response,
          wasAuthenticated: isAuthenticated,
          filesUploaded: isUploadSuccessful(fileUploadResponse),
          uploadedFilesCount: getAllEighthFormFiles().length,
          ocrProcessed: isOcrSuccessful(ocrResponse),
          ocrResults: ocrResponse?.data,
        };

        await delay(500);

        void navigate("/ninthForm", { state: navigationState });
      } else {
        setError(
          response.message ?? t("studentProfile.errors.submissionGeneric"),
        );
      }
    } catch (err: unknown) {
      console.error("[useStudentProfile] Error submitting form:", err);

      let message = t("studentProfile.errors.unexpectedError");

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

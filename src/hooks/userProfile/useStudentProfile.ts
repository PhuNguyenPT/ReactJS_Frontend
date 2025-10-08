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
import APIError from "../../utils/apiError"; //

interface UseStudentProfileReturn {
  isSubmitting: boolean;
  error: string | null;
  handleSubmit: () => Promise<void>;
  clearError: () => void;
  uploadProgress: number;
}

/**
 * Custom hook for handling student profile submission
 * Manages submission state, error handling, and navigation
 */
export function useStudentProfile(): UseStudentProfileReturn {
  const navigate = useNavigate();
  const { getFormDataForApi } = useFormData();
  const { getAllEighthFormFiles, clearEighthFormFiles } = useFileData();
  const { processOcr, isOcrSuccessful } = useOcrHandler();

  // State for API call handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Handle file uploads for the student profile
   * Now uses automatic studentId from localStorage
   */
  const handleFileUploads = async (
    isAuthenticated: boolean,
  ): Promise<FileUploadResponse | null> => {
    const files = getAllEighthFormFiles();

    if (files.length === 0) {
      console.log("No files to upload");
      return null;
    }

    console.log(
      `Uploading ${String(files.length)} files for ${
        isAuthenticated ? "authenticated" : "guest"
      } student (using localStorage studentId)`,
    );

    try {
      // Prepare and upload files (studentId automatically retrieved from localStorage)
      const filePayloads = files.map(({ grade, semester, file }) => ({
        grade,
        semester: semester + 1, // Convert 0-indexed to 1-indexed
        file,
      }));

      const response = await uploadStudentFilesAuto(filePayloads);

      // Log the status
      const statusMessage = getUploadStatusMessage(response, isAuthenticated);
      if (isUploadSuccessful(response)) {
        console.log(statusMessage);
      } else {
        console.warn(statusMessage);
      }

      return response;
    } catch (uploadError) {
      console.error("File upload error:", uploadError);
      // Don't fail the entire process if file upload fails
      // Files are supplementary to the main profile
      return null;
    }
  };

  /**
   * Handle form submission
   * Submits data to API and navigates to next page on success
   */
  const handleSubmit = async (): Promise<void> => {
    setError(null);
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Get the form data already converted to Vietnamese values
      const formData = getFormDataForApi();

      // Log authentication status for debugging
      const isAuthenticated = isUserAuthenticated();
      console.log(
        `Submitting as ${isAuthenticated ? "authenticated" : "guest"} user`,
      );

      // Step 1: Submit student profile (25% progress)
      setUploadProgress(25);
      const response = await submitStudentProfile(formData);

      // Check for success - handle both explicit success field and 201 status
      if (response.success ?? true) {
        // Default to true if success field doesn't exist
        setUploadProgress(50);

        // Extract student ID from response using type-safe helper
        const studentId = hasUserId(response);

        if (!studentId) {
          throw new Error("No student ID received from server");
        }

        // Store studentId in localStorage for future API calls
        localStorage.setItem("studentId", studentId);
        console.log("[Profile] Stored studentId in localStorage:", studentId);

        // Step 2: Upload files if files exist (50% -> 65% progress)
        // Now automatically uses studentId from localStorage
        const fileUploadResponse = await handleFileUploads(isAuthenticated);
        setUploadProgress(65);

        // Step 3: Trigger OCR processing if files were uploaded successfully (65% -> 85% progress)
        // Now automatically uses studentId from localStorage
        const ocrResponse = isUploadSuccessful(fileUploadResponse)
          ? await processOcr(isAuthenticated)
          : null;
        setUploadProgress(85);

        // Clear files from context after successful upload
        if (isUploadSuccessful(fileUploadResponse)) {
          clearEighthFormFiles();
        }

        setUploadProgress(100);

        // Navigate to the next page with submission data
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
        // Handle API error response
        setError(response.message ?? "Submission failed. Please try again.");
      }
    } catch (err: unknown) {
      // Handle network or other errors with proper error extraction
      console.error("Error submitting form:", err);

      let message = "An unexpected error occurred. Please try again.";

      // ✅ Handle APIError first (thrown by apiFetch)
      if (err instanceof APIError) {
        const errorData = err.data as ErrorDetails;

        // Check if there are validation errors in the data
        if (errorData.validationErrors) {
          const validationErrors = errorData.validationErrors;

          // Extract all validation error messages with field names
          const fieldErrors = Object.entries(validationErrors)
            .map(([field, errorMsg]) => {
              // Format field name to be more readable
              const formattedField = field
                .replace(/\./g, " → ") // Replace dots with arrows
                .replace(/(\d+)/g, "[$1]"); // Wrap numbers in brackets
              return `${formattedField}: ${String(errorMsg)}`;
            })
            .join("\n");

          message = fieldErrors || errorData.message || err.message;
        } else if (errorData.message) {
          message = errorData.message;
        } else {
          message = err.message;
        }
      }
      // ✅ Fallback: Handle raw Axios errors (if apiFetch is bypassed)
      else if (axios.isAxiosError(err)) {
        const apiError = err as AxiosError<ErrorDetails>;

        if (apiError.response?.data.validationErrors) {
          const validationErrors = apiError.response.data.validationErrors;

          // Extract all validation error messages with field names
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

  /**
   * Clear the current error message
   */
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

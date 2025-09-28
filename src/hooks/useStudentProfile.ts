import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormData } from "../contexts/FormData/useFormData";
import { useFileData } from "../contexts/FileData/useFileData";
import { submitStudentProfile, isUserAuthenticated } from "./useCreateProfile";
import { uploadStudentFiles } from "../services/fileUpload/fileUploadService";
import {
  hasUserId,
  type NinthFormNavigationState,
} from "../type/interface/profileTypes";

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

  // State for API call handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

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

      // Step 1: Submit student profile
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

        // Step 2: Upload files if authenticated and files exist
        const files = getAllEighthFormFiles();
        let fileUploadResponse = null;

        if (isAuthenticated && files.length > 0) {
          console.log(
            `Uploading ${files.length.toString()} files for student ${studentId}`,
          );
          setUploadProgress(75);

          try {
            // Prepare files for upload
            const filePayloads = files.map(({ grade, semester, file }) => ({
              grade,
              semester: semester + 1, // Convert 0-indexed to 1-indexed
              file,
            }));

            // Upload files
            fileUploadResponse = await uploadStudentFiles(
              studentId,
              filePayloads,
            );

            if (!fileUploadResponse.success) {
              console.warn("File upload failed:", fileUploadResponse.message);
              // Don't throw error - files are optional
              // But log the warning for debugging
            } else {
              console.log("Files uploaded successfully");
            }
          } catch (uploadError) {
            console.error("File upload error:", uploadError);
            // Don't fail the entire process if file upload fails
            // Files are supplementary to the main profile
          }
        }

        setUploadProgress(100);

        // Clear files from context after successful submission
        if (fileUploadResponse?.success) {
          clearEighthFormFiles();
        }

        // Navigate to the next page with submission data
        const navigationState: NinthFormNavigationState = {
          submissionSuccess: true,
          responseData: response.data ?? response,
          wasAuthenticated: isAuthenticated,
          filesUploaded: fileUploadResponse?.success ?? false,
          uploadedFilesCount: files.length,
        };

        void navigate("/ninthForm", { state: navigationState });
      } else {
        // Handle API error response
        setError(response.message ?? "Submission failed. Please try again.");
      }
    } catch (err) {
      // Handle network or other errors
      console.error("Error submitting form:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.",
      );
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

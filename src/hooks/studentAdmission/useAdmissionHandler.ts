import {
  getAdmissionForStudent,
  type AdmissionResponse,
} from "../../services/studentAdmission/studentAdmissionService";
import { useRetryHandler, type RetryOptions } from "../common/useRetryHandler";

/**
 * Check if admission response has valid data
 * @param response - The admission response to check
 * @returns boolean indicating if the response contains valid admission data
 */
const isAdmissionSuccessful = (response: AdmissionResponse | null): boolean => {
  if (!response?.success) {
    return false;
  }

  // Check if we have any meaningful data
  const { data } = response;
  if (!data) {
    return false;
  }

  // Check if data is an array (AdmissionProgram[])
  if (Array.isArray(data)) {
    return data.length > 0;
  }

  // Check if data has content property (AdmissionApiResponse)
  if (
    typeof data === "object" &&
    "content" in data &&
    Array.isArray(data.content)
  ) {
    return data.content.length > 0;
  }

  return false;
};

/**
 * Get a status message based on the admission response
 * @param response - The admission response
 * @param isAuthenticated - Whether the user is authenticated
 * @returns Status message string
 */
const getAdmissionStatusMessage = (
  response: AdmissionResponse | null,
  isAuthenticated: boolean,
): string => {
  if (!response) {
    return "No admission response received";
  }

  if (isAdmissionSuccessful(response)) {
    return `Successfully retrieved admission data for ${isAuthenticated ? "authenticated" : "guest"} user`;
  }

  if (response.data) {
    return "Admission processing is still in progress. Please try again in a moment.";
  }

  return "Unable to retrieve admission data at this time";
};

/**
 * Extract progress information from admission response
 * Note: Admission doesn't have granular progress, so we estimate based on data presence
 */
const getAdmissionProgress = (
  response: AdmissionResponse,
): { processed: number; total: number; statusMessage?: string } => {
  // Admission is binary: either we have results or we don't
  // We use a simple 0/1 or 1/1 approach for progress tracking

  if (isAdmissionSuccessful(response)) {
    // Count number of programs for more detailed feedback
    let programCount = 0;
    if (Array.isArray(response.data)) {
      programCount = response.data.length;
    } else if (
      response.data &&
      typeof response.data === "object" &&
      "content" in response.data &&
      Array.isArray(response.data.content)
    ) {
      programCount = response.data.content.length;
    }

    return {
      processed: 1,
      total: 1,
      statusMessage: `Successfully retrieved ${String(programCount)} admission programs`,
    };
  }

  // Check if we have partial data (response exists but not successful yet)
  if (response.data) {
    return {
      processed: 0,
      total: 1,
      statusMessage: "ML processing in progress...",
    };
  }

  return {
    processed: 0,
    total: 1,
    statusMessage: "Waiting for ML to start processing...",
  };
};

/**
 * Custom hook for handling admission processing with advanced retry logic
 */
export function useAdmissionHandler() {
  const { processWithRetry } = useRetryHandler();

  /**
   * Handle admission processing with exponential backoff retry logic
   * @param studentId - The student ID
   * @param isAuthenticated - Whether the user is authenticated
   * @param options - Configuration options for retry behavior
   * @returns Promise with admission response or null if max attempts reached
   */
  const processAdmission = async (
    studentId: string,
    isAuthenticated: boolean,
    options?: Partial<RetryOptions>,
  ): Promise<AdmissionResponse | null> => {
    return processWithRetry<AdmissionResponse>(
      // Fetch function
      () => getAdmissionForStudent(studentId, isAuthenticated),
      // Validate function
      isAdmissionSuccessful,
      // Progress function
      getAdmissionProgress,
      {
        logPrefix: "[Admission Handler]",
        ...options,
      },
    );
  };

  return {
    processAdmission,
    isAdmissionSuccessful,
    getAdmissionStatusMessage,
  };
}

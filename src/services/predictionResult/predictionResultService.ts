import apiFetch from "../../utils/apiFetch";

export interface PredictionResultResponse {
  success: boolean;
  status?: "completed" | "processing" | "failed";
  message?: string;
  data?: unknown;
}

/**
 * Check prediction result status for authenticated user
 * GET /predict/result/{studentId}
 */
export async function checkPredictionResultForAuthenticatedUser(
  studentId: string,
): Promise<PredictionResultResponse> {
  try {
    const response = await apiFetch<{ status: string }>(
      `/predict/result/${studentId}`,
      {
        method: "GET",
        requiresAuth: true,
      },
    );

    return {
      success: true,
      status: response.status as "completed" | "processing" | "failed",
      data: response,
    };
  } catch (error) {
    console.error(
      "[PredictionResultService] Error checking prediction result for authenticated user:",
      error,
    );

    return {
      success: false,
      status: "failed",
      message:
        error instanceof Error
          ? error.message
          : "Failed to check prediction result",
    };
  }
}

/**
 * Check prediction result status for guest user
 * GET /predict/result/guest/{studentId}
 */
export async function checkPredictionResultForGuestUser(
  studentId: string,
): Promise<PredictionResultResponse> {
  try {
    const response = await apiFetch<{ status: string }>(
      `/predict/result/guest/${studentId}`,
      {
        method: "GET",
        requiresAuth: false,
      },
    );

    return {
      success: true,
      status: response.status as "completed" | "processing" | "failed",
      data: response,
    };
  } catch (error) {
    console.error(
      "[PredictionResultService] Error checking prediction result for guest user:",
      error,
    );

    return {
      success: false,
      status: "failed",
      message:
        error instanceof Error
          ? error.message
          : "Failed to check prediction result",
    };
  }
}

/**
 * Check prediction result status based on authentication status
 */
export async function checkPredictionResult(
  studentId: string,
  isAuthenticated: boolean,
): Promise<PredictionResultResponse> {
  if (isAuthenticated) {
    return checkPredictionResultForAuthenticatedUser(studentId);
  } else {
    return checkPredictionResultForGuestUser(studentId);
  }
}

/**
 * Poll prediction result until status is "completed" or max attempts reached
 */
export async function pollPredictionResult(
  studentId: string,
  isAuthenticated: boolean,
  options: {
    maxAttempts?: number;
    intervalMs?: number;
    onProgress?: (attempt: number, maxAttempts: number) => void;
  } = {},
): Promise<PredictionResultResponse> {
  const maxAttempts = options.maxAttempts ?? 10;
  const intervalMs = options.intervalMs ?? 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (options.onProgress) {
      options.onProgress(attempt, maxAttempts);
    }

    const result = await checkPredictionResult(studentId, isAuthenticated);

    if (result.success && result.status === "completed") {
      return result;
    }

    if (!result.success || result.status === "failed") {
      return result;
    }

    // If not completed and not the last attempt, wait before next poll
    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  return {
    success: false,
    status: "processing",
    message: "Prediction result check timed out",
  };
}

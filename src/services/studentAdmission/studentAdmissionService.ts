import apiFetch from "../../utils/apiFetch";
import type { StudentResponse } from "../../type/interface/profileTypes";
import { hasUserId } from "../../type/interface/profileTypes";
import type {
  AdmissionApiResponse,
  AdmissionProgram,
} from "../../type/interface/admissionTypes";

// Response types for admission API
export interface AdmissionResponse {
  success: boolean;
  message?: string;
  data?: AdmissionApiResponse | AdmissionProgram[];
}

/**
 * Extract student ID from various possible sources
 * @param user - User object from auth context
 * @returns Student ID or null if not found
 */
function extractStudentId(user: unknown): string | null {
  // If user is a StudentResponse, use the helper function
  if (user && typeof user === "object") {
    const studentId = hasUserId(user as StudentResponse);
    if (studentId) {
      return studentId;
    }
  }

  // Check sessionStorage first (matches what NinthFormPage uses)
  const sessionStorageId = sessionStorage.getItem("studentId");
  if (sessionStorageId) {
    console.log(
      "[AdmissionService] Found student ID in sessionStorage:",
      sessionStorageId,
    );
    return sessionStorageId;
  }

  // Fallback: check localStorage
  const localStorageId = localStorage.getItem("studentId");
  if (localStorageId) {
    console.log(
      "[AdmissionService] Found student ID in localStorage:",
      localStorageId,
    );
    return localStorageId;
  }

  console.warn("[AdmissionService] No student ID found");
  return null;
}

/**
 * Get admission prediction for guest users (no authentication required)
 * @param studentId - The student ID from profile
 * @returns Promise with admission data
 */
export async function getGuestAdmission(
  studentId: string,
): Promise<AdmissionResponse> {
  try {
    console.log("[AdmissionService] Fetching guest admission for:", studentId);

    const response = await apiFetch<AdmissionApiResponse>(
      `/admission/guest/${studentId}`,
      {
        method: "GET",
        requiresAuth: false,
      },
    );

    console.log("[AdmissionService] Guest admission response:", response);

    return {
      success: true,
      message: "Admission data retrieved successfully",
      data: response,
    };
  } catch (error) {
    console.error("[AdmissionService] Error fetching guest admission:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch admission data",
      data: undefined,
    };
  }
}

/**
 * Get admission prediction for authenticated users (requires bearer token)
 * @param studentId - The student ID from profile
 * @returns Promise with admission data
 */
export async function getAuthenticatedAdmission(
  studentId: string,
): Promise<AdmissionResponse> {
  try {
    console.log(
      "[AdmissionService] Fetching authenticated admission for:",
      studentId,
    );

    const response = await apiFetch<AdmissionApiResponse>(
      `/admission/${studentId}`,
      {
        method: "GET",
        requiresAuth: true,
      },
    );

    console.log(
      "[AdmissionService] Authenticated admission response:",
      response,
    );

    return {
      success: true,
      message: "Admission data retrieved successfully",
      data: response,
    };
  } catch (error) {
    console.error(
      "[AdmissionService] Error fetching authenticated admission:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch admission data",
      data: undefined,
    };
  }
}

/**
 * Smart admission function that chooses the right endpoint based on authentication
 * @param studentId - The student ID from profile
 * @param isAuthenticated - Whether the user is authenticated
 * @returns Promise with admission data
 */
export async function getAdmissionForStudent(
  studentId: string,
  isAuthenticated: boolean,
): Promise<AdmissionResponse> {
  if (isAuthenticated) {
    return getAuthenticatedAdmission(studentId);
  } else {
    return getGuestAdmission(studentId);
  }
}

/**
 * Helper function to get student ID from user object or storage
 * This is a convenience wrapper around extractStudentId
 * @param user - User object from auth context
 * @returns Student ID or throws error if not found
 */
export function getStudentIdOrThrow(user: unknown): string {
  const studentId = extractStudentId(user);

  if (!studentId) {
    throw new Error("Student ID not found. Please complete previous steps.");
  }

  return studentId;
}

// Export the helper for use in components
export { extractStudentId };

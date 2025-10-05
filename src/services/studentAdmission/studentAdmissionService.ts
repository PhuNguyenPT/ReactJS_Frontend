import apiFetch from "../../utils/apiFetch";
import type { StudentResponse } from "../../type/interface/profileTypes";
import { hasUserId } from "../../type/interface/profileTypes";

// Response types for admission API
export interface AdmissionResponse {
  success: boolean;
  message?: string;
  data?: {
    studentId?: string;
    predictions?: unknown;
    majorRecommendations?: unknown;
    admissionChances?: unknown;
    // Add other fields based on your API response
    [key: string]: unknown;
  };
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

  // Fallback: check sessionStorage
  const storedStudentId = sessionStorage.getItem("studentId");
  if (storedStudentId) {
    console.log(
      "[AdmissionService] Found student ID in sessionStorage:",
      storedStudentId,
    );
    return storedStudentId;
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

    const response = await apiFetch<AdmissionResponse>(
      `/admission/guest/${studentId}`,
      {
        method: "GET",
        requiresAuth: false, // No auth required for guest
      },
    );

    console.log("[AdmissionService] Guest admission response:", response);

    // Ensure we return a consistent structure
    return {
      success: true,
      message: response.message ?? "Admission data retrieved successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("[AdmissionService] Error fetching guest admission:", error);
    throw error;
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

    const response = await apiFetch<AdmissionResponse>(
      `/admission/${studentId}`,
      {
        method: "GET",
        requiresAuth: true, // This will add Bearer token from localStorage
      },
    );

    console.log(
      "[AdmissionService] Authenticated admission response:",
      response,
    );

    // Ensure we return a consistent structure
    return {
      success: true,
      message: response.message ?? "Admission data retrieved successfully",
      data: response.data,
    };
  } catch (error) {
    console.error(
      "[AdmissionService] Error fetching authenticated admission:",
      error,
    );
    throw error;
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

import apiFetch from "../../utils/apiFetch";

// Response type for filter API
export interface FilterFieldsResponse {
  fields: {
    admissionCode: string[];
    admissionType: string[];
    admissionTypeName: string[];
    majorName: string[];
    province: string[];
    studyProgram: string[];
    subjectCombination: string[];
    uniCode: string[];
    uniName: string[];
    uniType: string[];
    uniWebLink: string[];
    majorCode: number[];
    tuitionFee: string[];
  };
}

export interface FilterResponse {
  success: boolean;
  message?: string;
  data?: FilterFieldsResponse;
}

/**
 * Get filter fields for authenticated users
 * @param studentId - The student ID
 * @returns Promise with filter fields data
 */
export async function getAuthenticatedFilterFields(
  studentId: string,
): Promise<FilterResponse> {
  try {
    console.log(
      "[FilterService] Fetching authenticated filter fields for:",
      studentId,
    );

    const response = await apiFetch<FilterFieldsResponse>(
      `/admission/filter/${studentId}`,
      {
        method: "GET",
        requiresAuth: true,
      },
    );

    console.log("[FilterService] Authenticated filter response:", response);

    return {
      success: true,
      message: "Filter fields retrieved successfully",
      data: response,
    };
  } catch (error) {
    console.error(
      "[FilterService] Error fetching authenticated filter fields:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch filter fields",
      data: undefined,
    };
  }
}

/**
 * Get filter fields for guest users
 * @param studentId - The student ID
 * @returns Promise with filter fields data
 */
export async function getGuestFilterFields(
  studentId: string,
): Promise<FilterResponse> {
  try {
    console.log("[FilterService] Fetching guest filter fields for:", studentId);

    const response = await apiFetch<FilterFieldsResponse>(
      `/admission/filter/guest/${studentId}`,
      {
        method: "GET",
        requiresAuth: false,
      },
    );

    console.log("[FilterService] Guest filter response:", response);

    return {
      success: true,
      message: "Filter fields retrieved successfully",
      data: response,
    };
  } catch (error) {
    console.error("[FilterService] Error fetching guest filter fields:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch filter fields",
      data: undefined,
    };
  }
}

/**
 * Smart filter function that chooses the right endpoint based on authentication
 * @param studentId - The student ID
 * @param isAuthenticated - Whether the user is authenticated
 * @returns Promise with filter fields data
 */
export async function getFilterFieldsForStudent(
  studentId: string,
  isAuthenticated: boolean,
): Promise<FilterResponse> {
  if (isAuthenticated) {
    return getAuthenticatedFilterFields(studentId);
  } else {
    return getGuestFilterFields(studentId);
  }
}

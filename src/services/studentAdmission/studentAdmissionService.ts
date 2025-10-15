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

// Parameters for admission API
export interface AdmissionParams {
  page?: number;
  size?: number;
  sort?: string;
  admissionCode?: string[];
  admissionType?: string[];
  admissionTypeName?: string[];
  id?: string[];
  majorCode?: number[];
  majorName?: string[];
  province?: string[];
  studyProgram?: string[];
  subjectCombination?: string[];
  tuitionFee?: number[];
  uniCode?: string[];
  uniName?: string[];
  uniType?: string[];
  uniWebLink?: string[];
}

// Paginated response structure
export interface PaginatedAdmissionResponse {
  content: AdmissionProgram[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      ascending: boolean;
      descending: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
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
 * Build query string from parameters
 * @param params - Parameters object
 * @returns Query string
 */
function buildQueryString(params: AdmissionParams): string {
  const queryParams = new URLSearchParams();

  // Add pagination parameters
  if (params.page !== undefined) {
    queryParams.append("page", params.page.toString());
  }
  if (params.size !== undefined) {
    queryParams.append("size", params.size.toString());
  }
  if (params.sort) {
    queryParams.append("sort", params.sort);
  }

  // Add filter parameters (handle arrays)
  const arrayParams = [
    "admissionCode",
    "admissionType",
    "admissionTypeName",
    "id",
    "majorName",
    "province",
    "studyProgram",
    "subjectCombination",
    "uniCode",
    "uniName",
    "uniType",
    "uniWebLink",
  ] as const;

  arrayParams.forEach((param) => {
    const value = params[param];
    if (value && Array.isArray(value) && value.length > 0) {
      value.forEach((v) => {
        queryParams.append(param, v);
      });
    }
  });

  // Handle numeric arrays
  if (params.majorCode && params.majorCode.length > 0) {
    params.majorCode.forEach((code) => {
      queryParams.append("majorCode", code.toString());
    });
  }

  if (params.tuitionFee && params.tuitionFee.length > 0) {
    params.tuitionFee.forEach((fee) => {
      queryParams.append("tuitionFee", fee.toString());
    });
  }

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Get initial admission data (fetch all results)
 * @param studentId - The student ID
 * @param isAuthenticated - Whether the user is authenticated
 * @returns Promise with all admission data
 */
export async function getInitialAdmissionData(
  studentId: string,
  isAuthenticated: boolean,
): Promise<AdmissionResponse> {
  try {
    console.log("[AdmissionService] Fetching initial data to get total count");

    // First call to get total elements
    const endpoint = isAuthenticated
      ? `/admission/${studentId}`
      : `/admission/guest/${studentId}`;

    const initialParams: AdmissionParams = {
      page: 1,
      size: 10,
      sort: "createdAt,DESC",
    };

    const queryString = buildQueryString(initialParams);

    const initialResponse = await apiFetch<PaginatedAdmissionResponse>(
      `${endpoint}${queryString}`,
      {
        method: "GET",
        requiresAuth: isAuthenticated,
      },
    );

    console.log(
      "[AdmissionService] Initial response - Total elements:",
      initialResponse.totalElements,
    );

    // If total elements is less than or equal to initial size, return as is
    if (initialResponse.totalElements <= 10) {
      return {
        success: true,
        message: "Admission data retrieved successfully",
        data: initialResponse.content,
      };
    }

    // Fetch all data using totalElements as size
    const allDataParams: AdmissionParams = {
      page: 1,
      size: initialResponse.totalElements,
      sort: "createdAt,DESC",
    };

    const allDataQueryString = buildQueryString(allDataParams);

    const allDataResponse = await apiFetch<PaginatedAdmissionResponse>(
      `${endpoint}${allDataQueryString}`,
      {
        method: "GET",
        requiresAuth: isAuthenticated,
      },
    );

    console.log(
      "[AdmissionService] Retrieved all data - Count:",
      allDataResponse.content.length,
    );

    return {
      success: true,
      message: "All admission data retrieved successfully",
      data: allDataResponse.content,
    };
  } catch (error) {
    console.error(
      "[AdmissionService] Error fetching initial admission data:",
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
 * Get filtered admission data
 * @param studentId - The student ID
 * @param isAuthenticated - Whether the user is authenticated
 * @param filterParams - Filter parameters from the filter form
 * @returns Promise with filtered admission data
 */
export async function getFilteredAdmissionData(
  studentId: string,
  isAuthenticated: boolean,
  filterParams: Partial<AdmissionParams>,
): Promise<AdmissionResponse> {
  try {
    console.log(
      "[AdmissionService] Fetching filtered data with params:",
      filterParams,
    );

    const endpoint = isAuthenticated
      ? `/admission/${studentId}`
      : `/admission/guest/${studentId}`;

    // First get total count with filters
    const initialParams: AdmissionParams = {
      ...filterParams,
      page: 1,
      size: 10,
      sort: filterParams.sort ?? "createdAt,DESC",
    };

    const initialQueryString = buildQueryString(initialParams);

    const initialResponse = await apiFetch<PaginatedAdmissionResponse>(
      `${endpoint}${initialQueryString}`,
      {
        method: "GET",
        requiresAuth: isAuthenticated,
      },
    );

    console.log(
      "[AdmissionService] Filtered response - Total elements:",
      initialResponse.totalElements,
    );

    // If total elements is less than or equal to initial size, return as is
    if (initialResponse.totalElements <= 10) {
      return {
        success: true,
        message: "Filtered data retrieved successfully",
        data: initialResponse.content,
      };
    }

    // Fetch all filtered data
    const allFilteredParams: AdmissionParams = {
      ...filterParams,
      page: 1,
      size: initialResponse.totalElements,
      sort: filterParams.sort ?? "createdAt,DESC",
    };

    const allFilteredQueryString = buildQueryString(allFilteredParams);

    const allFilteredResponse = await apiFetch<PaginatedAdmissionResponse>(
      `${endpoint}${allFilteredQueryString}`,
      {
        method: "GET",
        requiresAuth: isAuthenticated,
      },
    );

    console.log(
      "[AdmissionService] Retrieved all filtered data - Count:",
      allFilteredResponse.content.length,
    );

    return {
      success: true,
      message: "All filtered data retrieved successfully",
      data: allFilteredResponse.content,
    };
  } catch (error) {
    console.error(
      "[AdmissionService] Error fetching filtered admission data:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch filtered admission data",
      data: undefined,
    };
  }
}

/**
 * Convert filter criteria to API parameters
 * @param filters - Filter criteria from the UI
 * @returns API parameters
 */
export function convertFilterCriteriaToParams(filters: {
  uniName?: string[];
  majorName?: string[];
  admissionTypeName?: string[];
  tuitionFeeRange?: {
    min?: number;
    max?: number;
  };
  province?: string[];
  studyProgram?: string[];
  subjectCombination?: string[];
}): Partial<AdmissionParams> {
  const params: Partial<AdmissionParams> = {};

  // Map filter criteria to API parameters
  if (filters.uniName && filters.uniName.length > 0) {
    params.uniName = filters.uniName;
  }
  if (filters.majorName && filters.majorName.length > 0) {
    params.majorName = filters.majorName;
  }
  if (filters.admissionTypeName && filters.admissionTypeName.length > 0) {
    params.admissionTypeName = filters.admissionTypeName;
  }
  if (filters.province && filters.province.length > 0) {
    params.province = filters.province;
  }
  if (filters.studyProgram && filters.studyProgram.length > 0) {
    params.studyProgram = filters.studyProgram;
  }
  if (filters.subjectCombination && filters.subjectCombination.length > 0) {
    params.subjectCombination = filters.subjectCombination;
  }

  // Handle tuition fee range
  // Note: The API expects exact tuition fee values, not a range
  // You might need to adjust this based on your API's actual behavior
  if (filters.tuitionFeeRange) {
    // This is a simplified approach - you may need to adjust based on your API
    // For now, we'll pass the range values if they exist
    const fees: number[] = [];
    if (filters.tuitionFeeRange.min !== undefined) {
      fees.push(filters.tuitionFeeRange.min);
    }
    if (filters.tuitionFeeRange.max !== undefined) {
      fees.push(filters.tuitionFeeRange.max);
    }
    if (fees.length > 0) {
      params.tuitionFee = fees;
    }
  }

  return params;
}

/**
 * Get admission prediction for guest users (no authentication required)
 * @param studentId - The student ID from profile
 * @returns Promise with admission data
 */
export async function getGuestAdmission(
  studentId: string,
): Promise<AdmissionResponse> {
  return getInitialAdmissionData(studentId, false);
}

/**
 * Get admission prediction for authenticated users (requires bearer token)
 * @param studentId - The student ID from profile
 * @returns Promise with admission data
 */
export async function getAuthenticatedAdmission(
  studentId: string,
): Promise<AdmissionResponse> {
  return getInitialAdmissionData(studentId, true);
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
  return getInitialAdmissionData(studentId, isAuthenticated);
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

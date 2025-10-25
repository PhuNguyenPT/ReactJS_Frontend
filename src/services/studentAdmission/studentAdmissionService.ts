import apiFetch from "../../utils/apiFetch";
import {
  hasUserId,
  type StudentResponse,
} from "../../type/interface/profileTypes";
import type {
  AdmissionApiResponse,
  AdmissionProgram,
} from "../../type/interface/admissionTypes";

// Response types for admission API
export interface AdmissionResponse {
  success: boolean;
  message?: string;
  data?: AdmissionApiResponse | AdmissionProgram[];
  totalPages?: number;
  totalElements?: number;
  currentPage?: number;
}

// Parameters for admission API
export interface AdmissionParams {
  page?: string;
  size?: string;
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
  tuitionFeeMin?: number;
  tuitionFeeMax?: number;
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
  sort: {
    orders: {
      direction: string;
      field: string;
    }[];
  };
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

  // Handle tuition fee min/max
  if (params.tuitionFeeMin !== undefined) {
    queryParams.append("tuitionFeeMin", params.tuitionFeeMin.toString());
  }
  if (params.tuitionFeeMax !== undefined) {
    queryParams.append("tuitionFeeMax", params.tuitionFeeMax.toString());
  }

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Get paginated admission data
 * @param studentId - The student ID
 * @param isAuthenticated - Whether the user is authenticated
 * @param page - Page number (1-indexed)
 * @param size - Items per page
 * @param filterParams - Optional filter parameters
 * @returns Promise with paginated admission data
 */
export async function getPaginatedAdmissionData(
  studentId: string,
  isAuthenticated: boolean,
  page = import.meta.env.VITE_PAGINATION_DEFAULT_PAGE,
  size = import.meta.env.VITE_PAGINATION_DEFAULT_SIZE,
  filterParams?: Partial<AdmissionParams>,
): Promise<AdmissionResponse> {
  try {
    console.log(
      `[AdmissionService] Fetching page ${String(page)} with size ${String(size)}`,
    );

    const endpoint = isAuthenticated
      ? `/admission/${studentId}`
      : `/admission/guest/${studentId}`;

    const params: AdmissionParams = {
      ...filterParams,
      page: page,
      size: size,
      sort: filterParams?.sort ?? import.meta.env.VITE_PAGINATION_DEFAULT_SORT,
    };

    const queryString = buildQueryString(params);

    console.log("[AdmissionService] Query:", `${endpoint}${queryString}`);

    const response = await apiFetch<PaginatedAdmissionResponse>(
      `${endpoint}${queryString}`,
      {
        method: "GET",
        requiresAuth: isAuthenticated,
      },
    );

    console.log(
      `[AdmissionService] Retrieved page ${String(response.number + 1)} of ${String(response.totalPages)}`,
    );

    return {
      success: true,
      message: "Admission data retrieved successfully",
      data: response,
      totalPages: response.totalPages,
      totalElements: response.totalElements,
      currentPage: response.number + 1, // API returns 0-indexed, we use 1-indexed
    };
  } catch (error) {
    console.error("[AdmissionService] Error fetching admission data:", error);

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

  // Handle tuition fee range with separate min/max parameters
  if (filters.tuitionFeeRange) {
    if (filters.tuitionFeeRange.min !== undefined) {
      params.tuitionFeeMin = filters.tuitionFeeRange.min;
    }
    if (filters.tuitionFeeRange.max !== undefined) {
      params.tuitionFeeMax = filters.tuitionFeeRange.max;
    }
  }

  console.log("[AdmissionService] Converted filter params:", params);

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

// Backward compatibility exports (deprecated - use getPaginatedAdmissionData instead)
export async function getInitialAdmissionData(
  studentId: string,
  isAuthenticated: boolean,
): Promise<AdmissionResponse> {
  return getPaginatedAdmissionData(
    studentId,
    isAuthenticated,
    import.meta.env.VITE_PAGINATION_DEFAULT_PAGE,
    import.meta.env.VITE_PAGINATION_DEFAULT_SIZE,
  );
}

export async function getFilteredAdmissionData(
  studentId: string,
  isAuthenticated: boolean,
  filterParams: Partial<AdmissionParams>,
): Promise<AdmissionResponse> {
  return getPaginatedAdmissionData(
    studentId,
    isAuthenticated,
    import.meta.env.VITE_PAGINATION_DEFAULT_PAGE,
    import.meta.env.VITE_PAGINATION_DEFAULT_SIZE,
    filterParams,
  );
}

import apiFetch from "../../utils/apiFetch";

export interface StudentRecord {
  createdAt: string;
  id: string;
  updatedAt: string;
  userId: string;
}

export interface StudentsResponse {
  content: StudentRecord[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: {
    orders: {
      direction: string;
      field: string;
    }[];
  };
  totalElements: number;
  totalPages: number;
}

export const getStudentHistory = async (): Promise<StudentsResponse> => {
  try {
    // First API call: Get total count with minimal data (size=1)
    const initialResponse = await apiFetch<StudentsResponse>(
      "/students?page=1&size=1&sort=createdAt,DESC",
      {
        method: "GET",
        requiresAuth: true,
      },
    );

    const totalElements = initialResponse.totalElements;

    // If there are no records or only one, return the initial response
    if (totalElements <= 1) {
      return initialResponse;
    }

    // Second API call: Fetch all records at once using the total count as size
    const allRecordsResponse = await apiFetch<StudentsResponse>(
      `/students?page=1&size=${totalElements.toString()}&sort=createdAt,DESC`,
      {
        method: "GET",
        requiresAuth: true,
      },
    );

    return allRecordsResponse;
  } catch (error) {
    console.error("Error fetching student history:", error);
    throw error;
  }
};

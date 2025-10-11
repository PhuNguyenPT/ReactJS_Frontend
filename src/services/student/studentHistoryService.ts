import apiFetch from "../../utils/apiFetch";

export interface StudentRecord {
  createdAt: string;
  id: string;
  modifiedAt: string;
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
    const response = await apiFetch<StudentsResponse>("/students", {
      method: "GET",
      requiresAuth: true,
    });

    return response;
  } catch (error) {
    console.error("Error fetching student history:", error);
    throw error;
  }
};

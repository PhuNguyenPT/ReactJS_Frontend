export interface StudentResponse {
  success?: boolean;
  message?: string;
  id?: string;
  userId?: string;
  majors?: string[];
  data?: {
    id?: string;
    userId?: string;
    email?: string;
    name?: string;
    majors?: string[];
    [key: string]: unknown;
  };
}

// Helper type guard to check if response has student ID
export function hasUserId(response: StudentResponse): string | null {
  const studentId = response.id ?? response.data?.id;

  if (studentId) {
    return studentId;
  }
  return null;
}

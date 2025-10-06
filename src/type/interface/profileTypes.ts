// Response structure from the /students API
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

// Helper type guard to check if response has userId/id
export function hasUserId(response: StudentResponse): string | null {
  // Check for id/userId in different possible locations
  // Priority order: root level id, then data.id, then userId, then data.userId
  const studentId =
    response.id ??
    response.data?.id ??
    response.userId ??
    response.data?.userId;

  if (studentId) {
    console.log("Found student ID:", studentId);
    localStorage.setItem("studentId", studentId);
  } else {
    console.warn("No student ID found in response:", response);
  }

  return studentId ?? null;
}

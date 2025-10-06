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

// Helper type guard to check if response has student ID
// IMPORTANT: This should ONLY be called with StudentResponse objects from the /students API
// NOT with user authentication objects
export function hasUserId(response: StudentResponse): string | null {
  // The 'id' field in the student response is the STUDENT ID
  // DO NOT confuse with 'userId' which is the authenticated user's ID
  const studentId = response.id ?? response.data?.id;

  if (studentId) {
    console.log("[profileTypes] Found student ID:", studentId);
    // Only log, don't save here - let the calling code decide where to save
    return studentId;
  }

  console.warn("[profileTypes] No student ID found in response:", response);
  return null;
}

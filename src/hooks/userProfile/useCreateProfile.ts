import type { FormData } from "../../contexts/FormData/FormDataContext";
import { submitGuestStudent } from "../../services/student/guestStudentProfile";
import { submitAuthenticatedStudent } from "../../services/student/studentProfile";
import { isUserAuthenticated } from "../../utils/profileAuthUtils";
import type { StudentResponse } from "../../type/interface/profileTypes";

/**
 * Main function that automatically submits to the correct endpoint
 * based on user authentication status
 */
export async function submitStudentProfile(
  formData: FormData,
): Promise<StudentResponse> {
  if (isUserAuthenticated()) {
    return submitAuthenticatedStudent(formData);
  } else {
    return submitGuestStudent(formData);
  }
}

// Re-export commonly used functions and types for convenience
export { isUserAuthenticated } from "../../utils/profileAuthUtils";
export type { StudentResponse } from "../../type/interface/profileTypes";

import apiFetch from "../../utils/apiFetch";
import type { FormData } from "../../contexts/FormDataContext/FormDataContext";
import { transformFormDataToApiSchema } from "../../contexts/FormDataContext/FormDataTransformer";

export interface StudentResponse {
  // adjust this according to the actual response from your backend
  success: boolean;
  message?: string;
  data?: unknown;
}

export async function submitGuestStudent(
  formData: FormData,
): Promise<StudentResponse> {
  const payload = transformFormDataToApiSchema(formData);

  return await apiFetch<StudentResponse, typeof payload>("/students/guest", {
    method: "POST",
    body: payload,
  });
}

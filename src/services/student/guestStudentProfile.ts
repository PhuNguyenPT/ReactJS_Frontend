import apiFetch from "../../utils/apiFetch";
import type { FormData } from "../../contexts/FormData/FormDataContext";
import { transformFormDataToApiSchema } from "../../contexts/FormData/FormDataTransformer";

export interface StudentResponse {
  status: number;
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

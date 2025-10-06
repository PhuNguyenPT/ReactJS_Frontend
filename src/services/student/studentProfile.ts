import apiFetch from "../../utils/apiFetch";
import type { FormData } from "../../contexts/FormData/FormDataContext";
import { transformFormDataToApiSchema } from "../../contexts/FormData/FormDataTransformer";
import type { StudentResponse } from "../../type/interface/profileTypes";

/**
 * Submit student profile for authenticated users (requires access token)
 */
export async function submitAuthenticatedStudent(
  formData: FormData,
): Promise<StudentResponse> {
  const payload = transformFormDataToApiSchema(formData);

  return await apiFetch<StudentResponse, typeof payload>("/students", {
    method: "POST",
    body: payload,
    requiresAuth: true,
  });
}

import apiFetch from "../../utils/apiFetch";
import type { FormData } from "../../contexts/FormData/FormDataContext";
import { transformFormDataToApiSchema } from "../../contexts/FormData/FormDataTransformer";
import type { StudentResponse } from "../../type/interface/profileTypes";

/**
 * Submit student profile for guest users (no authentication required)
 */
export async function submitGuestStudent(
  formData: FormData,
): Promise<StudentResponse> {
  const payload = transformFormDataToApiSchema(formData);

  return await apiFetch<StudentResponse, typeof payload>("/students/guest", {
    method: "POST",
    body: payload,
  });
}

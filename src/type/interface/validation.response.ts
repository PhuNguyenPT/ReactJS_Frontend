import type { ErrorResponse } from "./error.response";

export interface ValidationResponse extends ErrorResponse {
  validationErrors?: Record<string, string>;
}

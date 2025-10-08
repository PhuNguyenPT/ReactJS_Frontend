import type { ErrorResponse } from "./error.response";
import type { ValidationResponse } from "./validation.response";

export interface ErrorDetails {
  message: string;
  validationErrors?: ErrorResponse | ValidationResponse;
  status: number;
}

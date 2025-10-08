import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { loginUser } from "../../services/user/authService";
import axios, { AxiosError } from "axios";
import type { ErrorDetails } from "../../type/interface/error.details";
import { LoginDto } from "../../dto/loginDto";
import { validateDTO } from "../../utils/validation";
import { plainToInstance } from "class-transformer";
import APIError from "../../utils/apiError"; // ✅ Import APIError

export default function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    // Use class-validator instead of manual checks
    const dto = plainToInstance(LoginDto, { email, password });
    const validationErrors = await validateDTO(dto);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({}); // clear previous errors

    try {
      setLoading(true);

      const authResponse = await loginUser({ email, password });
      if (authResponse.success && authResponse.accessToken) {
        login(authResponse);

        const redirectPath = sessionStorage.getItem("redirectAfterAuth");
        if (redirectPath) {
          sessionStorage.removeItem("redirectAfterAuth");
          await navigate(redirectPath);
        } else {
          window.location.replace("/");
        }
      } else {
        setApiError(authResponse.message || "Login failed");
      }
    } catch (error: unknown) {
      let message = "An unexpected error occurred. Please try again.";

      // ✅ Handle APIError (thrown by apiFetch)
      if (error instanceof APIError) {
        const errorData = error.data as ErrorDetails;

        // Check if there are validation errors in the data
        if (errorData.validationErrors) {
          const validationErrors = errorData.validationErrors;

          // Extract all validation error messages
          const fieldErrors = Object.values(validationErrors)
            .filter((errorMsg) => typeof errorMsg === "string")
            .join(". ");

          // Use field errors if they exist
          message = fieldErrors || errorData.message || error.message;
        } else if (errorData.message) {
          message = errorData.message;
        } else {
          message = error.message;
        }
      }
      // ✅ Fallback: Handle raw Axios errors (if apiFetch is bypassed)
      else if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorDetails>;

        if (axiosError.response?.data.validationErrors) {
          const validationErrors = axiosError.response.data.validationErrors;
          const fieldErrors = Object.values(validationErrors)
            .filter((errorMsg) => typeof errorMsg === "string")
            .join(". ");

          message =
            fieldErrors ||
            axiosError.response.data.message ||
            axiosError.message;
        } else if (axiosError.response?.data.message) {
          message = axiosError.response.data.message;
        } else if (axiosError.message) {
          message = axiosError.message;
        }
      }
      // ✅ Handle generic errors
      else if (error instanceof Error) {
        message = error.message;
      }

      setApiError(message);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    errors,
    handleLogin,
    loading,
    apiError,
    clearApiError: () => {
      setApiError("");
    },
    showPassword,
    setShowPassword,
  };
}

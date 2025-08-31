import { useState } from "react";
import useAuth from "./useAuth";
import { loginUser } from "../services/user/authService";
import axios, { AxiosError } from "axios";
import type { ErrorDetails } from "../type/interface/error.details";
import { LoginDto } from "../dto/loginDto";
import { validateDTO } from "../utils/validation";
import { plainToInstance } from "class-transformer";

export default function useLoginForm() {
  const { login } = useAuth();

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

    // ✅ Use class-validator instead of manual checks
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
        window.location.replace("/");
      } else {
        setApiError(authResponse.message || "Login failed");
      }
    } catch (error: unknown) {
      let message = "An unexpected error occurred. Please try again.";

      if (axios.isAxiosError(error)) {
        const apiError = error as AxiosError<ErrorDetails>;
        if (apiError.response?.data.validationErrors) {
          const validationErrors = apiError.response.data.validationErrors;
          const fieldErrors = Object.values(validationErrors)
            .map((errorMsg) => String(errorMsg))
            .join(", ");
          message = fieldErrors;
        } else if (apiError.response?.data.message) {
          message = apiError.response.data.message;
        } else if (apiError.message) {
          message = apiError.message;
        }
      } else if (error instanceof Error) {
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

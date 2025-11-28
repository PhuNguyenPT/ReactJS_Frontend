import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "./useAuth";
import { loginUser } from "../../services/user/authService";
import axios, { AxiosError } from "axios";
import type { ErrorDetails } from "../../type/interface/error.details";
import { LoginDto } from "../../dto/loginDto";
import { validateDTO } from "../../utils/validation";
import { plainToInstance } from "class-transformer";
import APIError from "../../utils/apiError";

// Translation utility function
const translateErrorMessage = (
  message: string,
  t: (key: string) => string,
): string => {
  if (message.startsWith("validation.") || message.startsWith("errors.")) {
    return t(message);
  }
  return message;
};

export default function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Store error KEYS instead of translated messages
  const [errorKeys, setErrorKeys] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Translate error keys to messages on-the-fly
  // This makes errors reactive to language changes
  const errors = {
    email: errorKeys.email
      ? translateErrorMessage(errorKeys.email, t)
      : undefined,
    password: errorKeys.password
      ? translateErrorMessage(errorKeys.password, t)
      : undefined,
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    // Validate using class-validator
    const dto = plainToInstance(LoginDto, { email, password });
    const validationErrors = await validateDTO(dto);

    if (Object.keys(validationErrors).length > 0) {
      setErrorKeys(validationErrors);
      return;
    }
    setErrorKeys({});

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
        const errorMsg = authResponse.message || t("errors.loginFailed");
        setApiError(translateErrorMessage(errorMsg, t));
      }
    } catch (error: unknown) {
      let message = t("errors.unexpected");

      // Handle APIError (thrown by apiFetch)
      if (error instanceof APIError) {
        const errorData = error.data as ErrorDetails;

        if (errorData.validationErrors) {
          const validationErrors = errorData.validationErrors;

          // Translate all validation error messages
          const fieldErrors = Object.values(validationErrors)
            .filter((errorMsg) => typeof errorMsg === "string")
            .map((errorMsg) => translateErrorMessage(errorMsg, t))
            .join(". ");

          message =
            fieldErrors ||
            translateErrorMessage(errorData.message || error.message, t);
        } else if (errorData.message) {
          message = translateErrorMessage(errorData.message, t);
        } else {
          message = translateErrorMessage(error.message, t);
        }
      }
      // Fallback: Handle raw Axios errors
      else if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorDetails>;

        if (axiosError.response?.data.validationErrors) {
          const validationErrors = axiosError.response.data.validationErrors;
          const fieldErrors = Object.values(validationErrors)
            .filter((errorMsg) => typeof errorMsg === "string")
            .map((errorMsg) => translateErrorMessage(errorMsg, t))
            .join(". ");

          message =
            fieldErrors ||
            translateErrorMessage(
              axiosError.response.data.message || axiosError.message,
              t,
            );
        } else if (axiosError.response?.data.message) {
          message = translateErrorMessage(axiosError.response.data.message, t);
        } else if (axiosError.message) {
          message = translateErrorMessage(axiosError.message, t);
        }
      }
      // Handle generic errors
      else if (error instanceof Error) {
        message = translateErrorMessage(error.message, t);
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "./useAuth";
import { signupUser } from "../../services/user/authService";
import axios, { AxiosError } from "axios";
import type { ErrorDetails } from "../../type/interface/error.details";
import { SignupDto } from "../../dto/signUpDto";
import { validateDTO } from "../../utils/validation";
import { plainToInstance } from "class-transformer";
import APIError from "../../utils/apiError";

const translateErrorMessage = (
  message: string,
  t: (key: string) => string,
): string => {
  if (message.startsWith("validation.") || message.startsWith("errors.")) {
    return t(message);
  }
  return message;
};

export function useSignupForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Store error KEYS, not translated messages
  const [errorKeys, setErrorKeys] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Translate error keys to messages on-the-fly
  const errors = {
    email: errorKeys.email
      ? translateErrorMessage(errorKeys.email, t)
      : undefined,
    password: errorKeys.password
      ? translateErrorMessage(errorKeys.password, t)
      : undefined,
    confirmPassword: errorKeys.confirmPassword
      ? translateErrorMessage(errorKeys.confirmPassword, t)
      : undefined,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    const dto = plainToInstance(SignupDto, {
      email,
      password,
      confirmPassword,
    });
    const validationErrors = await validateDTO(dto);

    // Store the KEY, not the translated message
    if (password && confirmPassword && password !== confirmPassword) {
      validationErrors.confirmPassword = "validation.confirmPassword.match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrorKeys(validationErrors); // Store keys
      return;
    }
    setErrorKeys({}); // Clear previous errors

    try {
      setLoading(true);
      const authResponse = await signupUser({ email, password });

      if (authResponse.success && authResponse.accessToken) {
        register(authResponse);

        const redirectPath = sessionStorage.getItem("redirectAfterAuth");
        if (redirectPath) {
          sessionStorage.removeItem("redirectAfterAuth");
          await navigate(redirectPath);
        } else {
          window.location.replace("/");
        }
      } else {
        const errorMsg = authResponse.message || t("errors.signupFailed");
        setApiError(translateErrorMessage(errorMsg, t));
      }
    } catch (error: unknown) {
      let message = t("signupForm.errors.unexpected");

      if (error instanceof APIError) {
        const errorData = error.data as ErrorDetails;

        if (errorData.validationErrors) {
          const validationErrors = errorData.validationErrors;

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
      } else if (axios.isAxiosError(error)) {
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
      } else if (error instanceof Error) {
        message = translateErrorMessage(error.message, t);
      }

      setApiError(message);
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearApiError = () => {
    setApiError("");
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    loading,
    apiError,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleSubmit,
    clearApiError,
    showSuccessDialog,
    setShowSuccessDialog,
  };
}

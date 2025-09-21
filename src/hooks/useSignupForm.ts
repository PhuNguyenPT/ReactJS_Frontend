import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { signupUser } from "../services/user/authService";
import axios, { AxiosError } from "axios";
import type { ErrorDetails } from "../type/interface/error.details";
import { SignupDto } from "../dto/signUpDto";
import { validateDTO } from "../utils/validation";
import { plainToInstance } from "class-transformer";

export function useSignupForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    // class-validator for basic validations
    const dto = plainToInstance(SignupDto, {
      email,
      password,
      confirmPassword,
    });
    const validationErrors = await validateDTO(dto);

    // password match validation
    if (password && confirmPassword && password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({}); // clear previous errors

    try {
      setLoading(true);
      const authResponse = await signupUser({ email, password });

      // Check if Register was successful
      if (authResponse.success && authResponse.accessToken) {
        register(authResponse);

        // Check if there's a redirect path stored
        const redirectPath = sessionStorage.getItem("redirectAfterAuth");
        if (redirectPath) {
          // Clear the stored redirect path
          sessionStorage.removeItem("redirectAfterAuth");
          // Navigate to the stored path
          await navigate(redirectPath);
        } else {
          // Default redirect to home
          window.location.replace("/");
        }
      } else {
        setApiError(authResponse.message || "Register failed");
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

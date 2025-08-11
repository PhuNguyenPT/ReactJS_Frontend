import { useState } from "react";
import useAuth from "./useAuth";
import { signupUser } from "../services/user/authService";
import axios, { AxiosError } from "axios";
import type { ErrorDetails } from "../type/interface/error.details";

export function useSignupForm() {
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const validateEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());

  const validatePassword = (value: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]{8,128}$/.test(
      value,
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Client-side validations
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must be 8-128 characters and include uppercase, lowercase, number, and special character.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((msg) => msg !== "");
    if (hasError) return;

    try {
      setLoading(true);
      const authResponse = await signupUser({ email, password });
      // Check if Register was successful
      if (authResponse.success && authResponse.accessToken) {
        register(authResponse);
        window.location.replace("/");
      } else {
        setApiError(authResponse.message || "Register failed");
      }
    } catch (error: unknown) {
      let message = "An unexpected error occurred. Please try again.";

      if (axios.isAxiosError(error)) {
        const apiError = error as AxiosError<ErrorDetails>;

        if (apiError.response?.data.validationErrors) {
          const validationErrors = apiError.response.data.validationErrors;
          const fieldErrors = Object.entries(validationErrors)
            .map(([field, errorMsg]) => `${field}: ${String(errorMsg)}`)
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

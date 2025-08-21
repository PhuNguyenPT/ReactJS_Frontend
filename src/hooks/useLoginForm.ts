import { useState } from "react";
import useAuth from "./useAuth";
import { loginUser } from "../services/user/authService";
import axios, { AxiosError } from "axios";
import type { ErrorDetails } from "../type/interface/error.details";

export default function useLoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    const newErrors = {
      email: "",
      password: "",
    };

    // Simple validations
    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((msg) => msg !== "");
    if (hasError) return;

    try {
      setLoading(true);

      // Your loginUser already returns AuthResponse directly
      const authResponse = await loginUser({ email, password });
      // Check if login was successful
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
          // Extract only the error messages without field names
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

  const clearApiError = () => {
    setApiError("");
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
    clearApiError,
    showPassword,
    setShowPassword,
  };
}

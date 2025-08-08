import { useState } from "react";
import { loginUser } from "../services/user/authService";
import axios, { AxiosError } from "axios";
import type { ErrorDetails } from "../type/error.details";

export default function useLoginForm() {
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

      const response = await loginUser({ email, password });
      console.log("Login success:", response);

      // Example:
      // localStorage.setItem("token", response.token);
      // navigate("/dashboard");
    } catch (error: unknown) {
      let message = "An unexpected error occurred. Please try again.";

      if (axios.isAxiosError(error)) {
        const apiError = error as AxiosError<ErrorDetails>;

        // Try to get the message from API response in order of preference
        if (apiError.response?.data.validationErrors) {
          // Handle validation errors
          const validationErrors = apiError.response.data.validationErrors;
          // Check if it's a ValidationResponse with validationErrors property
          if (
            "validationErrors" in validationErrors &&
            validationErrors.validationErrors
          ) {
            // Format validation errors into a readable string
            const fieldErrors = Object.entries(
              validationErrors.validationErrors,
            )
              .map(([field, error]) => `${field}: ${error}`)
              .join(", ");
            message = fieldErrors;
          } else {
            // It's an ErrorResponse, use its message
            message = validationErrors.message;
          }
        } else if (apiError.response?.data.message) {
          // This will get the message from any API exception (including BadCredentialsException)
          message = apiError.response.data.message;
        } else if (apiError.message) {
          // Network errors or other axios errors
          message = apiError.message;
        }
      } else if (error instanceof Error) {
        // Handle non-Axios errors
        message = error.message;
      }

      setApiError(message);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear API error (useful for UI)
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

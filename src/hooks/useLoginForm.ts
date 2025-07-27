import { useState } from "react";
import { loginUser } from "../services/user/authService";
import axios, { AxiosError } from "axios";

// Define the structure of your API error response
interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

export default function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

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
        const apiError = error as AxiosError<ApiErrorResponse>;

        // Try to get the message from API response in order of preference
        if (apiError.response?.data.message) {
          // This will get the message from any API exception (including BadCredentialsException)
          message = apiError.response.data.message;
        } else if (apiError.response?.data.error) {
          // Fallback to 'error' field if 'message' doesn't exist
          message = apiError.response.data.error;
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
  };
}

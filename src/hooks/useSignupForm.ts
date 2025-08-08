import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/user/authService"; // Assuming you have this service
import axios, { AxiosError } from "axios";
import type { ErrorDetails } from "../type/error.details";

export function useSignupForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validatePassword = (value: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_+\-={}[\]{};':"\\|,.<>/?`~]{8,128}$/.test(
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
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must be 8 to 128 characters and include uppercase, lowercase, number, and special character.";
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

      const response = await signupUser({ email, password });
      console.log("Signup success:", response);

      // Show success dialog instead of immediate redirect
      setShowSuccessDialog(true);
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
          // This will get the message from any API exception
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
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear API error (useful for UI)
  const clearApiError = () => {
    setApiError("");
  };

  // Handle success dialog close and redirect
  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    void navigate("/login", {
      state: {
        message:
          "Account created successfully! Please login with your credentials.",
      },
    });
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
    handleDialogClose,
  };
}

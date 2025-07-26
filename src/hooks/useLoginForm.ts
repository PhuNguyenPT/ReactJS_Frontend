import { useState } from "react";
import { loginUser } from "../services/user/authService";
import axios, { AxiosError } from "axios";

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
      let message = "Incorrect Email, Username or Password";

      if (axios.isAxiosError(error)) {
        const apiError = error as AxiosError<{ message?: string }>;
        message = apiError.response?.data.message ?? message;
      }

      setApiError(message);
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
  };
}

// hooks/useLoginForm.ts
import { useState } from "react";
import { login } from "../services/user/authService";
import { AxiosError } from "axios";

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

    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((msg) => msg !== "");
    if (hasError) return;

    try {
      setLoading(true);
      const response = await login({ email, password });

      // You can handle success here (e.g. store token, redirect)
      console.log("Login success:", response);

      // Example: store token
      // localStorage.setItem("token", response.token);

      // Example: redirect (if using react-router)
      // navigate("/dashboard");
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const message =
        axiosErr.response?.data.message ??
        "Incorrect E-mail, username or password";
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

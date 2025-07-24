import { useState } from "react";

export default function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
    };

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((msg) => msg !== "");
    if (!hasError) {
      console.log("Logging in with:", { email, password });
      // TODO: call API
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    errors,
    handleSubmit,
  };
}

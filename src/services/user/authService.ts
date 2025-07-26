// src/services/authService.ts
import apiFetch from "../../utils/api";

interface RegisterPayload {
  email: string;
  password: string;
}

export function register(payload: RegisterPayload) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function login(payload: RegisterPayload) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: payload,
  });
}

import apiFetch from "../../utils/apiFetch";

interface AuthPayload {
  email: string;
  password: string;
}

export function loginUser(payload: AuthPayload) {
  return apiFetch<{ token: string }>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function signupUser(payload: AuthPayload) {
  return apiFetch<{ token: string }>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

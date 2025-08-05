import apiFetch from "../../utils/apiFetch";

interface AuthPayload {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  phoneNumbers: string[];
  status: string;
}

interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  message: string;
  refreshToken: string;
  success: boolean;
  tokenType: string;
  user: User;
}

/* Authenticates user with email and password*/
export async function loginUser(payload: AuthPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
    requiresAuth: false,
  });
}

/* Registers a new user account*/
export async function signupUser(payload: AuthPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
    requiresAuth: false,
  });
}

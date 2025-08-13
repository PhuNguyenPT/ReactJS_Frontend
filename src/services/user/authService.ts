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

interface LogoutResponse {
  success: boolean;
  message: string;
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

/* Logs out the current user and invalidates tokens*/
export async function logoutUser(): Promise<LogoutResponse> {
  return apiFetch<LogoutResponse>("/auth/logout", {
    method: "POST",
    requiresAuth: true,
  });
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    requiresAuth: false,
  });
}

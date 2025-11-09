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

interface LogoutPayload {
  refreshToken: string;
}

interface RefreshTokenPayload {
  refreshToken: string;
}

/**
 * Authenticates user with email and password
 * Stores tokens in localStorage on success
 */
export async function loginUser(payload: AuthPayload): Promise<AuthResponse> {
  try {
    const response = await apiFetch<AuthResponse, AuthPayload>("/auth/login", {
      method: "POST",
      body: payload,
      requiresAuth: false,
    });

    // Store tokens on successful login
    if (response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }
    }

    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

/**
 * Registers a new user account
 * Stores tokens in localStorage on success
 */
export async function signupUser(payload: AuthPayload): Promise<AuthResponse> {
  try {
    const response = await apiFetch<AuthResponse, AuthPayload>(
      "/auth/register",
      {
        method: "POST",
        body: payload,
        requiresAuth: false,
      },
    );

    // Store tokens on successful signup
    if (response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }
    }

    return response;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
}

/**
 * Logs out the current user and invalidates tokens
 * Requires both access token (in header) and refresh token (in body)
 */
export async function logoutUser(): Promise<LogoutResponse> {
  try {
    // Get the refresh token from localStorage
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const payload: LogoutPayload = {
      refreshToken: refreshToken,
    };

    const response = await apiFetch<LogoutResponse, LogoutPayload>(
      "/auth/logout",
      {
        method: "POST",
        body: payload,
        requiresAuth: true, // This will add the access token to headers
      },
    );

    // Clear tokens from localStorage on successful logout
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return response;
  } catch (error) {
    console.error("Logout failed:", error);
    // Clear tokens even if logout fails
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    throw error;
  }
}

/**
 * Refreshes the access token using the refresh token
 * Updates tokens in localStorage on success
 */
export async function refreshAccessToken(): Promise<AuthResponse> {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const payload: RefreshTokenPayload = {
      refreshToken: refreshToken,
    };

    const response = await apiFetch<AuthResponse, RefreshTokenPayload>(
      "/auth/refresh",
      {
        method: "POST",
        body: payload,
        requiresAuth: false,
      },
    );

    // Update tokens on successful refresh
    if (response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }
    }

    return response;
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Clear tokens if refresh fails
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    throw error;
  }
}

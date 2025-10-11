import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthResponse, type User } from "./AuthContext";
import axios from "axios";
import { isTokenExpired } from "../../utils/tokenUtils";
import { useTokenRefresh } from "../../hooks/auth/useTokenRefresh";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("studentId");
  };

  useTokenRefresh({
    accessToken: token,
    refreshToken,
    onTokenUpdate: (newTokens) => {
      setToken(newTokens.accessToken);
      setRefreshToken(newTokens.refreshToken);
      setUser(newTokens.user);

      localStorage.setItem("accessToken", newTokens.accessToken);
      localStorage.setItem("refreshToken", newTokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(newTokens.user));
    },
    onRefreshFail: logout,
    accessBufferTime: 60000, // 1 minute before expiry
    refreshBufferTime: 24 * 60 * 60 * 1000, // 1 day before expiry
  });

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
        return config;
      },
      (error) =>
        Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        ),
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
        }
        return Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        );
      },
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      if (isTokenExpired(savedToken)) {
        console.warn("Access token expired on load, logging out...");
        logout();
      } else {
        try {
          setToken(savedToken);
          setRefreshToken(savedRefreshToken);
          setUser(JSON.parse(savedUser) as User);
        } catch (error) {
          console.error("Error parsing saved user data:", error);
          logout();
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = (authResponse: AuthResponse) => {
    const {
      accessToken,
      refreshToken: newRefreshToken,
      user: newUser,
    } = authResponse;
    setToken(accessToken);
    setRefreshToken(newRefreshToken);
    setUser(newUser);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const register = login; // Same logic as login

  const displayName = user?.name ?? user?.email ?? "Guest";
  const value = useMemo(
    () => ({
      user,
      token,
      refreshToken,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      register,
      logout,
      displayName,
    }),
    [user, token, refreshToken, isLoading, register, displayName],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
};

import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthResponse, type User } from "./AuthContext";
import axios from "axios";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        );
      },
    );

    // Response interceptor to handle 401 errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Token might be expired, clear auth data
          logout();
        }
        return Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        );
      },
    );

    // Cleanup interceptors on unmount
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
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setToken(savedToken);
        setRefreshToken(savedRefreshToken);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
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

  const register = (authResponse: AuthResponse) => {
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

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  const displayName = user?.name ?? user?.email;
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
    [user, token, refreshToken, isLoading, displayName],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
};

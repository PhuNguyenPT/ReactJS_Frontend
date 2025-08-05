// src/contexts/AuthProvider.tsx
import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, AuthResponse, User } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      logout,
      displayName,
    }),
    [user, token, refreshToken, isLoading, displayName],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
};

// src/contexts/AuthContext.ts
import { createContext } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumbers: string[];
  status: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  message: string;
  refreshToken: string;
  success: boolean;
  tokenType: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
  displayName?: string;
}

// ✅ Export context only
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

import { useEffect, useRef } from "react";
import { decodeJWT } from "../utils/decodeJWT";
import { refreshAccessToken } from "../services/user/authService"; // adjust path
import type { AuthResponse } from "../contexts/auth/AuthContext";

interface TokenRefreshOptions {
  accessToken: string | null;
  refreshToken: string | null;
  onTokenUpdate: (newTokens: AuthResponse) => void;
  onRefreshFail: () => void;
  accessBufferTime?: number; // ms before access token expiry to refresh
  refreshBufferTime?: number; // ms before refresh token expiry to refresh
}

export function useTokenRefresh({
  accessToken,
  refreshToken,
  onTokenUpdate,
  onRefreshFail,
  accessBufferTime = 60000, // 1 min before expiry
  refreshBufferTime = 24 * 60 * 60 * 1000, // 1 day before expiry
}: TokenRefreshOptions) {
  const accessTimeoutId = useRef<number | null>(null);
  const refreshTimeoutId = useRef<number | null>(null);

  useEffect(() => {
    if (!accessToken || !refreshToken) return;

    const clearTimers = () => {
      if (accessTimeoutId.current) clearTimeout(accessTimeoutId.current);
      if (refreshTimeoutId.current) clearTimeout(refreshTimeoutId.current);
    };

    try {
      const accessExp = decodeJWT(accessToken).exp;
      const refreshExp = decodeJWT(refreshToken).exp;
      if (!accessExp || !refreshExp) return;

      const nowMs = Date.now();

      // Calculate time until refresh for access token
      const accessTimeout = accessExp * 1000 - nowMs - accessBufferTime;
      // Calculate time until refresh token is close to expiry
      const refreshTimeout = refreshExp * 1000 - nowMs - refreshBufferTime;

      clearTimers();

      if (accessTimeout > 0) {
        accessTimeoutId.current = window.setTimeout(async () => {
          try {
            const newTokens = await refreshAccessToken(refreshToken);
            onTokenUpdate(newTokens);
          } catch (err) {
            console.error("Failed to refresh access token:", err);
            onRefreshFail();
          }
        }, accessTimeout);
      } else {
        // If already expired or near expiry → refresh immediately
        void (async () => {
          try {
            const newTokens = await refreshAccessToken(refreshToken);
            onTokenUpdate(newTokens);
          } catch (err) {
            console.error("Failed to refresh access token immediately:", err);
            onRefreshFail();
          }
        })();
      }

      if (refreshTimeout > 0) {
        refreshTimeoutId.current = window.setTimeout(async () => {
          try {
            const newTokens = await refreshAccessToken(refreshToken);
            onTokenUpdate(newTokens);
          } catch (err) {
            console.error("Failed to refresh refresh token:", err);
            onRefreshFail();
          }
        }, refreshTimeout);
      }
    } catch (err) {
      console.error("Error setting refresh timers:", err);
    }

    return () => {
      clearTimers();
    };
  }, [
    accessToken,
    refreshToken,
    onTokenUpdate,
    onRefreshFail,
    accessBufferTime,
    refreshBufferTime,
  ]);
}

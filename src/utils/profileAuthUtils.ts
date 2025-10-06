/**
 * Check if user is authenticated by verifying access token in localStorage
 */
export function isUserAuthenticated(): boolean {
  const accessToken = localStorage.getItem("accessToken");
  return !!accessToken && accessToken.trim() !== "";
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

/**
 * Clear authentication data from localStorage
 */
export function clearAuthData(): void {
  localStorage.removeItem("accessToken");
}

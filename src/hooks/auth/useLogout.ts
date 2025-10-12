import { logoutUser } from "../../services/user/authService";
import useAuth from "./useAuth";
import { clearAllSessionData } from "../../utils/sessionManager";

/**
 * Custom hook for handling user logout
 * Clears server session, local auth state, and all related data
 */
export default function useLogout() {
  const { logout } = useAuth();

  /**
   * Clear all form-related data from localStorage
   */
  const clearFormData = (): void => {
    try {
      const keysToRemove: string[] = [];

      // Collect all form data keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("form_data")) {
          keysToRemove.push(key);
        }
      }

      // Remove all form data keys
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      if (keysToRemove.length > 0) {
        console.log(
          `[Logout] Cleared ${String(keysToRemove.length)} form data items`,
        );
      }
    } catch (error) {
      console.error("[Logout] Error clearing form data:", error);
    }
  };

  /**
   * Handle complete logout process
   * 1. Invalidate server session
   * 2. Clear auth state
   * 3. Clear session data (studentId, tokens, etc.)
   * 4. Clear form data
   * 5. Redirect to home
   */
  const handleLogout = async (): Promise<void> => {
    try {
      // Step 1: Invalidate token on server
      await logoutUser();
      console.log("[Logout] Server session invalidated");
    } catch (error) {
      // Log error but continue with local cleanup
      console.error("[Logout] Server logout error:", error);
    } finally {
      // Step 2: Clear local auth state (via AuthContext)
      logout();

      // Step 3: Clear all session data (studentId, bearer token, activity tracking)
      clearAllSessionData();

      // Step 4: Clear form data
      clearFormData();

      // Step 5: Redirect to home page
      console.log("[Logout] Logout complete, redirecting to home");
      window.location.replace("/");
    }
  };

  return handleLogout;
}

import { logoutUser } from "../services/user/authService";
import useAuth from "./useAuth";

export default function useLogout() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser(); // Invalidate token on server
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      logout(); // Clear local auth state

      // Clear all form data from localStorage
      try {
        // Get all localStorage keys that start with our form data prefix
        const keysToRemove: string[] = [];
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

        console.log("Form data cleared on logout");
      } catch (error) {
        console.error("Error clearing form data on logout:", error);
      }

      window.location.replace("/");
    }
  };

  return handleLogout;
}

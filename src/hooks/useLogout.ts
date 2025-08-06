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
      window.location.replace("/");
    }
  };

  return handleLogout;
}

import { use } from "react";
import { AuthContext } from "../../contexts/auth/AuthContext"; // adjust path as needed
import type { AuthContextType } from "../../contexts/auth/AuthContext"; // if types are in the same file

const useAuth = (): AuthContextType => {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;

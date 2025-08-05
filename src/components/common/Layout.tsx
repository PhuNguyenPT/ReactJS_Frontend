// src/components/Layout.tsx
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "../../contexts/auth/AuthProvider";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const showFooter = location.pathname === "/" || location.pathname === "";

  return (
    <AuthProvider>
      <Header />
      <main>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </AuthProvider>
  );
};

export default Layout;

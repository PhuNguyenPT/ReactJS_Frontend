// src/components/Layout.tsx
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/App.css"; // make sure styles apply to all pages

const Layout = () => {
  const location = useLocation();
  const showFooter = location.pathname === "/" || location.pathname === ""; // Only show footer on landing page

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </>
  );
};

export default Layout;

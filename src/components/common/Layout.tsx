import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const showFooter = location.pathname === "/" || location.pathname === "";

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

import { Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="landing-header">
      <Toolbar className="landing-header-toolbar">
        <div className="logo">
          <Link to="/" className="logo-link">
            UniGuide
            <img src="/education.png" alt="Logo" className="logo-img" />
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <a href="about">About</a>{" "}
            {/* This link is not used in the current context */}
          </li>
          <li>
            <a href="login">Login</a>{" "}
            {/* This link is not used in the current context */}
          </li>
          <li>
            <Link to="/signup">
              <button className="signup-button" type="button">
                Sign Up
              </button>
            </Link>
          </li>
        </ul>
      </Toolbar>
    </header>
  );
}

export default Header;

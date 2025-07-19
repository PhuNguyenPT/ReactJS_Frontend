import { Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="landing-header">
      <Toolbar className="landing-header-toolbar">
        <div className="logo">
          <Link to="/" className="logo-link">
            UniGuide
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#login">Login</a>
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

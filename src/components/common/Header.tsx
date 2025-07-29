import { Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="landing-header">
      <Toolbar className="landing-header-toolbar">
        <div className="logo">
          <Link to="/">
            <img src="/unizylogo.png" alt="Logo" className="logo-img" />
            <span className="logo-text">nizy</span>
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">
              <button className="signup-button" type="button">
                Sign up
              </button>
            </Link>
          </li>
        </ul>
      </Toolbar>
    </header>
  );
}

export default Header;

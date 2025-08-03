import { Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../common/Language Switch/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
            <LanguageSwitcher />
          </li>
          <li>
            <Link to="/login">{t("common.login")}</Link>
          </li>
          <li>
            <button
              className="signup-button"
              type="button"
              onClick={() => void navigate("/signup")}
            >
              {t("common.signup")}
            </button>
          </li>
        </ul>
      </Toolbar>
    </header>
  );
}

export default Header;

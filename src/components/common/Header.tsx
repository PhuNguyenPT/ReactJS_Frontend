import { Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../common/Language Switch/LanguageSwitcher";
import { useTranslation } from "react-i18next";

function Header() {
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
            <Link to="/signup">
              <button className="signup-button" type="button">
                {t("common.signup")}
              </button>
            </Link>
          </li>
        </ul>
      </Toolbar>
    </header>
  );
}

export default Header;

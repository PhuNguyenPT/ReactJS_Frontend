import { Toolbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LanguageSwitcher from "../Language Switch/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import useAuth from "../../../hooks/useAuth";
import AccountMenu from "./AccountMenu";

function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated, displayName } = useAuth();

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

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/history">{t("header.viewHistory")}</Link>
              </li>
              <li className="username-section">
                {displayName}
                <AccountMenu displayName={displayName} />
              </li>
            </>
          ) : (
            <>
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
            </>
          )}
        </ul>
      </Toolbar>
    </header>
  );
}

export default Header;

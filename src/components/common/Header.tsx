import { Toolbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LanguageSwitcher from "../common/Language Switch/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
import { AuthProvider } from "../../contexts/auth/AuthProvider";

function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { isAuthenticated, displayName } = useAuth();

  return (
    <AuthProvider>
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
                  <div className="profile-circle"></div>
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
    </AuthProvider>
  );
}

export default Header;

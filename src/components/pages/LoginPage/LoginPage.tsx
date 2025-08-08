import usePageTitle from "../../../hooks/usePageTitle";
import LoginForm from "./LoginForm";
import { useTranslation } from "react-i18next";
import { AuthProvider } from "../../../contexts/auth/AuthProvider";

export default function LoginPage() {
  usePageTitle("Unizy | Login");
  const { t } = useTranslation();

  return (
    <AuthProvider>
      <div className="background" />
      <div className="signup-container">
        <div className="signup-card">
          <h1 className="title">{t("loginForm.tilte")}</h1>
          <p className="subtitle">{t("loginForm.subTilte")}</p>
          <LoginForm />
        </div>
      </div>
    </AuthProvider>
  );
}

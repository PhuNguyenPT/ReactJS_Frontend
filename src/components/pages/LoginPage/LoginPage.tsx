import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import LoginForm from "./LoginForm";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  usePageTitle("Unizy | Login");
  const { t } = useTranslation();

  return (
    <>
      <div className="background" />
      <div className="signup-container">
        <div className="signup-card">
          <h1 className="title">{t("loginForm.tilte")}</h1>
          <p className="subtitle">{t("loginForm.subTilte")}</p>
          <LoginForm />
        </div>
      </div>
    </>
  );
}

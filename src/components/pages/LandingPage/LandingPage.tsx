import { useNavigate } from "react-router-dom";
import usePageTitle from "../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";
import { AuthProvider } from "../../../contexts/auth/AuthProvider";

export default function LandingPage() {
  usePageTitle("Unizy | Home");
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <AuthProvider>
      <div className="background" />
      <main className="content">
        <h1>
          <span className="highlight">{t("contents.highlight")}</span>{" "}
          {t("contents.tilte1")}
          <br />
          {t("contents.tilte2")}
        </h1>
        <button
          className="start-button"
          type="button"
          onClick={() => void navigate("/firstForm")}
        >
          {t("buttons.start")}
        </button>
      </main>
    </AuthProvider>
  );
}

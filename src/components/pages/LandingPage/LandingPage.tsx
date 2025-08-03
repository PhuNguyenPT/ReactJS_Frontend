import { useNavigate } from "react-router-dom";
import usePageTitle from "../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";

export default function LandingPage() {
  usePageTitle("Unizy | Home");
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <div className="background" />
      <main className="content">
        <h1>
          <span className="highlight">GUIDING</span> YOU TO
          <br />
          YOUR DREAM UNIVERSITY
        </h1>
        <button
          className="start-button"
          type="button"
          onClick={() => void navigate("/firstForm")}
        >
          {t("buttons.start")}
        </button>
      </main>
    </>
  );
}

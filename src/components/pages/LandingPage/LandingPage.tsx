import { useNavigate } from "react-router-dom";
import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useTranslation } from "react-i18next";

export default function LandingPage() {
  usePageTitle("Unizy | Home");
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <div className="background" />
      <main className="content">
        <div className="landing-title-container">
          <img
            src="/assets/images/landing-title.png"
            alt="Hướng bạn tới trường đại học mơ ước"
            className="landing-title-img"
          />
        </div>
        <button
          className="start-button"
          type="button"
          onClick={() => void navigate("/firstForm")}
        >
          {t("contents.start")}
        </button>
      </main>
    </>
  );
}

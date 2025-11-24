import { useNavigate } from "react-router-dom";
import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useTranslation } from "react-i18next";

export default function LandingPage() {
  usePageTitle("Unizy | Home");
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Determine which image to use based on current language
  const landingTitleImage =
    i18n.language === "en"
      ? "/assets/images/landing-title-en.png"
      : "/assets/images/landing-title.png";

  // Alternative for alt text translation
  const altText =
    i18n.language === "en"
      ? "Guide you to your dream university"
      : "Hướng bạn tới trường đại học mơ ước";

  return (
    <>
      <div className="background" />
      <main className="content">
        <div className="landing-title-container">
          <img
            src={landingTitleImage}
            alt={altText}
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

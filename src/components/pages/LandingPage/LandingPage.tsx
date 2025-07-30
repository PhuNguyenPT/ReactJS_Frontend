import { Link } from "react-router-dom";
import usePageTitle from "../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";

export default function LandingPage() {
  usePageTitle("UniGuide | Home");
  const { t } = useTranslation();
  return (
    <>
      <div className="background" />
      <main className="content">
        <h1>
          <span className="highlight">GUIDING</span> YOU TO
          <br />
          YOUR DREAM UNIVERSITY
        </h1>
        <Link to="/firstForm">
          <button className="start-button" type="button">
            {t("buttons.start")}
          </button>
        </Link>
      </main>
    </>
  );
}

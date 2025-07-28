import { Link } from "react-router-dom";
import usePageTitle from "../../../hooks/usePageTitle";

export default function LandingPage() {
  usePageTitle("UniGuide | Home");
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
            Start
          </button>
        </Link>
      </main>
    </>
  );
}

import { Link } from "react-router-dom";

export default function LandingSection() {
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

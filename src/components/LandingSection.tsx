import { useState } from "react";

export default function LandingSection() {
  const [count, setCount] = useState(0);

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
          type="button"
          className="start-button"
          onClick={() => {
            setCount((count) => count + 1);
          }}
        >
          Count is {count}
        </button>
      </main>
    </>
  );
}

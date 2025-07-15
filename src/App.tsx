import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="landing-container">
      <div className="stars" />
      <div className="content">
        <h1>
          <span className="highlight">GUIDING</span> YOU TO
          <br />
          YOUR <span className="dream">DREAM</span> UNIVERSITY
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
      </div>
    </div>
  );
}

export default App;

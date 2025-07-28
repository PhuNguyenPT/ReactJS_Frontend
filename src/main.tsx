import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Signup from "./pages/Signup.tsx";
import "./assets/fonts.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>,
  );
} else {
  throw new Error("Root element with id 'root' not found.");
}

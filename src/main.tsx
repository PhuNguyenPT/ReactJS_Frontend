import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Signup from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/LoginPage";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<App />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>,
  );
} else {
  throw new Error("Root element with id 'root' not found.");
}

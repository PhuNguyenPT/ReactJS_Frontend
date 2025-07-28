import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/index.css";
import "./styles/App.css";
import "./assets/fonts.css";

import "./styles/index.css";
import "./styles/App.css";

import App from "./App";
import Signup from "./components/pages/SignupPage/SignupPage";
import Login from "./components/pages/LoginPage/LoginPage";
import LandingPage from "./components/pages/LandingPage/LandingPage";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>,
  );
} else {
  throw new Error("Root element with id 'root' not found.");
}

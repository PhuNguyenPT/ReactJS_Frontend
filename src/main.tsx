import { Suspense, StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/index.css";
import "./styles/App.css";
import "./assets/fonts/fonts.css";
import "./i18n";

import LoadingComponent from "./components/common/Language Switch/LoadingComponent";
import { AuthProvider } from "./contexts/auth/AuthProvider"; // Add this import

import App from "./App";
const Signup = lazy(() => import("./components/pages/SignupPage/SignupPage"));
const Login = lazy(() => import("./components/pages/LoginPage/LoginPage"));
import LandingPage from "./components/pages/LandingPage/LandingPage";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        {" "}
        {/* Move AuthProvider here */}
        <Suspense fallback={<LoadingComponent />}>
          <BrowserRouter>
            <Routes>
              <Route element={<App />}>
                <Route index element={<LandingPage />} />
                <Route path="signup" element={<Signup />} />
                <Route path="login" element={<Login />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Suspense>
      </AuthProvider>
    </StrictMode>,
  );
}

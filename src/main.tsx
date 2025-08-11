import { Suspense, StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/index.css";
import "./styles/App.css";
import "./assets/fonts/fonts.css";
import "./i18n";

import LoadingComponent from "./components/common/Language Switch/LoadingComponent";
import { AuthProvider } from "./contexts/auth/AuthProvider";

import App from "./App";
import LandingPage from "./components/pages/LandingPage/LandingPage";
const Signup = lazy(() => import("./components/pages/SignupPage/SignupPage"));
const Login = lazy(() => import("./components/pages/LoginPage/LoginPage"));
const FirstFormPage = lazy(
  () => import("./components/pages/FirstFormPage/FirstFormPage"),
);
const SecondFormPage = lazy(
  () => import("./components/pages/SecondFormPage/SecondFormPage"),
);
const ThirdFormPage = lazy(
  () => import("./components/pages/ThirdFormPage/ThirdFormPage"),
);
const FourthFormPage = lazy(
  () => import("./components/pages/FourthFormPage/FouthFormPage"),
);

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        {" "}
        <Suspense fallback={<LoadingComponent />}>
          <BrowserRouter>
            <Routes>
              <Route element={<App />}>
                <Route index element={<LandingPage />} />
                <Route path="signup" element={<Signup />} />
                <Route path="login" element={<Login />} />
                <Route path="firstForm" element={<FirstFormPage />} />
                <Route path="secondForm" element={<SecondFormPage />} />
                <Route path="thirdForm" element={<ThirdFormPage />} />
                <Route path="fourthForm" element={<FourthFormPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Suspense>
      </AuthProvider>
    </StrictMode>,
  );
}

import { Suspense, StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/index.css";
import "./styles/App.css";
import "./assets/fonts/fonts.css";
import "./i18n";
import "reflect-metadata";

import LoadingComponent from "./components/common/Language Switch/LoadingComponent";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import { FormDataProvider } from "./contexts/FormDataContext/FormDataProvider";

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
const FifthFormPage = lazy(
  () => import("./components/pages/FifthFormPage/FifthFormPage"),
);
const SixthFormPage = lazy(
  () => import("./components/pages/SixthFormPage/SixthFormPage"),
);
const SeventhFormPage = lazy(
  () => import("./components/pages/SeventhFormPage/SeventhFormPage"),
);
const EighthFormPage = lazy(
  () => import("./components/pages/EighthFormPage/EighthFormPage"),
);
const NinthFormPage = lazy(
  () => import("./components/pages/NinthFormPage/NinthFormPage"),
);

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <FormDataProvider>
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
                  <Route path="fifthForm" element={<FifthFormPage />} />
                  <Route path="sixthForm" element={<SixthFormPage />} />
                  <Route path="seventhForm" element={<SeventhFormPage />} />
                  <Route path="eighthForm" element={<EighthFormPage />} />
                  <Route path="ninthForm" element={<NinthFormPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </Suspense>
        </FormDataProvider>
      </AuthProvider>
    </StrictMode>,
  );
}

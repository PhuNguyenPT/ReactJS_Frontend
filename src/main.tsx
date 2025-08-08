import { Suspense, StrictMode, lazy } from "react";
import { Suspense, StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/index.css";
import "./styles/App.css";
import "./assets/fonts/fonts.css";
import "./i18n";

import LoadingComponent from "./components/common/Language Switch/LoadingComponent";

// Lazy load your components
const App = lazy(() => import("./App"));
const Signup = lazy(() => import("./components/pages/SignupPage/SignupPage"));
const Login = lazy(() => import("./components/pages/LoginPage/LoginPage"));
const LandingPage = lazy(
  () => import("./components/pages/LandingPage/LandingPage"),
);
const FirstFormPage = lazy(
  () => import("./components/pages/FirstForm/FirstFormPage"),
);

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Suspense fallback={<LoadingComponent />}>
        <BrowserRouter>
          <Routes>
            <Route element={<App />}>
              <Route
                path="/"
                element={
                  <Suspense fallback={<LoadingComponent />}>
                    <LandingPage />
                  </Suspense>
                }
              />
              <Route
                path="/signup"
                element={
                  <Suspense fallback={<LoadingComponent />}>
                    <Signup />
                  </Suspense>
                }
              />
              <Route
                path="/login"
                element={
                  <Suspense fallback={<LoadingComponent />}>
                    <Login />
                  </Suspense>
                }
              />
              <Route
                path="/firstForm"
                element={
                  <Suspense fallback={<LoadingComponent />}>
                    <FirstFormPage />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </StrictMode>,
  );
}

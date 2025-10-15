import { Suspense, StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Styles
import "./styles/index.css";
import "./styles/App.css";
import "./assets/fonts/fonts.css";

// i18n and reflection
import "./i18n";
import "reflect-metadata";

// Contexts
import { AuthProvider } from "./contexts/auth/AuthProvider";
import { FormDataProvider } from "./contexts/FormData/FormDataProvider";
import { FileDataProvider } from "./contexts/FileData/FileDataProvider";
import { NinthFormProvider } from "./contexts/ScoreBoardData/scoreBoardContext";

// Components
import LoadingComponent from "./components/common/Language Switch/LoadingComponent";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary";
import App from "./App";
import LandingPage from "./components/pages/LandingPage/LandingPage";

// Lazy-loaded pages
const Signup = lazy(() => import("./components/pages/SignupPage/SignupPage"));
const Login = lazy(() => import("./components/pages/LoginPage/LoginPage"));
const HistoryPage = lazy(
  () => import("./components/pages/ViewHistoryPage/HistoryPage"),
);
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
const ResultPage = lazy(
  () => import("./components/pages/ResultPage/ResultPage"),
);

// Initialize and render the application
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Failed to find the root element. Ensure your HTML has a <div id='root'></div>",
  );
}

console.log("[Main] Starting application...");

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <FormDataProvider>
          <FileDataProvider>
            <NinthFormProvider>
              <Suspense fallback={<LoadingComponent />}>
                <BrowserRouter>
                  <Routes>
                    <Route element={<App />}>
                      <Route index element={<LandingPage />} />
                      <Route path="signup" element={<Signup />} />
                      <Route path="login" element={<Login />} />
                      <Route path="History" element={<HistoryPage />} />
                      <Route path="firstForm" element={<FirstFormPage />} />
                      <Route path="secondForm" element={<SecondFormPage />} />
                      <Route path="thirdForm" element={<ThirdFormPage />} />
                      <Route path="fourthForm" element={<FourthFormPage />} />
                      <Route path="fifthForm" element={<FifthFormPage />} />
                      <Route path="sixthForm" element={<SixthFormPage />} />
                      <Route path="seventhForm" element={<SeventhFormPage />} />
                      <Route path="eighthForm" element={<EighthFormPage />} />
                      <Route path="ninthForm" element={<NinthFormPage />} />
                      <Route path="result" element={<ResultPage />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </Suspense>
            </NinthFormProvider>
          </FileDataProvider>
        </FormDataProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

void i18n
  // Load translation files from public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Fallback language
    fallbackLng: "en",

    // Supported languages
    supportedLngs: ["en", "vi"],

    // Debug mode (set to false in production)
    debug: import.meta.env.DEV,

    // Detection options
    detection: {
      // Order of language detection methods
      order: ["localStorage", "navigator", "htmlTag"],

      // Cache user language
      caches: ["localStorage"],

      // Keys to store language in localStorage
      lookupLocalStorage: "i18nextLng",
    },

    // Backend options
    backend: {
      // Path to load resources from
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    // Interpolation options
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },

    // Namespace options
    ns: ["translation"],
    defaultNS: "translation",

    // React options
    react: {
      // Wait for translations to be loaded before rendering
      useSuspense: true,
    },
  });

export default i18n;

import { useTranslation as useI18nTranslation } from "react-i18next";

// Import your translation files
import en from "../../../public/locales/en/translation.json";
// Optionally import vi if you need it for type checking
// import vi from "./locales/vi.json";

// Utility type to convert nested object to dot notation paths
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & string]: TObj[TKey] extends object
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & string];

// Auto-generate translation keys from your en.json
export type TranslationKey = RecursiveKeyOf<typeof en>;

// Custom hook with type-safe translation
export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  return {
    // Type-safe translation function
    t: (key: TranslationKey, options?: Record<string, unknown>) =>
      t(key, options),

    // Access to i18n instance
    i18n,

    // Current language
    currentLanguage: i18n.language,

    // Change language function
    changeLanguage: (lng: string) => i18n.changeLanguage(lng),

    // Check if current language is a specific one
    isLanguage: (lng: string) => i18n.language === lng,
  };
};

// Optional: Export a typed version of the translation function for direct use
export const t = (key: TranslationKey) => {
  return key; // This is just for type checking, actual implementation comes from i18next
};

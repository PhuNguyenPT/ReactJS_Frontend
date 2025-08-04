import { useTranslation as useI18nTranslation } from "react-i18next";

// Type definitions for your translation keys
export type TranslationKey =
  | "common.welcome"
  | "common.home"
  | "common.about"
  | "common.contact"
  | "common.login"
  | "common.logout"
  | "common.submit"
  | "common.cancel"
  | "common.save"
  | "common.edit"
  | "common.delete"
  | "common.search"
  | "common.loading"
  | "common.error"
  | "common.success"
  | "navigation.dashboard"
  | "navigation.profile"
  | "navigation.settings"
  | "forms.email"
  | "forms.password"
  | "forms.confirmPassword"
  | "forms.firstName"
  | "forms.lastName"
  | "forms.phone"
  | "messages.welcomeBack"
  | "messages.pleaseLogin"
  | "messages.invalidCredentials"
  | "messages.accountCreated"
  | "contents.hightlight";

// Custom hook with type-safe t
export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  return {
    t: (key: TranslationKey, options?: Record<string, unknown>) =>
      t(key, options),
    i18n,
    currentLanguage: i18n.language,
    changeLanguage: (lng: string) => i18n.changeLanguage(lng),
  };
};

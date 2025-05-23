import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import translationEn from "./i18n/locales/en/translation.js";
import translationFR from "./i18n/locales/fr/translation.js";

const resources = {
  en: { translation: translationEn },
  fr: { translation: translationFR },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    fallbackLng: "fr",
    interpolation: { escapeValue: false },
  });

export default i18n;
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./en.json";
import plTranslations from "./pl.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    pl: { translation: plTranslations },
  },
  fallbackLng: "pl",
  lng: "pl",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },

    // Langue par défaut
    lng: localStorage.getItem("lang") || "en",

    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // React protège déjà du XSS
    },
  });

// Persister la langue
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
});

export default i18n;

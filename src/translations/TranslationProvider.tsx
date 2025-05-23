import { useState, ReactNode, useCallback, useEffect } from "react";
import { TranslationContext } from "./translation-context";
import { useTranslation } from "react-i18next";
import "./i18n";

export default function TranslationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [lng, setLng] = useState<"pl" | "en">("en");
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(
    (newLng: "pl" | "en") => {
      localStorage.setItem("language", newLng);
      i18n.changeLanguage(newLng);
      setLng(newLng);
    },
    [setLng, i18n],
  );

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      changeLanguage(savedLanguage as "pl" | "en");
    }
  }, [changeLanguage]);

  return (
    <TranslationContext.Provider
      value={{
        lng,
        changeLanguage,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

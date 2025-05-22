import { createContext } from "react";

export const TranslationContext = createContext<{
  lng: "pl" | "en";
  changeLanguage: (lng: "pl" | "en") => void;
}>({
  lng: "en",
  changeLanguage: () => {},
});

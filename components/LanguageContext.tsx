"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export type Language = "en" | "ar";

export interface LanguageContextType {
  lang: Language;
  dir: "ltr" | "rtl";
  t: (key: string, replacements?: Record<string, string | number>) => string;
  setLanguage: (lang: Language) => void;
}

const translations: Record<Language, Record<string, unknown>> = { en, ar };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  // Read language from localStorage or default to browser language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("preferred_lang") as Language;
    if (savedLang === "en" || savedLang === "ar") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLang(savedLang);
    } else {
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "ar") {
        setLang("ar");
      }
    }
  }, []);

  // Update dir and lang attributes on the html tag whenever language changes
  useEffect(() => {
    localStorage.setItem("preferred_lang", lang);
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  // Translate function with support for nested keys (e.g., 'navbar.home')
  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let value: unknown = translations[lang];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        // Fallback to English if key not found in the current language
        let engValue: unknown = translations["en"];
        for (const ek of keys) {
          if (engValue && typeof engValue === "object" && ek in engValue) {
            engValue = (engValue as Record<string, unknown>)[ek];
          } else {
            engValue = key;
            break;
          }
        }
        return engValue as string;
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    // Replace placeholders (e.g., {{year}} -> 2026)
    if (replacements) {
      let result = value;
      Object.entries(replacements).forEach(([k, v]) => {
        result = result.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), String(v));
      });
      return result;
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

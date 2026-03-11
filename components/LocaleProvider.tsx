"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMessages, type SupportedLocale } from "@/lib/i18n";
import type { Messages } from "@/locales/types";

interface LocaleContextValue {
  locale: SupportedLocale;
  messages: Messages;
  setLocale: (locale: SupportedLocale) => void;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const STORAGE_KEY = "nutrigoal-locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>("es");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as
      | SupportedLocale
      | null;
    if (stored) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (next: SupportedLocale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  const messages = useMemo(() => getMessages(locale), [locale]);

  const value: LocaleContextValue = {
    locale,
    messages,
    setLocale,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}


import { es } from "@/locales/es";
import { en } from "@/locales/en";
import { fr } from "@/locales/fr";
import { it } from "@/locales/it";
import { de } from "@/locales/de";
import { pt } from "@/locales/pt";
import type { Messages } from "@/locales/types";

export type SupportedLocale = "es" | "en" | "fr" | "it" | "de" | "pt";

const allMessages: Record<SupportedLocale, Messages> = {
  es,
  en,
  fr,
  it,
  de,
  pt,
};

const DEFAULT_LOCALE: SupportedLocale = "es";

export function getMessages(locale: SupportedLocale = DEFAULT_LOCALE): Messages {
  return allMessages[locale] ?? allMessages[DEFAULT_LOCALE];
}


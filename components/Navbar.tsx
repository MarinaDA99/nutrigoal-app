"use client";

import Image from "next/image";
import { useLocale } from "@/components/LocaleProvider";
import type { SupportedLocale } from "@/lib/i18n";

const LOCALE_LABELS: Record<SupportedLocale, string> = {
  es: "ES Español",
  en: "EN English",
  fr: "FR Français",
  it: "IT Italiano",
  de: "DE Deutsch",
  pt: "PT Português",
};

export function Navbar() {
  const { locale, setLocale, messages } = useLocale();

  return (
    <nav className="flex items-center justify-between border-b border-emerald-50 bg-[var(--background)]/80 px-4 py-3 backdrop-blur sm:px-8">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative h-7 w-7 sm:h-8 sm:w-8">
          <Image
            src="/logo.png"
            alt="NutriGoal logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-sm font-semibold text-emerald-900 sm:text-base">
          NutriGoal
        </span>
        <div className="ml-4 hidden items-center gap-4 text-xs font-medium text-slate-600 sm:flex">
          <button type="button" className="text-emerald-900">
            {messages.navHome}
          </button>
          <button type="button" className="opacity-60">
            {messages.navHistory}
          </button>
          <button type="button" className="opacity-60">
            {messages.navAchievements}
          </button>
          <button type="button" className="opacity-60">
            {messages.navProfile}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-slate-500 sm:inline">
          {messages.navLanguage}
        </span>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as SupportedLocale)}
          className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-medium text-emerald-900 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        >
          {Object.entries(LOCALE_LABELS).map(([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}


"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLocale } from "@/components/LocaleProvider";
import type { SupportedLocale } from "@/lib/i18n";
import { supabase } from "@/lib/supabaseClient";

const LOCALE_LABELS: Record<SupportedLocale, string> = {
  es: "ES",
  en: "EN",
  fr: "FR",
  it: "IT",
  de: "DE",
  pt: "PT",
};

export default function ProfilePage() {
  const { messages, locale, setLocale } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dailyGoal, setDailyGoal] = useState(5);

  // Load and persist simple profile data locally (no business logic changes)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("nutrigoal-profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          name?: string;
          email?: string;
          dailyGoal?: number;
        };
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.dailyGoal) setDailyGoal(parsed.dailyGoal);
      } catch {
        // ignore
      }
    }
  }, []);

  const saveProfile = (next: {
    name?: string;
    email?: string;
    dailyGoal?: number;
  }) => {
    if (typeof window === "undefined") return;
    const current = (() => {
      try {
        const raw = window.localStorage.getItem("nutrigoal-profile");
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    })();
    const merged = { ...current, ...next };
    window.localStorage.setItem("nutrigoal-profile", JSON.stringify(merged));
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <AppShell>
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col gap-6 px-6 py-6 pb-[110px]">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#2d5a27]">
              {messages.navProfile}
            </h1>
            <p className="mt-1 text-[14px] text-[#555]">
              Ajusta tu perfil y objetivos diarios.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px]">
            <span className="text-slate-600">{messages.navLanguage}</span>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as SupportedLocale)}
              className="bg-transparent text-[12px] outline-none"
            >
              {Object.entries(LOCALE_LABELS).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-[13px] font-medium text-[#2d5a27]">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                saveProfile({ name: e.target.value });
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[14px] outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[13px] font-medium text-[#2d5a27]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                saveProfile({ email: e.target.value });
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[14px] outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[13px] font-medium text-[#2d5a27]">
              Objetivo diario (plantas)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={dailyGoal}
              onChange={(e) => {
                const next = Number(e.target.value) || 1;
                setDailyGoal(next);
                saveProfile({ dailyGoal: next });
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[14px] outline-none"
            />
          </div>
        </section>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-full bg-[#2d5a27] px-4 py-3 text-[14px] font-semibold text-white shadow-md"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </AppShell>
  );
}


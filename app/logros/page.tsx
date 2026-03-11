"use client";

import { AppShell } from "@/components/AppShell";
import { useLocale } from "@/components/LocaleProvider";

const BADGES = [
  { id: "first-10", label: "First 10 plants", achieved: true },
  { id: "probiotic-master", label: "Probiotic Master", achieved: false },
  { id: "streak-7", label: "7-day Streak", achieved: false },
];

export default function AchievementsPage() {
  const { messages } = useLocale();

  return (
    <AppShell>
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col gap-6 px-6 py-6 pb-[110px]">
        <header className="text-center">
          <h1 className="text-[28px] font-bold text-[#2d5a27]">
            {messages.navAchievements}
          </h1>
          <p className="mt-2 text-[14px] text-[#555]">
            Tus logros y medallas de diversidad.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-4 pt-2">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className={`flex h-24 flex-col items-center justify-center rounded-2xl border text-center text-[13px] font-medium ${
                badge.achieved
                  ? "border-[#7cb342] bg-[#e8f5e9] text-[#2d5a27]"
                  : "border-slate-200 bg-slate-50 text-slate-500"
              }`}
            >
              <span className="mb-1 text-xl">
                {badge.achieved ? "🌟" : "🔒"}
              </span>
              <span>{badge.label}</span>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}


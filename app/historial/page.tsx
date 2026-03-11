"use client";

import { AppShell } from "@/components/AppShell";
import { useLocale } from "@/components/LocaleProvider";

const MOCK_HISTORY = [
  { date: "12 de Octubre", plants: 8 },
  { date: "11 de Octubre", plants: 6 },
  { date: "10 de Octubre", plants: 4 },
];

export default function HistoryPage() {
  const { messages } = useLocale();

  return (
    <AppShell>
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col gap-6 px-6 py-6 pb-[110px]">
        <header className="text-center">
          <h1 className="text-[28px] font-bold text-[#2d5a27]">
            {messages.navHistory}
          </h1>
          <p className="mt-2 text-[14px] text-[#555]">
            Historial de tu consumo de plantas.
          </p>
        </header>

        <section className="mt-2 space-y-3">
          {MOCK_HISTORY.map((item) => (
            <div
              key={item.date}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"
            >
              <span className="text-[15px] font-medium text-[#2d5a27]">
                {item.date}
              </span>
              <span className="text-[14px] text-[#333]">
                {item.plants}/30 plantas
              </span>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}


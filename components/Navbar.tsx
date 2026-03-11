"use client";

import Image from "next/image";
import { useLocale } from "@/components/LocaleProvider";
import type { SupportedLocale } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import Link from "next/link";

const LOCALE_LABELS: Record<SupportedLocale, string> = {
  es: "ES",
  en: "EN",
  fr: "FR",
  it: "IT",
  de: "DE",
  pt: "PT",
};

export function Navbar() {
  const { locale, setLocale, messages } = useLocale();
  const pathname = usePathname();

  const navItems = [
    { label: messages.navHome, icon: "🏠", path: "/dashboard" },
    { label: messages.navHistory, icon: "📅", path: "/history" },
    { label: messages.navAchievements, icon: "🏆", path: "/achievements" },
    { label: messages.navProfile, icon: "👤", path: "/profile" },
  ];

  return (
    <>
      {/* --- TOP BAR (Logo e Idiomas) --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-slate-100 bg-white/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="relative h-7 w-7">
            <Image
              src="/logo.png"
              alt="NutriGoal logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-bold text-slate-800">
            NutriGoal
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as SupportedLocale)}
            className="rounded-full border border-slate-100 bg-white px-3 py-1 text-[10px] font-bold text-slate-600 shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
          >
            {Object.entries(LOCALE_LABELS).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </nav>

      {/* --- BOTTOM NAV (Navegación estilo App de las capturas) --- */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white/90 px-6 py-3 backdrop-blur-lg sm:hidden">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isActive ? "text-[#6ab04c] scale-110" : "text-slate-400 opacity-60"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[9px] font-bold uppercase tracking-tighter">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Espaciador para que el contenido no quede debajo de las barras */}
      <div className="h-14 w-full"></div> 
    </>
  );
}
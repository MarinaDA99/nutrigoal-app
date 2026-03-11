"use client";

import { useLocale } from "@/components/LocaleProvider";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Navbar() {
  const { messages } = useLocale();
  const pathname = usePathname();

  const navItems = [
    { label: messages.navHome, icon: "🏠", path: "/dashboard" },
    { label: messages.navHistory, icon: "📅", path: "/historial" },
    { label: messages.navAchievements, icon: "🏆", path: "/logros" },
    { label: messages.navProfile, icon: "👤", path: "/perfil" },
  ];

  return (
    <>
      {/* --- BOTTOM NAV (mobile app style) --- */}
      <nav className="fixed bottom-0 left-1/2 z-50 h-[70px] w-full max-w-[480px] -translate-x-1/2 bg-white shadow-lg">
        <div className="mx-auto flex h-full w-full items-center justify-between px-10">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className="flex flex-col items-center justify-center gap-1"
              >
                <span
                  className={`text-2xl ${
                    isActive ? "text-[#7cb342]" : "text-[#777]"
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-[12px] font-medium ${
                    isActive ? "text-[#7cb342]" : "text-[#777]"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Espaciador para que el contenido no quede debajo de las barras */}
      <div className="h-[70px] w-full" />
    </>
  );
}
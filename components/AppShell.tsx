"use client";

import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-slate-900">
      <Navbar />
      <main className="flex-1 px-3 py-4 sm:px-0 sm:py-8">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}


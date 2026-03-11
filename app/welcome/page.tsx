"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useLocale } from "@/components/LocaleProvider";

export default function WelcomePage() {
  const { messages } = useLocale();
  const router = useRouter();

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-[0_18px_60px_rgba(15,63,32,0.12)] sm:p-10">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold leading-snug text-emerald-900 sm:text-3xl">
            {messages.welcomeHeadline}
          </h1>
          <h2 className="text-lg font-semibold text-emerald-800">
            {messages.welcomeSubheadline}
          </h2>
          <p className="text-sm leading-relaxed text-slate-700">
            {messages.welcomeBody}
          </p>
        </div>
        <div className="mt-6 space-y-3 rounded-2xl bg-emerald-50 p-4">
          <h3 className="text-sm font-semibold text-emerald-900">
            {messages.welcomeHowItWorksTitle}
          </h3>
          <p className="text-sm leading-relaxed text-slate-700">
            {messages.welcomeHowItWorksBody}
          </p>
        </div>
        <div className="mt-6 flex justify-start">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
          >
            {messages.welcomeStartButton}
          </button>
        </div>
      </div>
    </AppShell>
  );
}


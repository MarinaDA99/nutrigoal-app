"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useLocale } from "@/components/LocaleProvider";
import { AppShell } from "@/components/AppShell";

export default function AuthPage() {
  const { messages } = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!supabase) {
      router.push("/welcome");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
      }
      router.push("/welcome");
    } catch {
      setError(messages.authError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto flex max-w-md flex-col gap-6 rounded-3xl bg-white p-6 shadow-[0_18px_60px_rgba(15,63,32,0.12)] sm:p-8">
        <div>
          <h1 className="text-xl font-semibold text-emerald-900">
            {messages.authTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {messages.authSubtitle}
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              {messages.authEmail}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-emerald-100 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              {messages.authPassword}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-emerald-100 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          {error && (
            <p className="text-xs text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {mode === "login" ? messages.authLogin : messages.authRegister}
          </button>
        </form>
        <div className="flex items-center justify-between text-xs text-slate-600">
          {mode === "login" ? (
            <>
              <span>{messages.authNoAccount}</span>
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-semibold text-emerald-800"
              >
                {messages.authRegister}
              </button>
            </>
          ) : (
            <>
              <span>{messages.authHaveAccount}</span>
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-semibold text-emerald-800"
              >
                {messages.authLogin}
              </button>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}


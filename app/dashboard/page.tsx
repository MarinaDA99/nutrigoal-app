"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  FOODS,
  FoodItem,
  PlantCategory,
  normalizeFoodName,
  synonymsMap,
  getFoodLabel,
} from "@/lib/food-database";
import { supabase } from "@/lib/supabaseClient";
import { useLocale } from "@/components/LocaleProvider";
import { AppShell } from "@/components/AppShell";
import type { User } from "@supabase/supabase-js";

const WEEKLY_GOAL = 30;
const PREBIOTICS_GOAL = 5;
const PROBIOTICS_GOAL = 3;

type CategoryFilter = PlantCategory | "all";

interface PlantLogPayload {
  user_id: string;
  food_id: string;
  canonical_name: string;
}

function useWeeklyPlants() {
  const [plantIds, setPlantIds] = useState<string[]>([]);

  // Usamos useEffect para hidratar desde el cliente sin romper el SSR
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("nutrigoal-week");
      if (stored) {
        const parsed = JSON.parse(stored) as { weekKey: string; plantIds: string[] };
        if (parsed.plantIds) {
          setPlantIds(parsed.plantIds);
        }
      }
    } catch {
      // ignorar errores de parseo
    }
  }, []);

  const addPlant = (id: string) => {
    setPlantIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id].slice(0, WEEKLY_GOAL);
      if (typeof window !== "undefined") {
        const existing = window.localStorage.getItem("nutrigoal-week");
        let weekKey = "";
        try {
          if (existing) {
            weekKey = (JSON.parse(existing) as { weekKey?: string }).weekKey ?? "";
          }
        } catch {
          // ignore
        }
        window.localStorage.setItem(
          "nutrigoal-week",
          JSON.stringify({ weekKey, plantIds: next }),
        );
      }
      return next;
    });
  };

  return { plantIds, addPlant };
}

function DonutProgress({ count }: { count: number }) {
  const data = [
    { name: "completed", value: Math.min(count, WEEKLY_GOAL) },
    { name: "remaining", value: Math.max(WEEKLY_GOAL - count, 0) },
  ];

  const COLORS = ["#bbf7d0", "#14532d"];

  return (
    <div className="relative h-32 w-32 sm:h-40 sm:w-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius="75%"
            outerRadius="100%"
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? COLORS[0] : COLORS[1]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs font-medium text-emerald-100">
          {Math.min(count, WEEKLY_GOAL)} / {WEEKLY_GOAL}
        </span>
        <span className="mt-1 text-[11px] text-emerald-50">
          30 plantas
        </span>
      </div>
    </div>
  );
}

function SmartSearch({
  value,
  onChange,
  onSelect,
  placeholder,
  locale,
}: {
  value: string;
  onChange: (value: string) => void;
  onSelect: (food: FoodItem) => void;
  placeholder: string;
  locale: import("@/lib/i18n").SupportedLocale;
}) {
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(() => {
    const q = value.trim();
    if (!q) return [];
    const normalized = normalizeFoodName(q);
    const canonical = synonymsMap[normalized] ?? normalized;

    return FOODS.filter((food) => {
      const nameNorm = normalizeFoodName(food.name);
      if (nameNorm.includes(canonical)) return true;
      if (nameNorm.includes(normalized)) return true;
      return false;
    }).slice(0, 8);
  }, [value]);

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setTimeout(() => setIsFocused(false), 120);
        }}
        placeholder={placeholder}
        className="w-full rounded-full border border-emerald-100 bg-white px-4 py-3 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
      />
      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-2xl border border-slate-100 bg-white/95 shadow-lg backdrop-blur">
          {suggestions.map((food) => (
            <button
              key={food.id}
              type="button"
              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-emerald-50"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onSelect(food);
              }}
            >
              <span className="text-lg">{food.emoji}</span>
              <span className="font-medium text-slate-800">
                {getFoodLabel(food, locale)}
              </span>
              <span className="ml-auto text-[11px] uppercase tracking-wide text-emerald-600">
                {food.category}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Suggestions({
  eatenIds,
  onSelect,
  title,
  locale,
}: {
  eatenIds: string[];
  onSelect: (food: FoodItem) => void;
  title: string;
  locale: import("@/lib/i18n").SupportedLocale;
}) {
  const [filter, setFilter] = useState<CategoryFilter>("all");

  const availableFoods = useMemo(
    () => FOODS.filter((f) => !eatenIds.includes(f.id)),
    [eatenIds],
  );

  const filtered = useMemo(() => {
    const base =
      filter === "all"
        ? availableFoods
        : availableFoods.filter((f) => f.category === filter);
    const shuffled = [...base].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  }, [availableFoods, filter]);

  const categories: { key: CategoryFilter; label: string }[] = [
    { key: "all", label: "Todas" },
    { key: "vegetable", label: "🥦 Verduras" },
    { key: "fruit", label: "🍎 Frutas" },
    { key: "nut", label: "🌰 Frutos secos" },
    { key: "legume", label: "🫘 Legumbres" },
    { key: "grain", label: "🌾 Cereales" },
    { key: "fungi", label: "🍄 Hongos" },
    { key: "herb", label: "🌿 Hierbas" },
  ];

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-sm font-semibold text-emerald-900">
        {title}
      </h2>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setFilter(cat.key)}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${
              filter === cat.key
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-emerald-100 bg-white text-emerald-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {filtered.map((food) => (
          <button
            key={food.id}
            type="button"
            onClick={() => onSelect(food)}
            className="flex flex-col gap-1 rounded-2xl border border-emerald-50 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{food.emoji}</span>
            </div>
            <span className="text-sm font-semibold text-slate-800">
              {getFoodLabel(food, locale)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function MetricsInfoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { messages } = useLocale();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/30 px-3 pb-8 pt-16 sm:items-center">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-xl">
        <div className="rounded-t-3xl bg-emerald-700 px-5 py-4 text-white">
          <h3 className="text-base font-semibold">
            {messages.weeklyDiversityTitle}
          </h3>
        </div>
        <div className="space-y-3 px-5 py-4 text-sm text-slate-700">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {messages.prebioticsInfoTitle}
            </p>
            <p className="mt-1 text-sm">{messages.prebioticsInfoBody}</p>
          </div>
          <div className="pt-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {messages.probioticsInfoTitle}
            </p>
            <p className="mt-1 text-sm">{messages.probioticsInfoBody}</p>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { messages, locale } = useLocale();
  const { plantIds, addPlant } = useWeeklyPlants();
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"info" | "error">("info");
  const [isSaving, setIsSaving] = useState(false);
  const [metricsOpen, setMetricsOpen] = useState(false);

  const count = plantIds.length;

  const prebioticCount = useMemo(
    () =>
      plantIds.filter((id) =>
        FOODS.find((f) => f.id === id)?.tags?.includes("prebiotic"),
      ).length,
    [plantIds],
  );
  
  const probioticCount = useMemo(
    () =>
      plantIds.filter((id) =>
        FOODS.find((f) => f.id === id)?.tags?.includes("fermented"),
      ).length,
    [plantIds],
  );

  useEffect(() => {
  if (!supabase) return;

  let active = true;

  // Obtener sesión inicial
  supabase.auth
    .getUser()
    .then(({ data: authData }: { data: any }) => { // Añadimos el tipo ": { data: any }"
  if (!active) return;
  setUser(authData.user ?? null);
})
    .catch(() => {
      if (!active) return;
      setUser(null);
    });

  // Suscripción a cambios
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
    if (!active) return;
    setUser(session?.user ?? null);
  });

  return () => {
    active = false;
    subscription.unsubscribe(); // Ahora 'subscription' sí existe
  };
}, []);


  const handleRegister = async (food: FoodItem) => {
    setFeedback(null);

    if (plantIds.includes(food.id)) {
      setFeedback(messages.alreadyCounted);
      setFeedbackType("info");
      return;
    }

    addPlant(food.id);
    setSearch("");

    if (!supabase || !user?.id) return;

    const payload: PlantLogPayload = {
      user_id: user.id,
      food_id: food.id,
      canonical_name: normalizeFoodName(food.name),
    };

    setIsSaving(true);
    try {
      const { error } = await supabase.from("plant_logs").insert(payload);
      if (error) {
          // Extraemos las propiedades específicas que Supabase suele enviar
  console.log("Error Real:", error.message || error);
  alert("Error al guardar: " + (error.message || "Problema de conexión"));

        setFeedback(messages.errorGeneric);
        setFeedbackType("error");
      }
    } catch (e) {
      console.error(e);
      setFeedback(messages.errorGeneric);
      setFeedbackType("error");
    } finally {
      setIsSaving(false);
    }
  };

  const prebioticRatio = Math.min(prebioticCount / PREBIOTICS_GOAL, 1);
  const probioticRatio = Math.min(probioticCount / PROBIOTICS_GOAL, 1);

  const displayName =
    (user?.user_metadata as { full_name?: string } | null)?.full_name ||
    user?.email ||
    "";

  return (
    <AppShell>
      <div className="flex flex-col gap-6 rounded-3xl bg-white p-5 shadow-[0_18px_60px_rgba(15,63,32,0.12)] sm:p-8">
        <header className="mb-2">
          <p className="text-xs text-emerald-700">
            {displayName ? `Hola, ${displayName}` : "Hola"}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-emerald-900 sm:text-3xl">
            Reto 30
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Come 30 plantas distintas esta semana para mejorar tu microbioma intestinal.
          </p>
        </header>

        <SmartSearch
          value={search}
          onChange={setSearch}
          onSelect={handleRegister}
          placeholder={messages.searchPlaceholder}
          locale={locale}
        />

        <section className="mt-4 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 p-4 sm:p-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">
                {messages.weeklyDiversityTitle}
              </p>
              <p className="mt-1 text-sm text-emerald-50">
                <span className="font-semibold">{count}</span>{" "}
                {messages.plantsThisWeek.toLowerCase()}
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-[auto,1fr] sm:items-center">
            <div className="flex justify-center">
              <DonutProgress count={count} />
            </div>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-emerald-50">
                  <span>{messages.prebioticsLabel}</span>
                  <span>
                    {prebioticCount}/{PREBIOTICS_GOAL}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-emerald-950/40">
                  <div
                    className="h-2 rounded-full bg-emerald-300 transition-all"
                    style={{ width: `${prebioticRatio * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-emerald-50">
                  <span>{messages.probioticsLabel}</span>
                  <span>
                    {probioticCount}/{PROBIOTICS_GOAL}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-emerald-950/40">
                  <div
                    className="h-2 rounded-full bg-emerald-300 transition-all"
                    style={{ width: `${probioticRatio * 100}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMetricsOpen(true)}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-100"
              >
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-200 text-[10px] text-emerald-900">
                  i
                </span>
                {messages.metricsInfoButton}
              </button>
            </div>
          </div>
        </section>

        <Suggestions
          eatenIds={plantIds}
          onSelect={handleRegister}
          title={messages.randomSuggestionsTitle}
          locale={locale}
        />

        {feedback && (
          <p
            className={`text-xs ${
              feedbackType === "error" ? "text-red-700" : "text-emerald-800"
            }`}
          >
            {feedback}
          </p>
        )}
        {isSaving && (
          <p className="text-[11px] text-slate-500">
            Guardando en Supabase...
          </p>
        )}
      </div>

      <MetricsInfoModal open={metricsOpen} onClose={() => setMetricsOpen(false)} />
    </AppShell>
  );
}

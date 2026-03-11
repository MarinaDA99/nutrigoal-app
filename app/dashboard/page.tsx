"use client";

import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
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

function DonutProgress({ count }: { count: number }) {
  const data = [
    { name: "completed", value: Math.min(count, WEEKLY_GOAL) },
    { name: "remaining", value: Math.max(WEEKLY_GOAL - count, 0) },
  ];

  // Colores de la captura: Verde vibrante y un gris/crema muy suave de fondo
  const COLORS = ["#6ab04c", "#f0f2da"];

  return (
    <div className="relative h-48 w-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius="82%"
            outerRadius="100%"
            startAngle={90}
            endAngle={450}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? COLORS[0] : COLORS[1]} cornerRadius={index === 0 ? 10 : 0} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold text-slate-800">
          {count}/{WEEKLY_GOAL}
        </span>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">
          Variedad
        </span>
      </div>
    </div>
  );
}

function SmartSearch({ value, onChange, onSelect, placeholder, locale }: any) {
  const [isFocused, setIsFocused] = useState(false);
  const suggestions = useMemo(() => {
    const q = value.trim();
    if (!q) return [];
    const normalized = normalizeFoodName(q);
    const canonical = synonymsMap[normalized] ?? normalized;
    return FOODS.filter((food) => {
      const nameNorm = normalizeFoodName(food.name);
      return nameNorm.includes(canonical) || nameNorm.includes(normalized);
    }).slice(0, 5);
  }, [value]);

  return (
    <div className="relative mb-6">
      <div className="flex items-center rounded-2xl bg-white px-4 py-3 shadow-sm border border-slate-100">
        <span className="mr-2 text-slate-400">🔍</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>
      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
          {suggestions.map((food) => (
            <button
              key={food.id}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50 border-b border-slate-50 last:border-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(food)}
            >
              <span>{food.emoji}</span>
              <span className="font-medium text-slate-700">{getFoodLabel(food, locale)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { messages, locale } = useLocale();
  const [plantIds, setPlantIds] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");

  // Cargar datos locales
  useEffect(() => {
    const stored = window.localStorage.getItem("nutrigoal-week");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.plantIds) setPlantIds(parsed.plantIds);
      } catch (e) {}
    }
  }, []);

  // Auth Supabase
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }: any) => setUser(data.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleRegister = async (food: FoodItem) => {
    if (plantIds.includes(food.id)) return;
    const next = [...plantIds, food.id];
    setPlantIds(next);
    setSearch("");
    window.localStorage.setItem("nutrigoal-week", JSON.stringify({ plantIds: next }));

    if (supabase && user) {
      await supabase.from("plant_logs").insert({
        user_id: user.id,
        food_id: food.id,
        canonical_name: normalizeFoodName(food.name),
      });
    }
  };

  return (
    <AppShell>
      <div className="px-4 py-6 max-w-md mx-auto min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">NutriBioMind</h1>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Tu diversidad semanal</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-xl">👤</div>
        </header>

        {/* Anillo de Progreso Central */}
        <section className="mb-10">
          <DonutProgress count={plantIds.length} />
        </section>

        {/* Buscador */}
        <SmartSearch
          value={search}
          onChange={setSearch}
          onSelect={handleRegister}
          placeholder="Añadir una nueva planta..."
          locale={locale}
        />

        {/* Sugerencias Estilo Tags (como en la captura) */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Sugerencias</h2>
            <button className="text-xs font-bold text-primary">VER TODAS</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {FOODS.filter(f => !plantIds.includes(f.id)).slice(0, 6).map(food => (
              <button
                key={food.id}
                onClick={() => handleRegister(food)}
                className="flex items-center gap-2 rounded-full bg-white border border-slate-100 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm active:scale-95 transition-transform"
              >
                <span>{food.emoji}</span>
                {getFoodLabel(food, locale)}
              </button>
            ))}
          </div>
        </section>

        {/* Tarjetas de Beneficios (como en la captura del cerebro) */}
        <section className="mt-10 grid grid-cols-2 gap-4">
           <div className="bg-[#e8f4d1] p-4 rounded-3xl flex flex-col items-center text-center">
              <span className="text-2xl mb-2">🧠</span>
              <span className="text-[10px] font-bold text-green-900 uppercase">Salud Mental</span>
              <span className="text-xs text-green-800/70">Mejorada</span>
           </div>
           <div className="bg-[#f0f2da] p-4 rounded-3xl flex flex-col items-center text-center">
              <span className="text-2xl mb-2">🛡️</span>
              <span className="text-[10px] font-bold text-slate-700 uppercase">Inmunidad</span>
              <span className="text-xs text-slate-600/70">Protegida</span>
           </div>
        </section>
      </div>
    </AppShell>
  );
}
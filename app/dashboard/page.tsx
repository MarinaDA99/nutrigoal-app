"use client";

import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  FOODS,
  FoodItem,
  normalizeFoodName,
  synonymsMap,
  getFoodLabel,
} from "@/lib/food-database";
import { supabase } from "@/lib/supabaseClient";
import { useLocale } from "@/components/LocaleProvider";
import { AppShell } from "@/components/AppShell";
import type { User } from "@supabase/supabase-js";

const WEEKLY_GOAL = 30;

function DonutProgress({ count, messages }: { count: number; messages: any }) {
  const data = [
    { name: "completed", value: Math.min(count, WEEKLY_GOAL) },
    { name: "remaining", value: Math.max(WEEKLY_GOAL - count, 0) },
  ];

  // Colores de la captura: Verde vibrante (#6ab04c) y fondo crema suave (#f0f2da)
  const COLORS = ["#6ab04c", "#f0f2da"];

  return (
    <div className="relative h-64 w-64 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius="85%"
            outerRadius="100%"
            startAngle={90}
            endAngle={450}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
            cornerRadius={10} // Redondeado correcto aquí
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
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-6xl font-black text-slate-800 tracking-tighter">
          {count}/{WEEKLY_GOAL}
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
          {messages.weeklyDiversityTitle || "Variedad"}
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
    <div className="relative mb-10">
      <div className="flex items-center rounded-[2rem] bg-white px-6 py-5 shadow-sm border border-slate-100 transition-all focus-within:shadow-md">
        <span className="mr-3 text-xl opacity-40">🔍</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder={placeholder}
          className="w-full bg-transparent text-base outline-none placeholder:text-slate-300 font-medium"
        />
      </div>
      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
          {suggestions.map((food) => (
            <button
              key={food.id}
              className="flex w-full items-center gap-4 px-6 py-5 text-left text-sm hover:bg-slate-50 border-b border-slate-50 last:border-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(food)}
            >
              <span className="text-2xl">{food.emoji}</span>
              <span className="font-bold text-slate-700 text-base">{getFoodLabel(food, locale)}</span>
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

  useEffect(() => {
    const stored = window.localStorage.getItem("nutrigoal-week");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.plantIds) setPlantIds(parsed.plantIds);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }: any) => setUser(data.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
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
      <div className="px-8 py-10 max-w-md mx-auto min-h-screen pb-32 bg-[#fdfcf3]">
        <header className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter">NutriBioMind</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-2">
              Tu diversidad semanal
            </p>
          </div>
          <div className="h-14 w-14 rounded-[1.25rem] bg-white shadow-sm border border-slate-100 flex items-center justify-center text-2xl">👤</div>
        </header>

        {/* Gráfico de Progreso */}
        <section className="mb-14">
          <DonutProgress count={plantIds.length} messages={messages} />
        </section>

        {/* Buscador */}
        <SmartSearch
          value={search}
          onChange={setSearch}
          onSelect={handleRegister}
          placeholder={messages.searchPlaceholder || "Añadir planta..."}
          locale={locale}
        />

        {/* Sugerencias estilo Tags */}
        <section className="mb-14">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">
              Sugerencias
            </h2>
            <button className="text-[10px] font-bold text-[#6ab04c] tracking-widest uppercase">VER TODAS</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {FOODS.filter(f => !plantIds.includes(f.id)).slice(0, 6).map(food => (
              <button
                key={food.id}
                onClick={() => handleRegister(food)}
                className="flex items-center gap-2 rounded-full bg-white border border-slate-100 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm active:scale-95 transition-all"
              >
                <span>{food.emoji}</span>
                {getFoodLabel(food, locale)}
              </button>
            ))}
          </div>
        </section>

        {/* Tarjetas de Salud */}
        <section className="grid grid-cols-2 gap-5">
           <div className="bg-[#e8f4d1] p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm">
              <span className="text-4xl mb-4">🧠</span>
              <span className="text-[11px] font-black text-green-900 uppercase tracking-widest">Salud Mental</span>
              <span className="text-xs font-bold text-green-800/50 mt-1">Optimizada</span>
           </div>
           <div className="bg-[#f0f2da] p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm">
              <span className="text-4xl mb-4">🛡️</span>
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Inmunidad</span>
              <span className="text-xs font-bold text-slate-600/50 mt-1">Reforzada</span>
           </div>
        </section>
        
        {/* Botón flotante opcional (si quieres que sea igual al del screenshot) */}
        <button className="fixed bottom-24 right-8 h-16 w-16 bg-[#6ab04c] rounded-full shadow-xl text-white text-3xl flex items-center justify-center font-bold active:scale-90 transition-transform z-40">
          +
        </button>
      </div>
    </AppShell>
  );
}
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

// Aquí puedes pegar tu lista de datos curiosos ampliada
const NUTRITION_FACTS: string[] = [
  "Potatoes were the first vegetable grown in space in 1995 aboard the Space Shuttle Columbia.",
  "Broccoli was engineered by humans from wild cabbage over 2,000 years ago.",
  "The world’s hottest chili pepper can reach over 2 million Scoville units.",
  // ... añade el resto de tu lista aquí
];

function DonutProgress({ count }: { count: number }) {
  const data = [
    { name: "completed", value: Math.min(count, WEEKLY_GOAL) },
    { name: "remaining", value: Math.max(WEEKLY_GOAL - count, 0) },
  ];

  const COLORS = ["#7cb342", "#dfe8d9"];

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius="80%"
            outerRadius="100%"
            startAngle={90}
            endAngle={450}
            dataKey="value"
            stroke="none"
            cornerRadius={10}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {/* Texto centrado sin absolute positioning conflictivo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[24px] font-bold text-[#1a2e1a]">
          {count}/{WEEKLY_GOAL}
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
    <div className="relative w-full">
      <div className="flex items-center rounded-full bg-white px-4 py-2 shadow-sm border border-slate-200">
        <span className="mr-2">🔍</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>
      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border bg-white shadow-lg overflow-hidden">
          {suggestions.map((food) => (
            <button
              key={food.id}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b last:border-none"
              onClick={() => onSelect(food)}
            >
              <span>{food.emoji}</span>
              <span className="text-sm font-medium">{getFoodLabel(food, locale)}</span>
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
  const [profileName, setProfileName] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("nutrigoal-week");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.plantIds) setPlantIds(parsed.plantIds);
      } catch (e) {}
    }
    
    const profile = window.localStorage.getItem("nutrigoal-profile");
    if (profile) {
      const parsed = JSON.parse(profile);
      if (parsed.name) setProfileName(parsed.name);
    }
  }, []);

  const handleRegister = async (food: FoodItem) => {
    if (plantIds.includes(food.id)) return;
    const next = [...plantIds, food.id];
    setPlantIds(next);
    setSearch("");
    window.localStorage.setItem("nutrigoal-week", JSON.stringify({ plantIds: next }));
  };

  return (
    <AppShell>
      {/* Contenedor principal estilo App Móvil */}
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col gap-8 bg-[#fbfbf4] px-6 py-8 pb-32">
        
        {/* Título y Saludo */}
        <header className="text-center">
          <h1 className="text-[32px] font-extrabold text-[#2d5a27]">NutriBioMind</h1>
          <p className="text-[18px] text-slate-600 mt-1">
            Hola, {profileName || "Bio-hacker"}!
          </p>
          <p className="text-sm text-slate-500 italic mt-2">
            La regla de oro: ¡30 plantas distintas por semana!
          </p>
        </header>

        {/* Buscador y Botón "+" integrados */}
        <div className="flex items-center gap-2">
          <SmartSearch
            value={search}
            onChange={setSearch}
            onSelect={handleRegister}
            placeholder="Buscar planta..."
            locale={locale}
          />
          <button 
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7cb342] text-white shadow-md hover:bg-[#689f38] transition-colors"
            onClick={() => document.querySelector('input')?.focus()}
          >
            <span className="text-2xl font-bold">+</span>
          </button>
        </div>

        {/* Sección de Progreso (Arreglada) */}
        <section className="flex items-center justify-between bg-white/50 p-4 rounded-3xl border border-white/20 shadow-sm">
          <DonutProgress count={plantIds.length} />
          <div className="flex flex-col gap-2 flex-1 ml-6">
            <h3 className="font-bold text-[#1a2e1a] text-lg">Diversidad Semanal</h3>
            <div className="text-sm space-y-1 text-slate-700">
              <p>🌿 Prebióticos: 3/5</p>
              <p>🦠 Probióticos: 0/3</p>
            </div>
          </div>
        </section>

        {/* Sugerencias */}
        <section>
          <h2 className="text-lg font-bold text-[#1a2e1a] mb-4">💡 Sugerencias para hoy</h2>
          <div className="flex flex-wrap gap-2">
            {FOODS.filter(f => !plantIds.includes(f.id)).slice(0, 4).map(food => (
              <button
                key={food.id}
                onClick={() => handleRegister(food)}
                className="rounded-full bg-[#e8f5e9] px-4 py-2 text-sm font-semibold text-[#2d5a27] border border-[#c8e6c9] hover:bg-[#c8e6c9] transition-colors"
              >
                {getFoodLabel(food, locale)}
              </button>
            ))}
          </div>
        </section>

        {/* Tarjeta de Sabiduría */}
        <section className="mt-2">
          <div className="rounded-[24px] bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-center font-bold text-[#2d5a27] mb-3">
              Dosis Exprés de Sabiduría ⚡
            </h3>
            <div className="h-[1px] bg-slate-100 w-full mb-4" />
            <p className="text-[15px] leading-relaxed text-slate-600 italic">
              "{NUTRITION_FACTS[new Date().getDate() % NUTRITION_FACTS.length]}"
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
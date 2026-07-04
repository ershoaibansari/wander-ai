"use client";

import { useState } from "react";
import {
  DiscoverTool,
  EtiquetteCheckerTool,
  SavingCheatsTool,
  CultureTool,
  PhrasesTool,
  QuizTool,
} from "@/components/AiTools";

const tabs = [
  { id: "discover", label: "🗺️ Discovery" },
  { id: "etiquette", label: "🚦 Etiquette" },
  { id: "saving", label: "💰 Money Saving" },
  { id: "culture", label: "⛩️ Custom Guide" },
  { id: "phrases", label: "🗣️ Phrasebook" },
  { id: "quiz", label: "🏆 Quiz" },
];

export function DiscoverPortal() {
  const [activeTab, setActiveTab] = useState("discover");

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="card p-6">
        <p className="kicker">Interactive AI Companion</p>
        <h1 className="page-title mt-3">AI Travel Hub</h1>
        <p className="muted mt-4 max-w-3xl text-base">
          Toggle between our specialized server-side Gemini AI tools to prepare for a respectful, local-first, and cost-effective journey.
        </p>
        
        <nav aria-label="Travel tools navigation" className="mt-8 flex flex-wrap gap-2 border-t border-[var(--line)] pt-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn font-extrabold text-sm rounded-full transition-all ${
                  isActive
                    ? "btn-primary shadow-lg"
                    : "btn-secondary hover:bg-[color-mix(in_srgb,var(--primary)_8%,var(--card-strong))]"
                }`}
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="space-y-6">
        {activeTab === "discover" && <DiscoverTool />}
        {activeTab === "etiquette" && <EtiquetteCheckerTool />}
        {activeTab === "saving" && <SavingCheatsTool />}
        {activeTab === "culture" && <CultureTool />}
        {activeTab === "phrases" && <PhrasesTool />}
        {activeTab === "quiz" && <QuizTool />}
      </main>
    </div>
  );
}

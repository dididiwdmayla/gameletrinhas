import { useState } from "react";
import { GameMode, MODE_CONFIG } from "../lib/types";
import { loadStats } from "../lib/storage";
import { motion } from "framer-motion";

interface StatsModalProps {
  onClose: () => void;
  initialMode?: GameMode;
}

export function StatsModal({ onClose, initialMode = "solo" }: StatsModalProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>(initialMode);
  const stats = loadStats(selectedMode);

  const winRate =
    stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;

  // Find max distribution value for scaling
  const maxDist = Math.max(...Object.values(stats.distribution).concat([1])); // prevent 0
  const maxAttempts = MODE_CONFIG[selectedMode].maxAttempts;
  const arrAttempts = Array.from({ length: maxAttempts }, (_, i) => i + 1);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-bg-surface border border-absent shadow-2xl rounded-xl p-6 max-w-sm w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
          aria-label="Fechar estado"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-display font-bold text-center mb-6">
          Estatísticas
        </h2>

        <div className="flex overflow-x-auto gap-2 pb-2 mb-4 scrollbar-none">
          {(Object.keys(MODE_CONFIG) as GameMode[])
            .filter((m) => m !== "unica")
            .map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                  selectedMode === mode
                    ? "bg-accent text-bg-base"
                    : "bg-transparent border border-text-muted text-text-muted"
                }`}
              >
                {MODE_CONFIG[mode].label}
              </button>
            ))}
        </div>

        <div className="grid grid-cols-4 gap-2 text-center mb-6">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{stats.played}</span>
            <span className="text-xs text-text-muted">Jogos</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{winRate}</span>
            <span className="text-xs text-text-muted">% Vitórias</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{stats.currentStreak}</span>
            <span className="text-xs text-text-muted">Sequência Atual</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{stats.maxStreak}</span>
            <span className="text-xs text-text-muted">Sequência Máx</span>
          </div>
        </div>

        <h3 className="font-bold mb-2">Distribuição de Tentativas</h3>
        <div className="flex flex-col gap-1">
          {arrAttempts.map((num) => {
            const count = stats.distribution[num] || 0;
            const pct = count > 0 ? (count / maxDist) * 100 : 0;
            return (
              <div key={num} className="flex items-center gap-2">
                <span className="w-4 text-right text-sm">{num}</span>
                <div className="flex-1 bg-[var(--color-bg-base)] h-5 rounded overflow-hidden">
                  <div
                    className={`h-full flex items-center justify-end px-2 text-xs font-bold text-text-primary
                      ${count > 0 ? "bg-correct" : "bg-transparent text-text-muted"}`}
                    style={{ width: count > 0 ? `${Math.max(8, pct)}%` : "0%" }}
                  >
                    {count > 0 ? count : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

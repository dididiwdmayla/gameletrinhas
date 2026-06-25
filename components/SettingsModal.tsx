"use client";

import { motion } from "motion/react";
import {
  ThemeName,
  getUnlockedThemes,
  getCurrentTheme,
  setCurrentTheme,
} from "../lib/theme";
import { useState, useEffect } from "react";

interface SettingsModalProps {
  onClose: () => void;
}

const ALL_THEMES: ThemeName[] = ["default", "dourado", "gasolina"];

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [unlocked, setUnlocked] = useState<ThemeName[]>(["default"]);
  const [current, setCurrent] = useState<ThemeName>("default");

  useEffect(() => {
    setTimeout(() => {
      setUnlocked(getUnlockedThemes());
      setCurrent(getCurrentTheme());
    }, 0);
  }, []);

  const handleSelectTheme = (t: ThemeName) => {
    if (!unlocked.includes(t)) return;
    setCurrent(t);
    setCurrentTheme(t);
  };

  const themeLabels: Record<ThemeName, string> = {
    default: "Padrão",
    dourado: "Dourado",
    gasolina: "Verde-Gasolina",
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-bg-surface p-6 sm:p-8 rounded-xl w-full max-w-md border border-absent shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold">Estúdio</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-2"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-text-muted">Temas</h3>
          <div className="flex flex-col gap-2">
            {ALL_THEMES.map((t) => {
              const isUnlocked = unlocked.includes(t);
              const isSelected = current === t;
              return (
                <button
                  key={t}
                  onClick={() => handleSelectTheme(t)}
                  disabled={!isUnlocked}
                  className={`p-3 rounded-lg border-2 text-left transition-colors font-bold flex justify-between items-center ${isSelected ? "border-accent bg-accent/10 text-accent" : isUnlocked ? "border-bg-base hover:border-text-muted text-text-primary" : "border-bg-base text-text-muted/50 cursor-not-allowed"}`}
                >
                  <span>{themeLabels[t]}</span>
                  {!isUnlocked && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          {unlocked.length < ALL_THEMES.length && (
            <p className="text-xs text-text-muted mt-3 italic flex items-center gap-1">
              Existem temas secretos escondidos. Tente adivinhar certas palavras
              para desbloqueá-los!
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-absent hover:bg-absent/80 text-text-primary rounded font-bold transition-colors"
        >
          FECHAR
        </button>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { ModeMenu } from "../components/ModeMenu";
import { StatsModal } from "../components/StatsModal";
import { SettingsModal } from "../components/SettingsModal";

import { AnimatePresence } from "framer-motion";

export default function Home() {
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <main className="h-[100dvh] w-full flex items-center justify-center relative z-10 overflow-auto sm:overflow-hidden p-4 sm:p-8">
      <div className="w-full max-w-[1200px] sm:h-[85vh] bg-bg-base border-[3px] border-text-primary shadow-[16px_16px_0_var(--color-text-primary)] relative flex flex-col p-6 sm:p-12 overflow-y-auto sm:overflow-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
          <div className="flex flex-col">
            <h1 className="font-display text-accent text-6xl sm:text-8xl leading-[0.8] -rotate-2 origin-left">
              Letrinha
            </h1>
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] mt-3">
              O jogo das palavras certas
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="w-12 h-12 border-[3px] border-text-primary flex items-center justify-center bg-bg-surface cursor-pointer shadow-[4px_4px_0_var(--color-text-primary)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0_var(--color-text-primary)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
              aria-label="Estúdio"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.5C8.32843 14.5 9 13.8284 9 13C9 12.1716 8.32843 11.5 7.5 11.5C6.67157 11.5 6 12.1716 6 13C6 13.8284 6.67157 14.5 7.5 14.5Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5C12.8284 10.5 13.5 9.82843 13.5 9C13.5 8.17157 12.8284 7.5 12 7.5C11.1716 7.5 10.5 8.17157 10.5 9C10.5 9.82843 11.1716 10.5 12 10.5Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 14.5C17.3284 14.5 18 13.8284 18 13C18 12.1716 17.3284 11.5 16.5 11.5C15.6716 11.5 15 12.1716 15 13C15 13.8284 15.6716 14.5 16.5 14.5Z" />
              </svg>
            </button>
            <button
              onClick={() => setShowStats(true)}
              className="w-12 h-12 border-[3px] border-text-primary flex items-center justify-center bg-bg-surface cursor-pointer shadow-[4px_4px_0_var(--color-text-primary)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0_var(--color-text-primary)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
              aria-label="Estatísticas"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-5 5-4-4-3 3" />
              </svg>
            </button>
          </div>
        </header>

        <div className="flex-1 w-full min-h-0 sm:overflow-y-auto overflow-x-hidden p-2 -m-2">
          <ModeMenu />
        </div>

        <footer className="mt-8 pt-6 border-t-[3px] border-text-primary flex justify-between font-mono text-xs sm:text-sm shrink-0">
          <div>MODO: SELEÇÃO</div>
          <div>VER. 2.0</div>
        </footer>
      </div>

      <AnimatePresence>
        {showStats && <StatsModal onClose={() => setShowStats(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </main>
  );
}

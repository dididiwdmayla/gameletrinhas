"use client";

import { useState } from "react";
import { ModeMenu } from "../components/ModeMenu";
import { StatsModal } from "../components/StatsModal";
import { SettingsModal } from "../components/SettingsModal";
import { AnimatePresence } from "motion/react";

export default function Home() {
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <main className="h-[100dvh] flex flex-col items-center relative z-10 overflow-hidden">
      <header className="w-full flex justify-end p-2 sm:p-4 gap-2 shrink-0 relative z-20">
        <button
          onClick={() => setShowSettings(true)}
          className="text-text-muted hover:text-text-primary p-2 transition-colors flex items-center gap-2"
          aria-label="Estúdio"
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
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
            <path d="M7.5 14.5C8.32843 14.5 9 13.8284 9 13C9 12.1716 8.32843 11.5 7.5 11.5C6.67157 11.5 6 12.1716 6 13C6 13.8284 6.67157 14.5 7.5 14.5Z" />
            <path d="M12 10.5C12.8284 10.5 13.5 9.82843 13.5 9C13.5 8.17157 12.8284 7.5 12 7.5C11.1716 7.5 10.5 8.17157 10.5 9C10.5 9.82843 11.1716 10.5 12 10.5Z" />
            <path d="M16.5 14.5C17.3284 14.5 18 13.8284 18 13C18 12.1716 17.3284 11.5 16.5 11.5C15.6716 11.5 15 12.1716 15 13C15 13.8284 15.6716 14.5 16.5 14.5Z" />
          </svg>
          <span className="font-bold text-sm hidden sm:inline">Estúdio</span>
        </button>
        <button
          onClick={() => setShowStats(true)}
          className="text-text-muted hover:text-text-primary p-2 transition-colors flex items-center gap-2"
          aria-label="Estatísticas"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </button>
      </header>

      <div className="flex-1 w-full min-h-0 pb-2 sm:pb-8">
        <ModeMenu />
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

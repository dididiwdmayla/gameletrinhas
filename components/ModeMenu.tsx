import Link from "next/link";
import { MODE_CONFIG, GameMode } from "../lib/types";
import { hasPlayedDaily } from "../lib/storage";
import { useEffect, useState } from "react";

const MODE_ICONS: Record<GameMode, React.ReactNode> = {
  solo: (
    <div className="w-4 h-4 bg-accent/20 border border-accent rounded-sm shadow-[0_0_8px_var(--color-accent)]" />
  ),
  dueto: (
    <div className="flex gap-1">
      <div className="w-3 h-3 bg-accent/20 border border-accent rounded-sm" />
      <div className="w-3 h-3 bg-accent/20 border border-accent rounded-sm" />
    </div>
  ),
  quarteto: (
    <div className="grid grid-cols-2 gap-1">
      <div className="w-2.5 h-2.5 bg-accent/20 border border-accent rounded-sm" />
      <div className="w-2.5 h-2.5 bg-accent/20 border border-accent rounded-sm" />
      <div className="w-2.5 h-2.5 bg-accent/20 border border-accent rounded-sm" />
      <div className="w-2.5 h-2.5 bg-accent/20 border border-accent rounded-sm" />
    </div>
  ),
  sextuplo: (
    <div className="grid grid-cols-3 gap-0.5">
      <div className="w-2 h-2 bg-accent/20 border border-accent rounded-sm" />
      <div className="w-2 h-2 bg-accent/20 border border-accent rounded-sm" />
      <div className="w-2 h-2 bg-accent/20 border border-accent rounded-sm" />
      <div className="w-2 h-2 bg-accent/20 border border-accent rounded-sm" />
      <div className="w-2 h-2 bg-accent/20 border border-accent rounded-sm" />
      <div className="w-2 h-2 bg-accent/20 border border-accent rounded-sm" />
    </div>
  ),
  onze: (
    <div className="flex items-center text-accent font-bold text-xs tracking-tighter">
      11
    </div>
  ),
  unica: (
    <div className="w-4 h-4 rounded-full border-2 border-accent flex items-center justify-center animate-pulse shadow-[0_0_10px_var(--color-accent)]">
      <div className="w-1.5 h-1.5 bg-accent rounded-full" />
    </div>
  ),
  diario: (
    <svg
      className="w-4 h-4 text-accent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
};

export function ModeMenu() {
  const [playedDaily, setPlayedDaily] = useState(false);

  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    setTimeout(() => {
      setPlayedDaily(hasPlayedDaily(todayStr));
    }, 0);
  }, []);

  const modes = Object.keys(MODE_CONFIG) as GameMode[];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 h-full relative">
      <div className="neon-halo left" />
      <div className="neon-halo right" />

      <div className="text-center py-4 sm:py-8 flex flex-col items-center justify-center shrink-0 relative z-10">
        <h1 className="text-5xl sm:text-7xl font-display font-black tracking-widest text-accent mb-1 sm:mb-2 uppercase drop-shadow-[0_0_20px_var(--color-accent-glow)]">
          Letrinha
        </h1>
        <p className="text-text-muted text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">
          Adivinhe a palavra
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 flex-1 min-h-0 items-center justify-center auto-rows-fr relative z-10">
        {modes.map((mode) => {
          const config = MODE_CONFIG[mode];
          const isDaily = mode === "diario";
          const isLocked = isDaily && playedDaily;

          const CardContent = (
            <div
              className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 h-full flex flex-col justify-center relative overflow-hidden shadow-xl
              ${isLocked ? "border-text-muted/10 bg-bg-base/30 opacity-60" : "border-text-muted/10 bg-bg-surface hover:bg-bg-surface/80 hover:border-accent/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:translate-y-0 active:scale-95 group"}
              ${mode === "unica" ? "border-accent/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_15px_rgba(0,0,0,0.5)]" : "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_15px_rgba(0,0,0,0.5)]"}`}
            >
              {/* Inner highlight for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              {/* Glow on hover */}
              {!isLocked && (
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors pointer-events-none" />
              )}
              {mode === "unica" && (
                <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
              )}

              <div className="flex flex-col gap-2 z-10 relative">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    {MODE_ICONS[mode]}
                    <h2
                      className={`text-lg sm:text-2xl font-display font-bold transition-colors ${isLocked ? "text-text-muted" : "text-text-primary group-hover:text-accent"}`}
                    >
                      {config.label}
                    </h2>
                  </div>
                  {isDaily && !isLocked && (
                    <span className="bg-accent/20 text-accent text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded w-fit border border-accent/30 shadow-[0_0_10px_var(--color-accent-glow)]">
                      NOVA
                    </span>
                  )}
                  {isLocked && (
                    <span className="bg-text-muted/10 text-text-muted text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded w-fit border border-text-muted/20">
                      JOGADO
                    </span>
                  )}
                </div>
                <p className="text-text-muted text-[10px] sm:text-sm mt-1 leading-tight">
                  {isDaily
                    ? "Uma palavra única diária."
                    : mode === "onze"
                      ? "Uma palavra. Onze letras. Sete chances."
                      : mode === "unica"
                        ? "1 palavra. 1 chance."
                        : `${config.grids} grade${config.grids > 1 ? "s" : ""}, ${config.maxAttempts} tentativas.`}
                </p>
              </div>
            </div>
          );

          if (isLocked) {
            return (
              <div key={mode} className="cursor-not-allowed h-full">
                {CardContent}
              </div>
            );
          }

          return (
            <Link
              key={mode}
              href={`/jogar/${mode}`}
              className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl sm:rounded-2xl"
            >
              {CardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

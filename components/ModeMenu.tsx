import Link from "next/link";
import { MODE_CONFIG, GameMode } from "../lib/types";
import { hasPlayedDaily } from "../lib/storage";
import { useEffect, useState } from "react";

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
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 h-full">
      <div className="neon-line left" />
      <div className="neon-line right" />

      <div className="text-center py-4 sm:py-8 flex flex-col items-center justify-center shrink-0">
        <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-accent to-accent/50 mb-1 sm:mb-2 uppercase drop-shadow-[0_0_15px_var(--color-accent)]">
          Letrinha
        </h1>
        <p className="text-text-muted text-xs sm:text-base font-bold tracking-wider uppercase">
          Adivinhe a palavra
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 flex-1 min-h-0 items-center justify-center auto-rows-fr">
        {modes.map((mode) => {
          const config = MODE_CONFIG[mode];
          const isDaily = mode === "diario";
          const isLocked = isDaily && playedDaily;

          const CardContent = (
            <div
              className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all h-full flex flex-col justify-center relative overflow-hidden shadow-lg
              ${isLocked ? "border-text-muted/20 bg-bg-base/50 opacity-60" : "border-bg-surface bg-bg-surface/80 hover:border-accent hover:shadow-[0_0_20px_var(--color-accent)] group"}
              ${mode === "unica" ? "border-dashed border-accent hover:bg-accent/10" : ""}`}
            >
              {mode === "unica" && (
                <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
              )}
              <div className="flex flex-col gap-1 z-10 relative">
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-lg sm:text-2xl font-display font-bold group-hover:text-accent transition-colors">
                    {config.label}
                  </h2>
                </div>
                {isDaily && !isLocked && (
                  <span className="bg-correct/20 text-correct text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded w-fit border border-correct/30">
                    NOVA
                  </span>
                )}
                {isLocked && (
                  <span className="bg-text-muted/20 text-text-muted text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded w-fit border border-text-muted/30">
                    JOGADO
                  </span>
                )}
                <p className="text-text-muted text-[10px] sm:text-sm mt-1 sm:mt-2 leading-tight">
                  {isDaily
                    ? "Uma palavra única diária."
                    : mode === "onze"
                      ? "11 letras. 7 chances."
                      : mode === "dezena"
                        ? "10 palavras. 16 tentativas."
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

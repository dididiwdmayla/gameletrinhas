import Link from "next/link";
import { MODE_CONFIG, GameMode } from "../lib/types";
import { hasPlayedDaily } from "../lib/storage";
import { useEffect, useState } from "react";

const MODE_META: Record<GameMode, string> = {
  solo: "#001",
  dueto: "#002",
  quarteto: "#003",
  sextuplo: "#004",
  onze: "#005",
  unica: "#006",
  diario: "EVENTO DIÁRIO",
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
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 w-full h-full sm:h-auto">
      {modes.map((mode, idx) => {
        const config = MODE_CONFIG[mode];
        const isDaily = mode === "diario";
        const isLocked = isDaily && playedDaily;

        const CardContent = (
          <div
            className={`p-3 sm:p-6 border-[2px] sm:border-[3px] border-text-primary shadow-[3px_3px_0_var(--color-text-primary)] sm:shadow-[6px_6px_0_var(--color-text-primary)] transition-all duration-150 h-full flex flex-col justify-between
            ${isDaily ? "bg-accent text-bg-surface" : "bg-bg-surface text-text-primary"}
            ${
              isLocked
                ? "opacity-60 grayscale cursor-not-allowed"
                : isDaily
                  ? "hover:shadow-[4px_4px_0_var(--color-text-primary)] sm:hover:shadow-[10px_10px_0_var(--color-text-primary)] hover:-translate-y-0.5 hover:-translate-x-0.5 sm:hover:-translate-y-1 sm:hover:-translate-x-1"
                  : "hover:shadow-[4px_4px_0_var(--color-accent)] sm:hover:shadow-[10px_10px_0_var(--color-accent)] hover:-translate-y-0.5 hover:-translate-x-0.5 sm:hover:-translate-y-1 sm:hover:-translate-x-1"
            }`}
          >
            <div>
              {isDaily && !isLocked && (
                <div className="bg-bg-surface text-accent px-1.5 sm:px-2 py-0.5 font-mono font-extrabold text-[0.55rem] sm:text-[0.7rem] w-fit border-2 border-text-primary mb-1.5 sm:mb-2.5">
                  NOVA
                </div>
              )}
              {isLocked && (
                <div className="bg-bg-surface text-text-muted px-1.5 sm:px-2 py-0.5 font-mono font-extrabold text-[0.55rem] sm:text-[0.7rem] w-fit border-2 border-text-primary mb-1.5 sm:mb-2.5">
                  JOGADO
                </div>
              )}
              <div
                className={`font-mono text-[0.55rem] sm:text-[0.65rem] mb-1 sm:mb-4 ${
                  isDaily ? "opacity-80 text-bg-surface" : "opacity-50 text-text-primary"
                }`}
              >
                {MODE_META[mode]}
              </div>
              <h2
                className={`font-display text-xl sm:text-4xl mb-1 sm:mb-2 ${
                  isDaily ? "text-bg-surface" : "text-text-primary"
                }`}
              >
                {config.label}
              </h2>
            </div>
            <p className="text-[0.65rem] sm:text-[0.9rem] leading-[1.1] sm:leading-[1.3] font-semibold mt-1">
              {isDaily
                ? "A palavra secreta do dia."
                : mode === "onze"
                  ? "11 letras. 7 chances."
                  : mode === "unica"
                    ? "1 palavra. 1 chance."
                    : `${config.grids} grade${
                        config.grids > 1 ? "s" : ""
                      }, ${config.maxAttempts} tentativas.`}
            </p>
          </div>
        );

        if (isLocked) {
          return (
            <div key={mode} className={`cursor-not-allowed h-full ${isDaily ? "col-span-2 sm:col-span-1" : ""}`}>
              {CardContent}
            </div>
          );
        }

        return (
          <Link
            key={mode}
            href={`/jogar/${mode}`}
            className={`block h-full outline-none focus-visible:ring-4 focus-visible:ring-accent ${isDaily ? "col-span-2 sm:col-span-1" : ""}`}
          >
            {CardContent}
          </Link>
        );
      })}
    </div>
  );
}

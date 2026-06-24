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
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 p-4">
      <div className="text-center py-8">
        <h1 className="text-5xl sm:text-6xl font-display font-black tracking-tighter text-accent mb-2 uppercase">
          Letrinha
        </h1>
        <p className="text-text-muted">Adivinhe a palavra</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modes.map((mode) => {
          const config = MODE_CONFIG[mode];
          const isDaily = mode === "diario";
          const isLocked = isDaily && playedDaily;

          const CardContent = (
            <div
              className={`p-6 rounded-xl border-2 transition-all h-full
              ${isLocked ? "border-text-muted/30 bg-bg-base opacity-50" : "border-bg-surface bg-bg-surface hover:border-accent group"}
              ${mode === "unica" ? "border-dashed border-accent hover:bg-accent/10" : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-display font-bold group-hover:text-accent transition-colors">
                  {config.label}
                </h2>
                {isDaily && !isLocked && (
                  <span className="bg-correct text-text-primary text-xs font-bold px-2 py-1 rounded">
                    DISPONÍVEL
                  </span>
                )}
                {isLocked && (
                  <span className="bg-text-muted text-text-primary text-xs font-bold px-2 py-1 rounded">
                    JOGADO HOJE
                  </span>
                )}
              </div>
              <p className="text-text-muted text-sm relative z-10">
                {isDaily
                  ? "Uma palavra única por dia para todos."
                  : mode === "onze"
                    ? "Uma palavra. Onze letras. Sete chances."
                    : mode === "dezena"
                      ? "10 palavras, 16 tentativas. Para os corajosos."
                      : mode === "unica"
                        ? "Uma palavra. Uma chance. Boa sorte."
                        : `${config.grids} grade${config.grids > 1 ? "s" : ""}, ${config.maxAttempts} tentativas.`}
              </p>
            </div>
          );

          if (isLocked) {
            return (
              <div key={mode} className="cursor-not-allowed">
                {CardContent}
              </div>
            );
          }

          return (
            <Link key={mode} href={`/jogar/${mode}`} className="block">
              {CardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

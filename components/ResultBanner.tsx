import { useEffect, useState } from "react";
import { GameMode } from "../lib/types";
import { motion } from "motion/react";

interface ResultBannerProps {
  status: "won" | "lost";
  mode: GameMode;
  answers: string[];
  score?: number;
  onPlayAgain: () => void;
  onMenu: () => void;
}

export function ResultBanner({
  status,
  mode,
  answers,
  score,
  onPlayAgain,
  onMenu,
}: ResultBannerProps) {
  const [nextDailyTime, setNextDailyTime] = useState("");

  useEffect(() => {
    if (mode === "diario") {
      const updateTimer = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setHours(24, 0, 0, 0);
        const diff = tomorrow.getTime() - now.getTime();

        const h = Math.floor(diff / (1000 * 60 * 60))
          .toString()
          .padStart(2, "0");
        const m = Math.floor((diff / 1000 / 60) % 60)
          .toString()
          .padStart(2, "0");
        const s = Math.floor((diff / 1000) % 60)
          .toString()
          .padStart(2, "0");
        setNextDailyTime(`${h}:${m}:${s}`);
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 p-4 z-40 flex justify-center pb-24 sm:pb-8 pointer-events-none"
    >
      <div className="bg-bg-surface border-2 border-accent p-6 rounded-xl shadow-xl flex flex-col items-center gap-4 pointer-events-auto max-w-sm w-full">
        <h2 className="text-2xl font-display font-bold">
          {status === "won" ? "Parabéns!" : "Não foi dessa vez"}
        </h2>

        <div className="text-center">
          <p className="text-sm text-text-muted mb-2">
            {answers.length > 1 ? "As palavras eram:" : "A palavra era:"}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {answers.map((ans) => (
              <span
                key={ans}
                className="bg-bg-base px-3 py-1 rounded font-bold tracking-widest text-lg uppercase"
              >
                {ans}
              </span>
            ))}
          </div>
        </div>

        {mode === "diario" ? (
          <div className="w-full text-center pt-4 border-t border-text-muted/30">
            <p className="text-sm font-bold text-text-muted">
              Próxima palavra em
            </p>
            <p className="font-mono text-xl text-text-primary mt-1 mb-4">
              {nextDailyTime}
            </p>
            <button
              onClick={onMenu}
              className="w-full bg-text-muted text-bg-base font-bold py-3 rounded hover:opacity-90 transition-opacity active:scale-95"
            >
              VOLTAR AO MENU
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2">
            <button
              onClick={onPlayAgain}
              className="w-full bg-accent text-bg-base font-bold py-3 rounded hover:opacity-90 transition-opacity active:scale-95"
            >
              JOGAR NOVAMENTE
            </button>
            <button
              onClick={onMenu}
              className="w-full bg-bg-base border-2 border-text-muted/30 text-text-muted font-bold py-3 rounded hover:opacity-90 transition-opacity active:scale-95"
            >
              VOLTAR AO MENU
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

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
      <div className="bg-bg-surface border-[3px] border-text-primary p-6 shadow-[10px_10px_0_var(--color-text-primary)] flex flex-col items-center gap-4 pointer-events-auto max-w-sm w-full">
        <h2 className="text-4xl font-display font-black text-center">
          {status === "won" ? "PARABÉNS!" : "NÃO FOI DESSA VEZ"}
        </h2>

        <div className="text-center">
          <p className="text-sm font-semibold text-text-primary mb-2">
            {answers.length > 1 ? "As palavras eram:" : "A palavra era:"}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {answers.map((ans) => (
              <span
                key={ans}
                className="bg-bg-surface border-[2px] border-text-primary px-3 py-1 font-bold tracking-widest text-lg uppercase shadow-[2px_2px_0_var(--color-text-primary)]"
              >
                {ans}
              </span>
            ))}
          </div>
        </div>

        {mode === "diario" ? (
          <div className="w-full text-center pt-4 border-t-[3px] border-text-primary mt-2">
            <p className="text-sm font-bold text-text-muted">
              Próxima palavra em
            </p>
            <p className="font-mono text-xl text-text-primary mt-1 mb-4 font-bold">
              {nextDailyTime}
            </p>
            <button
              onClick={onMenu}
              className="w-full bg-bg-surface border-[3px] border-text-primary text-text-primary font-bold py-3 px-8 shadow-[4px_4px_0_var(--color-text-primary)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0_var(--color-text-primary)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all uppercase"
            >
              VOLTAR AO MENU
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3 mt-2">
            <button
              onClick={onPlayAgain}
              className="w-full bg-accent text-bg-surface border-[3px] border-text-primary font-bold py-3 px-8 shadow-[4px_4px_0_var(--color-text-primary)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0_var(--color-text-primary)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all uppercase"
            >
              JOGAR NOVAMENTE
            </button>
            <button
              onClick={onMenu}
              className="w-full bg-bg-surface border-[3px] border-text-primary text-text-primary font-bold py-3 px-8 shadow-[4px_4px_0_var(--color-text-primary)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0_var(--color-text-primary)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all uppercase"
            >
              VOLTAR AO MENU
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

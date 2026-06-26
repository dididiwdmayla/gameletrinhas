import { LetterState } from "../lib/types";
import { motion } from "motion/react";
import clsx from "clsx";

interface CellProps {
  letter?: string;
  state: LetterState;
  index: number;
  isRevealing: boolean;
  isCursor?: boolean;
  isVictory?: boolean;
  onClick?: () => void;
  compact?: boolean;
  letras?: number;
}

export function Cell({
  letter,
  state,
  index,
  isRevealing,
  isCursor,
  isVictory,
  onClick,
  compact,
  letras = 5,
}: CellProps) {
  const isFilled = letter && letter.length > 0;

  let textSizeClass = "text-2xl sm:text-3xl";
  if (compact) textSizeClass = "text-lg sm:text-xl";
  if (letras === 11) textSizeClass = "text-sm sm:text-lg"; // smaller font for 11 letters

  const baseClasses = clsx(
    "flex items-center justify-center w-full h-full font-mono font-bold capitalize uppercase transition-colors duration-150 select-none",
    onClick ? "cursor-pointer" : "cursor-default",
    textSizeClass,
    isCursor ? "cursor-glow" : "",
  );

  // State specific classes
  const stateClasses = {
    empty: clsx(
      "border-[3px] shadow-[4px_4px_0_var(--color-text-primary)] bg-bg-surface",
      isFilled
        ? "border-text-primary text-text-primary"
        : "border-text-primary text-transparent",
    ),
    tabbed: "border-[3px] border-text-primary shadow-[4px_4px_0_var(--color-text-primary)] text-text-primary bg-bg-surface",
    correct:
      "bg-correct text-bg-surface border-[3px] border-text-primary shadow-[4px_4px_0_var(--color-text-primary)]",
    present:
      "bg-present text-bg-surface border-[3px] border-text-primary shadow-[4px_4px_0_var(--color-text-primary)]",
    absent:
      "bg-absent text-text-muted border-[3px] border-text-primary shadow-[4px_4px_0_var(--color-text-primary)]",
  };

  const isGuessed = state !== "empty" && state !== "tabbed";

  const ariaLabels: Record<LetterState, string> = {
    empty: "Vazia",
    tabbed: "Preenchida",
    correct: "Correta",
    present: "Presente",
    absent: "Ausente",
  };

  return (
    <div
      className="relative flex items-center justify-center w-full aspect-square min-h-0 min-w-0"
      aria-label={`Letra ${letter || "vazia"}, ${ariaLabels[state]}`}
      onClick={onClick}
    >
      {isCursor && <div className="cursor-aura" />}
      <div className="relative h-full w-full mx-auto overflow-hidden">
        <motion.div
          className={clsx(
            baseClasses,
            stateClasses[state],
            "absolute inset-0",
            isVictory && !isRevealing ? "victory-pulse" : "",
          )}
          style={{ animationDelay: `${index * 0.1}s` }}
          initial={{ rotateX: 0, scale: 1, opacity: 1 }}
          animate={{
            rotateX: isRevealing && isGuessed ? [0, 90, 0] : 0,
            scale: isFilled && !isGuessed ? [0.8, 1] : 1,
            opacity: isFilled && !isGuessed ? [0.5, 1] : 1,
          }}
          transition={{
            rotateX: {
              delay: index * 0.12,
              duration: 0.4,
            },
            scale: {
              type: "spring",
              stiffness: 400,
              damping: 15,
            },
            opacity: {
              duration: 0.1,
            },
          }}
        >
          <span
            className={clsx(
              "absolute",
              isRevealing ? "opacity-0" : "opacity-100",
            )}
          >
            {letter}
          </span>
          <motion.span
            className="absolute"
            initial={{ opacity: isGuessed && !isRevealing ? 1 : 0 }}
            animate={{ opacity: isGuessed ? 1 : 0 }}
            transition={{ delay: isRevealing ? index * 0.12 + 0.2 : 0 }}
          >
            {letter}
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}

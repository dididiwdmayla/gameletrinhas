import { LetterState } from "../lib/types";
import { Cell } from "./Cell";
import { motion } from "motion/react";

interface RowProps {
  guess?: string;
  evaluations?: LetterState[];
  isActive?: boolean;
  isInvalid?: boolean;
  currentAttemptChars?: string[];
  cursorIndex?: number;
  onCellClick?: (index: number) => void;
  compact?: boolean;
  letras?: number;
}

export function Row({
  guess = "",
  evaluations,
  isActive,
  isInvalid,
  currentAttemptChars,
  cursorIndex,
  onCellClick,
  compact,
  letras = 5,
}: RowProps) {
  let letters = Array(letras).fill("");

  if (isActive && currentAttemptChars) {
    letters = currentAttemptChars;
  } else {
    for (let i = 0; i < guess.length; i++) {
      letters[i] = guess[i];
    }
  }

  const defaultEvals: LetterState[] = Array(letras).fill("empty");
  const evalsToUse = evaluations || defaultEvals;
  const isRevealing =
    !isActive && guess.length === letras && evalsToUse[0] !== "empty";

  const isWordComplete =
    isActive &&
    currentAttemptChars &&
    currentAttemptChars.every((c) => c !== "");

  // Dynamic grid cols based on letras
  const gridColsClass = letras === 11 ? "grid-cols-11" : "grid-cols-5";
  const gapClass =
    letras === 11
      ? "gap-[2px] sm:gap-1 mb-1"
      : compact
        ? "gap-1 mb-1"
        : "gap-1 sm:gap-2 mb-1 sm:mb-2";

  return (
    <motion.div
      className={`grid w-full flex-1 min-h-0 ${gridColsClass} ${gapClass} ${isWordComplete ? "word-complete" : ""}`}
      animate={{ x: isInvalid ? [0, -5, 5, -5, 5, 0] : 0 }}
      transition={{ duration: 0.4 }}
    >
      {letters.map((letter, i) => (
        <Cell
          key={i}
          letter={letter}
          state={evalsToUse[i]}
          index={i}
          isRevealing={isRevealing}
          isCursor={isActive && cursorIndex === i}
          onClick={isActive && onCellClick ? () => onCellClick(i) : undefined}
          compact={compact}
          letras={letras}
        />
      ))}
    </motion.div>
  );
}

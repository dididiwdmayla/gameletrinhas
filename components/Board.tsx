import { GridState } from "../lib/types";
import { Row } from "./Row";
import clsx from "clsx";

interface BoardProps {
  grid: GridState;
  currentAttemptChars: string[];
  cursorIndex: number;
  onCellClick: (index: number) => void;
  maxAttempts: number;
  invalidShake: boolean;
  compact?: boolean;
  letras?: number;
}

export function Board({
  grid,
  currentAttemptChars,
  cursorIndex,
  onCellClick,
  maxAttempts,
  invalidShake,
  compact,
  letras = 5,
}: BoardProps) {
  const emptyRowsCount = Math.max(
    0,
    maxAttempts - grid.guesses.length - (grid.status === "playing" ? 1 : 0),
  );
  const isActive = grid.status === "playing";

  const boardAspectRatio = `${letras} / ${maxAttempts}`;

  return (
    <div
      className={clsx(
        "w-full h-full max-w-[320px] mx-auto rounded-lg transition-all duration-300 flex flex-col justify-center",
        letras === 11 ? "max-w-[100%]" : "max-w-[320px]",
        compact ? "p-1" : "p-1 sm:p-3",
        grid.status === "won"
          ? "ring-2 ring-accent shadow-[0_0_15px_rgba(255,77,94,0.3)] opacity-80"
          : grid.status === "lost"
            ? "opacity-60 grayscale"
            : "bg-transparent",
      )}
      style={{
        maxHeight: "100%",
      }}
    >
      {/* Past guesses */}
      {grid.guesses.map((guess, i) => (
        <Row
          key={`past-${i}`}
          guess={guess}
          evaluations={grid.evaluations[i]}
          compact={compact}
          letras={letras}
        />
      ))}

      {/* Current guess */}
      {isActive && (
        <Row
          isActive={true}
          currentAttemptChars={currentAttemptChars}
          cursorIndex={cursorIndex}
          onCellClick={onCellClick}
          isInvalid={invalidShake}
          compact={compact}
          letras={letras}
        />
      )}

      {/* Empty rows */}
      {Array(emptyRowsCount)
        .fill(null)
        .map((_, i) => (
          <Row key={`empty-${i}`} compact={compact} letras={letras} />
        ))}
    </div>
  );
}

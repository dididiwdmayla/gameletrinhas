import { GridState } from "../lib/types";
import { Board } from "./Board";
import clsx from "clsx";

interface BoardGridProps {
  grids: GridState[];
  currentAttemptChars: string[];
  cursorIndex: number;
  onCellClick: (index: number) => void;
  maxAttempts: number;
  invalidShake: boolean;
  letras?: number;
}

export function BoardGrid({
  grids,
  currentAttemptChars,
  cursorIndex,
  onCellClick,
  maxAttempts,
  invalidShake,
  letras = 5,
}: BoardGridProps) {
  const count = grids.length;

  const layoutClasses = clsx(
    "grid w-full h-full justify-center content-start min-h-0 px-2 pb-4",
    {
      "gap-2 sm:gap-4 grid-cols-1 mx-auto auto-rows-fr": count === 1,
      "gap-2 sm:gap-4 grid-cols-2 max-w-[700px] mx-auto auto-rows-fr":
        count === 2 || count === 4,
      "gap-1 sm:gap-4 grid-cols-2 lg:grid-cols-3 max-w-[1000px] mx-auto auto-rows-fr":
        count === 6,
      "gap-1 sm:gap-2 grid-cols-2 md:grid-cols-5 max-w-[1200px] mx-auto auto-rows-fr":
        count === 10,
    },
    letras === 11 ? "max-w-[700px]" : count === 1 ? "max-w-[360px]" : "",
  );

  return (
    <div className={layoutClasses}>
      {grids.map((grid) => (
        <Board
          key={grid.id}
          grid={grid}
          currentAttemptChars={currentAttemptChars}
          cursorIndex={cursorIndex}
          onCellClick={onCellClick}
          maxAttempts={maxAttempts}
          invalidShake={invalidShake}
          compact={count === 10}
          letras={letras}
        />
      ))}
    </div>
  );
}

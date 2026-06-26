import { KeyState } from "../lib/types";
import clsx from "clsx";

interface KeyProps {
  char: string;
  states: KeyState[];
  onClick: (char: string) => void;
  isAction?: boolean;
}

export function Key({ char, states, onClick, isAction }: KeyProps) {
  const numStates = states.length || 1;

  const bgColors: Record<KeyState, string> = {
    empty: "var(--color-bg-surface)",
    correct: "var(--color-correct)",
    present: "var(--color-present)",
    absent: "var(--color-absent)",
  };

  const textColors: Record<KeyState, string> = {
    empty: "var(--color-text-primary)",
    correct: "var(--color-bg-surface)",
    present: "var(--color-bg-surface)",
    absent: "var(--color-text-muted)",
  };

  // For multi-grid, if it's all absent or all empty, we can just use a solid color.
  const isUniform = states.every((s) => s === states[0]);
  const bestColorStr =
    isUniform && states.length > 0
      ? textColors[states[0]]
      : "var(--color-text-primary)";

  // For linear gradient if we have multi-grid splits
  let backgroundStyle = {};
  if (isUniform && states.length > 0) {
    backgroundStyle = { backgroundColor: bgColors[states[0]] };
  } else if (states.length > 0) {
    // create vertical stripes
    const pct = 100 / numStates;
    const stops = states.map(
      (s, i) => `${bgColors[s]} ${i * pct}%, ${bgColors[s]} ${(i + 1) * pct}%`,
    );
    backgroundStyle = {
      background: `linear-gradient(to right, ${stops.join(", ")})`,
    };
  } else {
    backgroundStyle = { backgroundColor: bgColors.empty };
  }

  return (
    <button
      onClick={() => onClick(char)}
      className={clsx(
        "flex items-center justify-center border-[3px] border-text-primary shadow-[4px_4px_0_var(--color-text-primary)] uppercase font-body font-bold text-sm sm:text-base select-none touch-manipulation transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0_var(--color-text-primary)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-[2px_2px_0_var(--color-text-primary)]",
        isAction ? "px-3 sm:px-4 text-xs sm:text-sm" : "flex-1",
      )}
      style={{
        ...backgroundStyle,
        color: bestColorStr,
        height: "48px",
        minWidth: isAction ? "auto" : "28px",
      }}
      aria-label={char}
    >
      {char === "BACKSPACE" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21 4-14 0c-1 0-2 .6-2.5 1.5L.5 12l4 6.5C5 19.4 6 20 7 20l14 0c1.1 0 2-.9 2-2L23 6c0-1.1-.9-2-2-2z" />
          <path d="m18 10-6 6" />
          <path d="m12 10 6 6" />
        </svg>
      ) : char === "ENTER" ? (
        "ENTER"
      ) : (
        char
      )}
    </button>
  );
}

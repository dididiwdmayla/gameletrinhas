import { useEffect } from "react";
import { Key } from "./Key";
import { KeyState } from "../lib/types";

interface KeyboardProps {
  onChar: (char: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  keyStates: Record<string, KeyState[]>;
  readOnly?: boolean;
}

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

export function Keyboard({
  onChar,
  onEnter,
  onBackspace,
  onArrowLeft,
  onArrowRight,
  keyStates,
  readOnly = false,
}: KeyboardProps) {
  useEffect(() => {
    if (readOnly) return; // Don't attach native global keydown if handled elsewhere or readOnly
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Enter") {
        onEnter();
      } else if (e.key === "Backspace") {
        onBackspace();
      } else if (e.key === "ArrowLeft" && onArrowLeft) {
        onArrowLeft();
      } else if (e.key === "ArrowRight" && onArrowRight) {
        onArrowRight();
      } else {
        const key = e.key.toUpperCase();
        // treat cedilla
        const normalizedKey = key === "Ç" ? "C" : key;
        if (/^[A-Z]$/.test(normalizedKey)) {
          onChar(normalizedKey);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onChar, onEnter, onBackspace, onArrowLeft, onArrowRight, readOnly]);

  const handleKeyClick = (key: string) => {
    if (readOnly) return;
    if (key === "ENTER") onEnter();
    else if (key === "BACKSPACE") onBackspace();
    else onChar(key);
  };

  return (
    <div
      className={`w-full max-w-[500px] mx-auto px-1 mt-auto pb-4 flex flex-col gap-1 sm:gap-2 ${readOnly ? "pointer-events-none opacity-80" : ""}`}
    >
      {KEYS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 w-full">
          {row.map((key) => (
            <Key
              key={key}
              char={key}
              states={keyStates[key] || []}
              onClick={handleKeyClick}
              isAction={key === "ENTER" || key === "BACKSPACE"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

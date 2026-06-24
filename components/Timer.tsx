import { useEffect, useState } from "react";

interface TimerProps {
  remainingMs: number;
  pulse?: boolean;
}

export function Timer({ remainingMs, pulse }: TimerProps) {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");

  const isCritical = totalSeconds <= 10 && pulse;

  return (
    <div
      className={`text-center font-mono text-2xl font-bold mt-2 transition-colors duration-300 ${isCritical ? "text-accent timer-pulse" : "text-text-primary"}`}
    >
      {m}:{s}
    </div>
  );
}

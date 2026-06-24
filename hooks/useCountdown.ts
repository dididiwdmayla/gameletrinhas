import { useState, useEffect, useCallback, useRef } from "react";

export function useCountdown(initialSeconds: number) {
  const [remainingMs, setRemainingMs] = useState(initialSeconds * 1000);
  const [expired, setExpired] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (startTimeRef.current !== null) return;
    startTimeRef.current = Date.now();
    setExpired(false);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current!;
      const remaining = initialSeconds * 1000 - elapsed;
      if (remaining <= 0) {
        setRemainingMs(0);
        setExpired(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        setRemainingMs(remaining);
      }
    }, 100);
  }, [initialSeconds]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startTimeRef.current = null;
    setRemainingMs(initialSeconds * 1000);
    setExpired(false);
  }, [initialSeconds]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { start, remainingMs, expired, reset };
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function SparksEffect() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mediaQuery?.matches ?? false);

    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery?.addEventListener?.("change", listener);
    return () => mediaQuery?.removeEventListener?.("change", listener);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let rippleIdCounter = 0;
    let downX = 0;
    let downY = 0;
    let isDown = false;
    let downTime = 0;

    const handlePointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
      isDown = true;
      downTime = Date.now();
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;

      const dx = e.clientX - downX;
      const dy = e.clientY - downY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const timeElapsed = Date.now() - downTime;

      // Only on tap (not drag) and short time
      if (dist < 8 && timeElapsed < 500) {
        const newRipple: Ripple = {
          id: rippleIdCounter++,
          x: e.clientX,
          y: e.clientY,
        };

        setRipples((prev) => [...prev, newRipple]);

        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{
              x: ripple.x - 30,
              y: ripple.y - 30,
              opacity: 0.6,
              scale: 0.2,
            }}
            animate={{
              opacity: 0,
              scale: 2,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="absolute rounded-full border border-accent bg-accent/20"
            style={{
              width: 60,
              height: 60,
              boxShadow: "0 0 15px var(--color-accent)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

    const handlePointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
      isDown = true;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;

      const dx = e.clientX - downX;
      const dy = e.clientY - downY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 8) {
        const newRipple = {
          id: rippleIdCounter++,
          x: e.clientX,
          y: e.clientY,
        };

        setRipples((prev) => [...prev, newRipple]);

        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 1000); 
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
              opacity: 0.8,
              scale: 0.2,
            }}
            animate={{
              opacity: 0,
              scale: 2.5,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="absolute rounded-full border-2 border-accent shadow-[0_0_15px_var(--color-accent-glow)] bg-accent/10"
            style={{
              width: 60,
              height: 60,
              filter: "blur(2px)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

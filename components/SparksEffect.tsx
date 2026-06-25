"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
  velocity: number;
  size: number;
}

export function SparksEffect() {
  const [sparks, setSparks] = useState<Spark[]>([]);
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

    let sparkIdCounter = 0;
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
        // Create 8-10 sparks
        const numSparks = Math.floor(Math.random() * 3) + 8;
        const newSparks: Spark[] = [];

        for (let i = 0; i < numSparks; i++) {
          newSparks.push({
            id: sparkIdCounter++,
            x: e.clientX,
            y: e.clientY,
            angle: Math.random() * Math.PI * 2,
            velocity: Math.random() * 60 + 30, // 30 to 90 px distance
            size: Math.random() * 3 + 2, // 2 to 5 px size
          });
        }

        setSparks((prev) => [...prev, ...newSparks]);

        // Remove these sparks after animation completes
        setTimeout(() => {
          setSparks((prev) => prev.filter((s) => !newSparks.includes(s)));
        }, 600); // slightly longer than animation duration
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
        {sparks.map((spark) => {
          const destX = Math.cos(spark.angle) * spark.velocity;
          const destY = Math.sin(spark.angle) * spark.velocity + 30; // added gravity effect (+Y)

          return (
            <motion.div
              key={spark.id}
              initial={{
                x: spark.x,
                y: spark.y,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: spark.x + destX,
                y: spark.y + destY,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                width: spark.size,
                height: spark.size,
                borderRadius: "50%",
                backgroundColor: "var(--color-accent)",
                boxShadow: "0 0 4px var(--color-accent)",
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

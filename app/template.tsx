"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  
  // Choose transition based on route
  const isHome = pathname === "/";
  
  const variants = shouldReduceMotion ? {
    hidden: { opacity: 0 },
    enter: { opacity: 1 },
  } : isHome 
    ? {
        hidden: { opacity: 0, scale: 0.95 },
        enter: { opacity: 1, scale: 1 },
      }
    : {
        hidden: { opacity: 0, y: 20 },
        enter: { opacity: 1, y: 0 },
      };

  return (
    <motion.div
      key={pathname}
      variants={variants}
      initial="hidden"
      animate="enter"
      transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}

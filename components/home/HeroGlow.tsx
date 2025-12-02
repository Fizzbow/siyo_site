"use client";

import { motion } from "motion/react";

/**
 * Subtle hero glow that visually links the home hero area to the top theme toggle.
 * Implemented as a client component so we can safely use `motion` from `motion/react`.
 */
export function HeroGlow() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-10 h-20 w-[22rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_50%_0%,rgba(248,250,252,0.55),rgba(148,163,184,0.18)_40%,transparent_75%)] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(148,163,184,0.55),rgba(15,23,42,0.4)_40%,transparent_80%)] blur-2xl"
      initial={{ opacity: 0, y: 96, scale: 0.9 }}
      animate={{ opacity: 1, y: -80, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, []);

  if (!mounted) return null;

  return (
    <svg className="h-10 w-10 -rotate-90 transform" viewBox="0 0 100 100">
      <circle
        className="text-surface-muted stroke-current"
        strokeWidth="8"
        cx="50"
        cy="50"
        r="40"
        fill="transparent"
        opacity={0.2}
      />
      <motion.circle
        className="text-blue-500 stroke-current"
        strokeWidth="8"
        strokeLinecap="round"
        cx="50"
        cy="50"
        r="40"
        fill="transparent"
        style={{
          pathLength: scaleX,
        }}
      />
    </svg>
  );
}

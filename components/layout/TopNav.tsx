"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
import clsx from "clsx";

type ThemeMode = "light" | "dark";
const THEME_STORAGE_KEY = "theme";

const outlineVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.75,
  },
  hover: {
    opacity: 1,
    scale: 1.08,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const outlineCircleVariants: Variants = {
  initial: {
    strokeDasharray: "6 8",
    strokeDashoffset: 32,
    strokeWidth: 1.2,
  },
  hover: {
    strokeDasharray: ["6 8", "3 4", "1 0"] as unknown as string,
    strokeDashoffset: [32, 16, 0],
    strokeWidth: [1.2, 1.4, 1.6],
    transition: {
      duration: 0.65,
      ease: "easeInOut",
    },
  },
};

export function TopNav() {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const initialMode: ThemeMode = root.classList.contains("dark")
      ? "dark"
      : "light";
    if (initialMode !== mode) {
      queueMicrotask(() => setMode(initialMode));
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
  }, [mode]);

  const handleToggle = (next: ThemeMode) => {
    setMode(next);
  };

  return (
    <header className="sticky top-0 z-30 flex justify-center px-7 pt-4 pb-3">
      <div
        className={clsx(
          "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-2xl backdrop-saturate-150",
          "bg-white/70 border-white/60 shadow-[0_18px_40px_rgba(148,163,184,0.35)]",
          "dark:bg-[#0F0F10]/80",
          "dark:border-white/8",
          "dark:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.5)]"
        )}
        aria-label="Theme toggle"
      >
        <motion.button
          type="button"
          className="relative inline-flex h-5 w-5 items-center justify-center"
          onClick={() => handleToggle("dark")}
          initial={mode === "dark" ? "hover" : "initial"}
          animate={mode === "dark" ? "hover" : "initial"}
          whileHover="hover"
        >
          <span className="sr-only">Dark mode</span>
          <span
            className={clsx(
              "h-3 w-3 rounded-full transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "bg-slate-900/95 dark:bg-neutral-",
              mode === "dark" ? "opacity-100 scale-100" : "opacity-60 scale-95"
            )}
          />
          <motion.svg
            className="pointer-events-none absolute inset-0"
            viewBox="0 0 24 24"
            variants={outlineVariants}
          >
            <motion.circle
              cx="12"
              cy="12"
              r="8.5"
              fill="none"
              stroke="var(--color-fg-primary)"
              strokeLinecap="round"
              variants={outlineCircleVariants}
            />
          </motion.svg>
        </motion.button>

        <motion.button
          type="button"
          className="relative inline-flex h-5 w-5 items-center justify-center"
          onClick={() => handleToggle("light")}
          initial={mode === "light" ? "hover" : "initial"}
          animate={mode === "light" ? "hover" : "initial"}
          whileHover="hover"
        >
          <span className="sr-only">Light mode</span>
          <span
            className={clsx(
              "h-3 w-3 rounded-full transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "bg-white/95",
              mode === "light" ? "opacity-100 scale-100" : "opacity-60 scale-95"
            )}
          />
          <motion.svg
            className="pointer-events-none absolute inset-0"
            viewBox="0 0 24 24"
            variants={outlineVariants}
          >
            <motion.circle
              cx="12"
              cy="12"
              r="8.5"
              fill="none"
              stroke="var(--color-fg-primary)"
              strokeLinecap="round"
              variants={outlineCircleVariants}
            />
          </motion.svg>
        </motion.button>
      </div>
    </header>
  );
}

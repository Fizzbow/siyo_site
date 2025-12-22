"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 flex justify-center px-7 pt-4 pb-3 pointer-events-none opacity-0">
        <div className="h-9" />
      </header>
    );
  }

  // Use resolvedTheme if available, otherwise fallback to theme
  const currentTheme = resolvedTheme || theme;

  return (
    <header className="sticky top-0 z-30 flex justify-center px-7 pt-4 pb-3 pointer-events-none">
      <div
        className={clsx(
          "pointer-events-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-xl transition-all duration-200",
          "bg-white/20 border-black/5 shadow-sm",
          "dark:bg-white/5 dark:border-white/10 dark:shadow-none"
        )}
        aria-label="Theme toggle"
      >
        <Link href="/">
          <div
            style={{
              background: "url(/favicon.png) no-repeat center center",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "20px",
              height: "20px",
              borderRadius: "4px",
              marginRight: "9px",
              cursor: "pointer",
            }}
          />
        </Link>

        <motion.button
          type="button"
          className="relative inline-flex h-5 w-5 items-center justify-center"
          onClick={() => setTheme("dark")}
          initial={currentTheme === "dark" ? "hover" : "initial"}
          animate={currentTheme === "dark" ? "hover" : "initial"}
          whileHover="hover"
        >
          <span className="sr-only">Dark mode</span>
          <span
            className={clsx(
              "h-3 w-3 rounded-full transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "bg-slate-900/95 dark:bg-neutral-",
              currentTheme === "dark"
                ? "opacity-100 scale-100"
                : "opacity-60 scale-95"
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
          onClick={() => setTheme("light")}
          initial={currentTheme === "light" ? "hover" : "initial"}
          animate={currentTheme === "light" ? "hover" : "initial"}
          whileHover="hover"
        >
          <span className="sr-only">Light mode</span>
          <span
            className={clsx(
              "h-3 w-3 rounded-full transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "bg-white/95",
              currentTheme === "light"
                ? "opacity-100 scale-100"
                : "opacity-60 scale-95"
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

        <Dialog>
          <DialogTrigger asChild>
            <button className="ml-2 text-[10px] font-medium text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors tracking-wide uppercase cursor-pointer">
              Contact
            </button>
          </DialogTrigger>

          <DialogContent
            className="sm:max-w-[425px] p-0 border-none bg-transparent shadow-none"
            showCloseButton={false}
          >
            <div className="rounded-[32px] border border-white/20 bg-white/60 dark:bg-neutral-800/80 dark:border-neutral-700/50 backdrop-blur-2xl shadow-2xl p-2">
              <div className="w-full bg-white dark:bg-[#0A0A0A] rounded-[24px] p-5 overflow-hidden">
                <div className="flex flex-col gap-1">
                  <a
                    href="mailto:navigatoricsl@gmail.com"
                    className="flex items-center justify-between px-4 py-3.5 -mx-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group cursor-pointer"
                  >
                    <span className="text-[13px] font-medium text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Email
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 tracking-wide transition-colors">
                        navigatoricsl@gmail.com
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 text-[10px] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        ↗
                      </span>
                    </div>
                  </a>

                  <div className="h-px bg-neutral-100/80 dark:bg-neutral-800 mx-2" />

                  <a
                    href="https://github.com/Fizzbow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3.5 -mx-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group cursor-pointer"
                  >
                    <span className="text-[13px] font-medium text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      GitHub
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 tracking-wide transition-colors">
                        @Fizzbow
                      </span>
                      <span className="text-purple-600 dark:text-purple-400 text-[10px] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        ↗
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}

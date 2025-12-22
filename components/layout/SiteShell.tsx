"use client";

import type { PropsWithChildren } from "react";

import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";
import Orb from "../Orb";
import { useTheme } from "next-themes";

// const navItems = [
//   { href: "/", label: "Home", icon: Home },
//   { href: "/blog", label: "Blog", icon: Feather },
//   { href: "/projects", label: "Projects", icon: Layers },
//   { href: "/contact", label: "Contact", icon: Send },
// ] as const;

// const outlineVariants: Variants = {
//   initial: {
//     opacity: 0,
//     scale: 0.75,
//   },
//   hover: {
//     opacity: 1,
//     scale: 1.08,
//     transition: {
//       duration: 0.4,
//       ease: [0.16, 1, 0.3, 1],
//     },
//   },
// };

// const outlineCircleVariants: Variants = {
//   initial: {
//     strokeDasharray: "6 8",
//     strokeDashoffset: 32,
//     strokeWidth: 0.8,
//   },
//   hover: {
//     strokeDasharray: ["6 8", "3 4", "1 0"] as unknown as string,
//     strokeDashoffset: [32, 16, 0],
//     strokeWidth: [0.8, 0.85, 0.9],
//     transition: {
//       duration: 0.65,
//       ease: "easeInOut",
//     },
//   },
// };

// const MotionLink = motion(Link);

export function SiteShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const segments = pathname === "/" ? [] : pathname.split("/").filter(Boolean);
  const level = segments.length;

  // const isActive = (href: string) => {
  //   if (href === "/blog") {
  //     return pathname === "/blog" || pathname.startsWith("/blog/");
  //   }
  //   return pathname === href;
  // };

  const belowLevel1 = level <= 1;

  const isShowOrb = useTheme().theme === "dark" && belowLevel1;

  return (
    <div className="app-shell__grid">
      {belowLevel1 && <TopNav />}
      {isShowOrb && (
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      )}
      <main className="app-shell__content">
        <div key={pathname}>{children}</div>
      </main>
      {/* {belowLevel1 && (
        <footer className="fixed inset-x-0 bottom-6 flex items-center justify-center z-50">
          <div
            className={clsx(
              "flex items-center gap-2 px-3 py-2.5 rounded-full",
              "bg-white/70 dark:bg-[#161616]/80",
              "backdrop-blur-2xl backdrop-saturate-150",
              "border border-black/5 dark:border-white/8",
              "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]",
              "transition-all duration-300 ease-out"
            )}
          >
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <MotionLink
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "relative inline-flex h-10 w-10 items-center justify-center rounded-full"
                  )}
                  aria-label={item.label}
                  initial="initial"
                  animate="initial"
                  whileHover="hover"
                >
                  <span
                    className={clsx(
                      "absolute inset-0 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      active
                        ? "bg-blue-500/15 scale-100 opacity-100"
                        : "scale-90 opacity-0"
                    )}
                  />
                  <motion.svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    viewBox="0 0 24 24"
                    variants={outlineVariants}
                  >
                    <motion.circle
                      cx="12"
                      cy="12"
                      r="11"
                      fill="none"
                      stroke="var(--color-fg-primary)"
                      strokeLinecap="round"
                      variants={outlineCircleVariants}
                    />
                  </motion.svg>
                  <item.icon
                    size={18}
                    strokeWidth={2}
                    className={clsx(
                      "relative z-10 transition-colors duration-500 ease-out",
                      active
                        ? "text-blue-500"
                        : "text-slate-500 dark:text-slate-400"
                    )}
                  />
                </MotionLink>
              );
            })}
          </div>
        </footer>
      )} */}
    </div>
  );
}

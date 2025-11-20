"use client";

import type { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteShell({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/blog") {
      return pathname === "/blog" || pathname.startsWith("/blog/");
    }
    return pathname === href;
  };

  return (
    <div className="app-shell__grid">
      <TopNav />
      <main className="app-shell__content">
        <div key={pathname}>{children}</div>
      </main>
      <footer className="fixed inset-x-0 bottom-4 flex items-center justify-center">
        <div className="dock">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`dock-button ${
                isActive(item.href) ? "dock-button--active" : ""
              }`}
              aria-label={item.label}
            >
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}

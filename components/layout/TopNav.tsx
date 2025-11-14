"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "项目" },
  { href: "/contact", label: "联系方式" },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/blog") {
      return pathname === "/blog" || pathname.startsWith("/blog/");
    }
    return pathname === href;
  };

  return (
    <header className="flex items-center justify-between px-7 pt-6 pb-3 border-b border-(--border-subtle)">
      <button
        type="button"
        className="flex items-center gap-3 group"
        onClick={() => router.push("/")}
        aria-label="返回首页"
      >
        <div className="relative h-9 w-9 rounded-full overflow-hidden border border-(--border-strong) bg-[radial-gradient(circle_at_0_0,rgba(148,163,184,0.4),transparent_55%),linear-gradient(135deg,#0f172a,#020617)] shadow-[0_12px_30px_rgba(15,23,42,0.7)] group-hover:shadow-[0_16px_40px_rgba(15,23,42,0.9)] transition-shadow duration-150">
          <div className="absolute inset-[2px] rounded-full bg-[radial-gradient(circle_at_30%_0,rgba(248,250,252,0.55),transparent_52%),linear-gradient(145deg,#1e293b,#020617)]" />
          <span className="relative z-10 flex h-full items-center justify-center text-sm font-semibold">
            S
          </span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">
            Portfolio
          </span>
          <span className="text-sm font-medium text-foreground">Siyo</span>
        </div>
      </button>

      <nav aria-label="主导航">
        <div className="tab-button-pill flex items-center gap-1.5">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`tab-button ${
                isActive(tab.href) ? "tab-button--active" : ""
              }`}
            >
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

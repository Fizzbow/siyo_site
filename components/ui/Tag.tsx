import type { ReactNode } from "react";

export interface TagProps {
  children: ReactNode;
  variant?: "default" | "subtle";
}

export function Tag({ children, variant = "default" }: TagProps) {
  const base =
    "inline-flex items-center rounded-full border text-[10px] px-2 py-0.5";
  const styleByVariant: Record<NonNullable<TagProps["variant"]>, string> = {
    default:
      "border-[color:var(--border-strong)] bg-[rgba(15,23,42,0.92)] text-muted",
    subtle:
      "border-[color:var(--border-subtle)] bg-[rgba(15,23,42,0.86)] text-soft",
  };

  return (
    <span className={`${base} ${styleByVariant[variant]}`}>{children}</span>
  );
}

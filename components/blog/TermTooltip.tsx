"use client";

import type { PropsWithChildren } from "react";

type TermTooltipProps = PropsWithChildren<{
  tip?: string;
}>;

export function TermTooltip({ children, tip }: TermTooltipProps) {
  if (!tip) {
    return <>{children}</>;
  }

  return (
    <span className="md-term-tip" tabIndex={0}>
      <span className="md-term-tip__label">{children}</span>
      <span className="md-term-tip__content" role="tooltip">
        {tip}
      </span>
    </span>
  );
}

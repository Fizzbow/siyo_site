"use client";

import { useEffect, useMemo, useState } from "react";
import { ASCII_CELL_OFF, ASCII_CELL_ON } from "@/lib/ascii-ramp";

const COLS = 42;
const ROWS = 18;

function isFilledCell(x: number, y: number, frame: number) {
  const cx = COLS / 2 - 0.5;
  const cy = ROWS / 2 - 0.5;
  const dx = x - cx;
  const dy = y - cy;
  const pulse = Math.sin(frame * 0.12) * 0.65;

  const outerDiamond = Math.abs(dx) / (17.5 + pulse) + Math.abs(dy) / 7.2 <= 1;
  const innerDiamond = Math.abs(dx) / 7.2 + Math.abs(dy) / 3.05 <= 1;
  const horizontalCore = Math.abs(dy) <= 1 && Math.abs(dx) <= 13;
  const verticalCore = Math.abs(dx) <= 1 && Math.abs(dy) <= 6;

  return outerDiamond && !(innerDiamond && !horizontalCore && !verticalCore);
}

function renderBrailleFrame(frame: number) {
  const lines: string[] = [];

  for (let y = 0; y < ROWS; y += 1) {
    let line = "";

    for (let x = 0; x < COLS; x += 1) {
      line += isFilledCell(x, y, frame) ? ASCII_CELL_ON : ASCII_CELL_OFF;
    }

    lines.push(line);
  }

  return lines.join("\n");
}

export function BrailleQuestionBlock() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let animationId = 0;
    let lastTick = 0;

    const tick = (time: number) => {
      if (time - lastTick > 90) {
        setFrame((current) => current + 1);
        lastTick = time;
      }

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const braille = useMemo(() => renderBrailleFrame(frame), [frame]);

  return (
    <div className="relative w-full max-w-[680px] overflow-hidden rounded-lg border border-fg-4/60 bg-white/70 p-5 dark:bg-fg-5/25">
      <pre
        aria-label="Animated Braille dot matrix question block"
        className="ascii-mono-grid mx-auto w-fit select-none whitespace-pre text-[10px] leading-none text-[#aeb7c6] sm:text-xs"
        style={{
          fontVariantLigatures: "none",
          letterSpacing: 0,
        }}
      >
        {braille}
      </pre>
    </div>
  );
}

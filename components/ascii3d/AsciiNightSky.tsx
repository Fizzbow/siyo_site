"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

const STAR_RAMP = "..:*";
const SCROLL_IDLE_EPSILON = 0.0007;

interface AsciiNightSkyProps {
  progressRef: RefObject<number>;
  isActive: boolean;
}

interface GridSize {
  cols: number;
  rows: number;
}

interface StarCell {
  x: number;
  y: number;
  phase: number;
  base: number;
  shimmer: number;
}

function getGridSize(): GridSize {
  if (typeof window === "undefined") {
    return { cols: 120, rows: 56 };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const charWidth = width < 640 ? 7 : 8;
  const charHeight = width < 640 ? 13 : 14;

  return {
    cols: Math.max(72, Math.min(176, Math.floor(width / charWidth))),
    rows: Math.max(36, Math.min(76, Math.floor(height / charHeight))),
  };
}

function buildStarCells({ cols, rows }: GridSize): StarCell[] {
  const cells: StarCell[] = [];
  const rowStep = 2;
  const colStep = 4;

  for (let y = 2; y < rows - 1; y += rowStep) {
    const rowIndex = Math.floor(y / rowStep);
    const rowOffset = 2;

    for (let x = rowOffset; x < cols; x += colStep) {
      const columnIndex = Math.floor((x - rowOffset) / colStep);
      const brightCell =
        columnIndex % 17 === 0 ||
        (rowIndex % 9 === 0 && columnIndex % 7 === 0);
      const midCell =
        !brightCell &&
        (columnIndex % 7 === 2 || (rowIndex % 5 === 1 && columnIndex % 6 === 3));

      cells.push({
        x,
        y,
        phase: (x * 0.37 + y * 0.61) % (Math.PI * 2),
        base: brightCell ? 0.42 : midCell ? 0.28 : 0.1,
        shimmer: brightCell ? 0.54 : midCell ? 0.4 : 0.24,
      });
    }
  }

  return cells;
}

function chooseStarChar(value: number) {
  const index = Math.max(
    0,
    Math.min(STAR_RAMP.length - 1, Math.floor(value * STAR_RAMP.length))
  );
  return STAR_RAMP[index];
}

function renderSky(
  { cols, rows }: GridSize,
  stars: StarCell[],
  progress: number,
  scrollEnergy: number
) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(" "));

  for (const star of stars) {
    const pulse = (Math.sin(progress * Math.PI * 10 + star.phase) + 1) * 0.5;
    const value = Math.min(0.98, star.base + pulse * star.shimmer * scrollEnergy);

    grid[star.y][star.x] = chooseStarChar(value);
  }

  return grid.map((row) => row.join("")).join("\n");
}

export function AsciiNightSky({ progressRef, isActive }: AsciiNightSkyProps) {
  const [gridSize, setGridSize] = useState<GridSize>(() => getGridSize());
  const preRef = useRef<HTMLPreElement>(null);
  const lastProgressRef = useRef(0);
  const lastTimeRef = useRef(0);
  const prevFrameRef = useRef("");
  const rafRef = useRef(0);
  const scrollEnergyRef = useRef(0);

  const stars = useMemo(() => buildStarCells(gridSize), [gridSize]);

  useEffect(() => {
    let resizeRaf = 0;

    const onResize = () => {
      if (resizeRaf !== 0) {
        return;
      }

      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0;
        setGridSize(getGridSize());
      });
    };

    window.addEventListener("resize", onResize);
    return () => {
      if (resizeRaf !== 0) {
        window.cancelAnimationFrame(resizeRaf);
      }
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let idleFrames = 0;

    const tick = (now: number) => {
      const progress = progressRef.current;
      const deltaProgress = Math.abs(progress - lastProgressRef.current);
      const deltaTime = lastTimeRef.current
        ? Math.max(16, now - lastTimeRef.current)
        : 16;
      const velocity = deltaProgress / (deltaTime / 1000);

      lastProgressRef.current = progress;
      lastTimeRef.current = now;

      if (deltaProgress > SCROLL_IDLE_EPSILON) {
        scrollEnergyRef.current = Math.max(
          scrollEnergyRef.current,
          Math.min(1, velocity * 0.72)
        );
        idleFrames = 0;
      } else {
        scrollEnergyRef.current *= 0.72;
        idleFrames += 1;
      }

      const frame = renderSky(
        gridSize,
        stars,
        progress,
        reducedMotion ? 0 : scrollEnergyRef.current
      );

      if (preRef.current && frame !== prevFrameRef.current) {
        preRef.current.textContent = frame;
        prevFrameRef.current = frame;
      }

      const isSettled = idleFrames > 6 && scrollEnergyRef.current < 0.015;
      if (isActive && !isSettled) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
      }
    };

    rafRef.current = window.requestAnimationFrame(tick);

    const wake = () => {
      scrollEnergyRef.current = Math.max(scrollEnergyRef.current, 0.85);
      if (rafRef.current === 0) {
        lastTimeRef.current = 0;
        rafRef.current = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener("scroll", wake, { passive: true });

    return () => {
      if (rafRef.current !== 0) {
        window.cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = 0;
      window.removeEventListener("scroll", wake);
    };
  }, [gridSize, isActive, progressRef, stars]);

  return (
    <div className="ascii-night-sky absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <pre ref={preRef} className="ascii-night-sky__stars" />
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ASCII_CELL_OFF, ASCII_CELL_ON } from "@/lib/ascii-ramp";

/**
 * NES SMB1 Small Mario sprite frames (facing right, 12×16 each).
 * Traced from the official sprite sheet (asset/50365).
 * All frames preserve: prominent nose (face row extends 1px past cap body),
 * hat brim (row 2 extends right past forehead), consistent head shape.
 */

/** Frame 0 – Standing idle */
const MARIO_FRAME_0 = [
  ".....XXX....",
  "...XXXXXXXX.",
  "...XXXX.XXXX",
  "..XXXXXXXXXX",
  "..XXXXXXXXX.",
  "...XXXXX....",
  "..XXXXXXXXX.",
  ".XXXXXXXXXXX",
  "XXXXXXXXXXXX",
  "XX.XXXXXXX.X",
  "...XXXXXXXX.",
  "..XXXXXXXXXX",
  "..XXXX..XXXX",
  ".XXXXX..XXXX",
  "............",
  "............",
];

/** Frame 1 – Walking / transition (one leg forward) */
const MARIO_FRAME_1 = [
  ".....XXX....",
  "...XXXXXXXX.",
  "...XXXX.XXXX",
  "..XXXXXXXXXX",
  "..XXXXXXXXX.",
  "...XXXXX....",
  ".XXXXXXXXXX.",
  "XXXXXXXXXXXX",
  ".XXXXXXXXXXX",
  ".XX.XXXXXX..",
  "...XXXXXXXX.",
  "..XXXXXXXXX.",
  "..XXXXXXX...",
  "...XXXXX....",
  "..XXXX......",
  "............",
];

/** Frame 2 – Running / stride (leg extended back) */
const MARIO_FRAME_2 = [
  ".....XXX....",
  "...XXXXXXXX.",
  "...XXXX.XXXX",
  "..XXXXXXXXXX",
  "..XXXXXXXXX.",
  "...XXXXX....",
  "..XXXXXXXXX.",
  ".XXXXXXXXXXX",
  "XXXXXXXXXXXX",
  "XX.XXXXXXX..",
  "...XXXXXXX..",
  "..XXXXXXXXX.",
  ".XXXX..XXXX.",
  "XXXX....XXX.",
  ".XX.........",
  "............",
];

/** Frame 3 – Jumping with fist raised (hitting block from below) */
const MARIO_FRAME_3 = [
  "........XX..",
  ".......XXX..",
  "....XXXXXXXX",
  "...XXXXXXXX.",
  "...XXXX.XXXX",
  "..XXXXXXXXXX",
  "..XXXXXXXXX.",
  "...XXXXXXX..",
  "..XXXXXXXXX.",
  ".XXXXXXXXXXX",
  ".X..XXXXX..X",
  "...XXXXXXX..",
  "....XX.XX...",
  "...XXX.XXX..",
  "............",
  "............",
];

const MARIO_FRAMES = [MARIO_FRAME_0, MARIO_FRAME_1, MARIO_FRAME_2, MARIO_FRAME_3];

/** NES SMB1 Question Block – 16×16 with ? pattern. */
const QUESTION_BLOCK = [
  "XXXXXXXXXXXXXXXX",
  "X..............X",
  "X.XXXXXXXXXXXX.X",
  "X.X..........X.X",
  "X.X....XX....X.X",
  "X.X...XXXX...X.X",
  "X.X..XX..XX..X.X",
  "X.X......XX..X.X",
  "X.X.....XX...X.X",
  "X.X....XX....X.X",
  "X.X....XX....X.X",
  "X.X..........X.X",
  "X.X....XX....X.X",
  "X.X..........X.X",
  "X.XXXXXXXXXXXX.X",
  "XXXXXXXXXXXXXXXX",
];

/** Used/empty block after being hit – 16×16. */
const USED_BLOCK = [
  "XXXXXXXXXXXXXXXX",
  "X..............X",
  "X..............X",
  "X..............X",
  "X..............X",
  "X..............X",
  "X..............X",
  "X..............X",
  "X..............X",
  "X..............X",
  "X..............X",
  "X..............X",
  "X..............X",
  "X..............X",
  "X..............X",
  "XXXXXXXXXXXXXXXX",
];

/** Coin rotation frames – 8×8 each. */
const COIN_FRAMES = [
  [
    "..XXXX..",
    ".XXXXXX.",
    ".XX..XX.",
    ".XX..XX.",
    ".XX..XX.",
    ".XX..XX.",
    ".XXXXXX.",
    "..XXXX..",
  ],
  [
    "...XX...",
    "..XXXX..",
    "..X..X..",
    "..X..X..",
    "..X..X..",
    "..X..X..",
    "..XXXX..",
    "...XX...",
  ],
  [
    "....X...",
    "...XX...",
    "...XX...",
    "...XX...",
    "...XX...",
    "...XX...",
    "...XX...",
    "....X...",
  ],
  [
    "...XX...",
    "..XXXX..",
    "..X..X..",
    "..X..X..",
    "..X..X..",
    "..X..X..",
    "..XXXX..",
    "...XX...",
  ],
];

const GRID_COLS = 34;
const GRID_ROWS = 48;

const BLOCK_X = 9;
const BLOCK_Y = 6;
const BLOCK_H = 16;

const MARIO_X = 11;
const MARIO_GROUND_Y = 30;

const COIN_X = 13;
const COIN_H = 8;

const MARIO_CONTACT_Y = BLOCK_Y + BLOCK_H;

type AnimState = "idle" | "jump" | "hit" | "fall" | "coin" | "used";

interface Anim {
  state: AnimState;
  tick: number;
  blockOffY: number;
  marioY: number;
  marioVel: number;
  coinY: number;
  coinVel: number;
  coinFrame: number;
  coinVisible: boolean;
  blink: boolean;
}

function stampSprite(
  grid: boolean[][],
  sprite: string[],
  ox: number,
  oy: number
) {
  for (let r = 0; r < sprite.length; r++) {
    const row = sprite[r];
    const gy = Math.round(oy) + r;
    if (gy < 0 || gy >= GRID_ROWS) continue;
    for (let c = 0; c < row.length; c++) {
      if (row[c] === ".") continue;
      const gx = ox + c;
      if (gx < 0 || gx >= GRID_COLS) continue;
      grid[gy][gx] = true;
    }
  }
}

function gridToString(grid: boolean[][]): string {
  const lines: string[] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    let line = "";
    for (let c = 0; c < GRID_COLS; c++) {
      line += grid[r][c] ? ASCII_CELL_ON : ASCII_CELL_OFF;
    }
    lines.push(line);
  }
  return lines.join("\n");
}

function createGrid(): boolean[][] {
  return Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => false)
  );
}

function getMarioFrame(a: Anim): string[] {
  switch (a.state) {
    case "idle":
      return MARIO_FRAMES[0];
    case "jump": {
      const jumpProgress = Math.min(
        (MARIO_GROUND_Y - a.marioY) / (MARIO_GROUND_Y - MARIO_CONTACT_Y),
        1
      );
      if (jumpProgress < 0.3) return MARIO_FRAMES[1];
      if (jumpProgress < 0.7) return MARIO_FRAMES[2];
      return MARIO_FRAMES[3];
    }
    case "hit":
      return MARIO_FRAMES[3];
    case "fall": {
      const fallProgress = Math.min(
        (a.marioY - MARIO_CONTACT_Y) / (MARIO_GROUND_Y - MARIO_CONTACT_Y),
        1
      );
      if (fallProgress < 0.4) return MARIO_FRAMES[3];
      if (fallProgress < 0.7) return MARIO_FRAMES[2];
      return MARIO_FRAMES[1];
    }
    case "coin":
    case "used":
      return MARIO_FRAMES[0];
    default:
      return MARIO_FRAMES[0];
  }
}

function renderFrame(a: Anim): string {
  const grid = createGrid();

  const blockSprite = a.state === "used" ? USED_BLOCK : QUESTION_BLOCK;
  stampSprite(grid, blockSprite, BLOCK_X, BLOCK_Y + a.blockOffY);

  const marioSprite = getMarioFrame(a);
  stampSprite(grid, marioSprite, MARIO_X, a.marioY);

  if (a.coinVisible) {
    const coinSprite = COIN_FRAMES[a.coinFrame % 4];
    stampSprite(grid, coinSprite, COIN_X, BLOCK_Y - COIN_H + a.coinY);
  }

  return gridToString(grid);
}

const INITIAL_ANIM: Anim = {
  state: "idle",
  tick: 0,
  blockOffY: 0,
  marioY: MARIO_GROUND_Y,
  marioVel: 0,
  coinY: 0,
  coinVel: 0,
  coinFrame: 0,
  coinVisible: false,
  blink: false,
};

export function MarioCoinBlock() {
  const [output, setOutput] = useState(() => renderFrame(INITIAL_ANIM));
  const animRef = useRef<Anim>({
    state: "idle",
    tick: 0,
    blockOffY: 0,
    marioY: MARIO_GROUND_Y,
    marioVel: 0,
    coinY: 0,
    coinVel: 0,
    coinFrame: 0,
    coinVisible: false,
    blink: false,
  });
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const tickRef = useRef<(time: number) => void>(() => {});

  const render = useCallback(() => renderFrame(animRef.current), []);

  const tick = useCallback(
    (time: number) => {
      const dt =
        lastTimeRef.current === 0
          ? 0
          : Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      const a = animRef.current;
      a.tick += dt;

      switch (a.state) {
        case "idle": {
          a.blink = Math.sin(a.tick * 6) > 0.3;
          a.marioY = MARIO_GROUND_Y;
          a.blockOffY = 0;
          break;
        }
        case "jump": {
          a.marioVel += 52 * dt;
          a.marioY += a.marioVel * dt;

          if (a.marioY <= MARIO_CONTACT_Y) {
            a.marioY = MARIO_CONTACT_Y;
            a.state = "hit";
            a.tick = 0;
            a.coinVel = -14;
            a.coinY = 0;
            a.coinVisible = true;
            a.coinFrame = 0;
          }
          break;
        }
        case "hit": {
          const phase = a.tick / 0.22;
          a.blockOffY = Math.round(
            -3 * Math.sin(Math.min(phase, 1) * Math.PI)
          );
          a.marioY = MARIO_CONTACT_Y;

          a.coinVel += 28 * dt;
          a.coinY += a.coinVel * dt;
          a.coinFrame = Math.floor(a.tick * 14) % 4;

          if (a.tick >= 0.22) {
            a.state = "fall";
            a.tick = 0;
            a.blockOffY = 0;
            a.marioVel = 2;
          }
          break;
        }
        case "fall": {
          a.marioVel += 52 * dt;
          a.marioY += a.marioVel * dt;

          a.coinVel += 28 * dt;
          a.coinY += a.coinVel * dt;
          a.coinFrame = Math.floor((a.tick + 0.22) * 14) % 4;

          if (a.coinY > 4) {
            a.coinVisible = false;
          }

          if (a.marioY >= MARIO_GROUND_Y) {
            a.marioY = MARIO_GROUND_Y;
            a.state = "coin";
            a.tick = 0;
          }
          break;
        }
        case "coin": {
          a.coinVel += 28 * dt;
          a.coinY += a.coinVel * dt;
          a.coinFrame = Math.floor((a.tick + 0.44) * 14) % 4;
          a.marioY = MARIO_GROUND_Y;

          if (a.coinY > 4) a.coinVisible = false;

          if (a.tick >= 0.6) {
            a.state = "used";
            a.tick = 0;
            a.coinVisible = false;
          }
          break;
        }
        case "used": {
          a.marioY = MARIO_GROUND_Y;
          break;
        }
      }

      setOutput(render());
      rafRef.current = requestAnimationFrame(tickRef.current);
    },
    [render]
  );

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tickRef.current);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const handleClick = useCallback(() => {
    const a = animRef.current;
    if (a.state === "idle") {
      a.state = "jump";
      a.tick = 0;
      a.marioVel = -32;
      a.coinVisible = false;
      a.coinY = 0;
    } else if (a.state === "used") {
      a.state = "idle";
      a.tick = 0;
      a.marioY = MARIO_GROUND_Y;
      a.coinVisible = false;
      a.blockOffY = 0;
      lastTimeRef.current = 0;
    }
  }, []);

  return (
    <div
      className="relative w-full max-w-[680px] cursor-pointer overflow-hidden rounded-lg border border-fg-4/60 bg-white/70 p-4 dark:bg-fg-5/25"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <pre
        aria-label="马里奥顶问号砖 Braille ASCII 动画"
        className="ascii-mono-grid mx-auto w-fit select-none whitespace-pre text-[10px] leading-none text-[#aeb7c6] sm:text-xs"
      >
        {output}
      </pre>
      <p className="mt-3 text-center text-xs text-fg-3">
        点击 — 马里奥跳起顶砖；空砖后再次点击重置
      </p>
    </div>
  );
}

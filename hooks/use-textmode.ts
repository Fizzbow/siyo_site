"use client";

import { useEffect, useRef, type RefObject } from "react";

import { loadTextmode, type TextmodeModule } from "@/lib/load-textmode";
import type { Textmodifier } from "textmode.js";

export interface UseTextmodeContext {
  api: TextmodeModule;
  textmode: TextmodeModule["textmode"];
  canvas: HTMLCanvasElement;
}

export type TextmodeSetupResult =
  | void
  | Textmodifier
  | { destroy?: () => void }
  | (() => void);

export type UseTextmodeSetup = (
  context: UseTextmodeContext
) => TextmodeSetupResult | Promise<TextmodeSetupResult>;

function normalizeCleanup(result: TextmodeSetupResult): (() => void) | undefined {
  if (!result) {
    return undefined;
  }

  if (typeof result === "function") {
    return result;
  }

  if (typeof result.destroy === "function") {
    return () => result.destroy?.();
  }

  return undefined;
}

export function useTextmode(
  setup: UseTextmodeSetup
): RefObject<HTMLCanvasElement | null> {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void loadTextmode()
      .then(async (api) => {
        const canvas = canvasRef.current;
        if (cancelled || !canvas) {
          return;
        }

        const result = await setup({
          api,
          textmode: api.textmode,
          canvas,
        });
        const nextCleanup = normalizeCleanup(result);

        if (cancelled) {
          nextCleanup?.();
          return;
        }

        cleanup = nextCleanup;
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Failed to initialize textmode.js", error);
        }
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [setup]);

  return canvasRef;
}

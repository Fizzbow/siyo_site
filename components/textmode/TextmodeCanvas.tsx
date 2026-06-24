"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
} from "react";

import {
  useTextmode,
  type UseTextmodeContext,
} from "@/hooks/use-textmode";
import { cn } from "@/lib/utils";
import type { TextmodeOptions, Textmodifier } from "textmode.js";

export type TextmodeCanvasContext = UseTextmodeContext;

export interface TextmodeCanvasProps
  extends Omit<ComponentPropsWithoutRef<"canvas">, "children" | "height" | "width"> {
  width?: number;
  height?: number;
  fontSize?: number;
  frameRate?: number;
  options?: Omit<
    TextmodeOptions,
    "canvas" | "fontSize" | "frameRate" | "height" | "width"
  >;
  setup?: (
    textmodifier: Textmodifier,
    context: TextmodeCanvasContext
  ) => void | Promise<void>;
  draw: (textmodifier: Textmodifier, context: TextmodeCanvasContext) => void;
}

export function TextmodeCanvas({
  className,
  draw,
  fontSize,
  frameRate,
  height = 600,
  options,
  setup,
  width = 800,
  ...canvasProps
}: TextmodeCanvasProps) {
  const drawRef = useRef(draw);
  const setupRef = useRef(setup);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    setupRef.current = setup;
  }, [setup]);

  const initialize = useCallback(
    (context: UseTextmodeContext) => {
      const textmodeOptions: TextmodeOptions = {
        ...options,
        canvas: context.canvas,
        height,
        width,
      };

      if (fontSize !== undefined) {
        textmodeOptions.fontSize = fontSize;
      }

      if (frameRate !== undefined) {
        textmodeOptions.frameRate = frameRate;
      }

      const textmodifier = context.textmode.create(textmodeOptions);

      if (setupRef.current) {
        void textmodifier.setup(() => setupRef.current?.(textmodifier, context));
      }

      textmodifier.draw(() => {
        drawRef.current(textmodifier, context);
      });

      return textmodifier;
    },
    [fontSize, frameRate, height, options, width]
  );

  const canvasRef = useTextmode(initialize);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={cn("block", className)}
      {...canvasProps}
    />
  );
}

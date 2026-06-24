export type TextmodeModule = typeof import("textmode.js");

let cachedTextmode: Promise<TextmodeModule> | null = null;

export function loadTextmode(): Promise<TextmodeModule> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("textmode.js can only be loaded in a browser environment."),
    );
  }

  if (typeof WebGL2RenderingContext === "undefined") {
    return Promise.reject(
      new Error("textmode.js requires WebGL2RenderingContext support."),
    );
  }

  cachedTextmode ??= import("textmode.js");
  return cachedTextmode;
}

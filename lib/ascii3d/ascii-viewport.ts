/** Square AsciiEffect buffer inside a rectangular sticky viewport. */
export function getAsciiSquareSize(viewportWidth: number, viewportHeight: number) {
  return Math.min(viewportWidth, viewportHeight);
}

/** Paul Bourke: monospace cells are taller than wide — used for CSS compensation. */
export function measureFontCellAspect(
  font = "12px JetBrains Mono, ui-monospace, monospace"
): { cellWidth: number; cellHeight: number; heightOverWidth: number } {
  if (typeof document === "undefined") {
    return { cellWidth: 7, cellHeight: 12, heightOverWidth: 12 / 7 };
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { cellWidth: 7, cellHeight: 12, heightOverWidth: 12 / 7 };
  }

  ctx.font = font;
  const cellWidth = ctx.measureText("M").width;
  const cellHeight = parseInt(ctx.font, 10) * 1.2 || 12;

  return {
    cellWidth,
    cellHeight,
    heightOverWidth: cellHeight / cellWidth,
  };
}

export type TopRowTrimResult = {
  row0FilledBefore: number;
  row0FilledAfter: number;
  refRow: number;
  refFirstCol: number;
  refLastCol: number;
  trimmedRows: number[];
  firstInkRow: number;
  hornProtrusions: {
    row: number;
    extendsLeft: boolean;
    extendsRight: boolean;
    curFirst: number;
    curLast: number;
    refFirst: number;
    refLast: number;
  }[];
  inkRowIndices: number[];
};

function lineToChars(line: string): string[] {
  const chars: string[] = [];
  for (let i = 0; i < line.length; ) {
    if (line.startsWith("&nbsp;", i)) {
      chars.push(" ");
      i += 6;
      continue;
    }
    chars.push(line[i] ?? " ");
    i += 1;
  }
  return chars;
}

function charsToLine(chars: string[]): string {
  return chars
    .map((c) => (c === " " ? "&nbsp;" : c === "." ? "." : c))
    .join("");
}

function firstLastFilledCol(
  chars: string[],
): { first: number; last: number } | null {
  let first = -1;
  let last = -1;
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === " ") continue;
    if (first < 0) first = i;
    last = i;
  }
  if (first < 0 || last < 0) return null;
  return { first, last };
}

function findFirstInkRow(lines: string[]): number {
  for (let i = 0; i < lines.length; i++) {
    if (firstLastFilledCol(lineToChars(lines[i] ?? ""))) return i;
  }
  return -1;
}

function listInkRowIndices(lines: string[], maxRows?: number): number[] {
  const indices: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (firstLastFilledCol(lineToChars(lines[i] ?? ""))) {
      indices.push(i);
      if (maxRows !== undefined && indices.length >= maxRows) break;
    }
  }
  return indices;
}

/** First ink row is often a flat 3D top-cap shelf (YYYY____); drop it when it sticks out. */
function shouldCullTopCapShelf(
  cur: { first: number; last: number },
  next: { first: number; last: number },
): boolean {
  if (cur.first === next.first && cur.last === next.last) return true;
  const curSpan = cur.last - cur.first;
  const nextSpan = next.last - next.first;
  if (cur.first < next.first || cur.last > next.last) return true;
  if (curSpan + 2 < nextSpan) return true;
  return false;
}

function intersectionBounds(
  bounds: { first: number; last: number }[],
): { first: number; last: number } | null {
  if (bounds.length === 0) return null;
  let first = bounds[0].first;
  let last = bounds[0].last;
  for (let i = 1; i < bounds.length; i++) {
    first = Math.max(first, bounds[i].first);
    last = Math.min(last, bounds[i].last);
  }
  if (first > last) return null;
  return { first, last };
}

function clipRowToBounds(
  lines: string[],
  rowIdx: number,
  ref: { first: number; last: number },
): { filledBefore: number; filledAfter: number; trimmed: number } {
  const top = lineToChars(lines[rowIdx] ?? "");
  let filledBefore = 0;
  let filledAfter = 0;
  let trimmed = 0;

  for (let i = 0; i < top.length; i++) {
    if (top[i] !== " ") filledBefore += 1;
    if (i < ref.first || i > ref.last) {
      if (top[i] !== " ") trimmed += 1;
      top[i] = " ";
    } else if (top[i] !== " ") {
      filledAfter += 1;
    }
  }

  if (trimmed > 0) {
    lines[rowIdx] = charsToLine(top);
  }

  return { filledBefore, filledAfter, trimmed };
}

/**
 * Clip top-cap shelf rows to the intersection of the next few dome rows.
 */
export function trimTopRowOverflow(lines: string[]): TopRowTrimResult | null {
  if (lines.length < 4) return null;

  let inkRows = listInkRowIndices(lines, 12);
  if (inkRows.length < 4) return null;

  const trimmedRows: number[] = [];
  const culledTopRows: number[] = [];
  const hornProtrusions: TopRowTrimResult["hornProtrusions"] = [];
  let totalFilledBefore = 0;
  let totalFilledAfter = 0;
  let culledFilled = 0;
  let refRow = -1;
  let refFirstCol = 0;
  let refLastCol = 0;

  for (let pass = 0; pass < 2; pass++) {
    if (inkRows.length < 2) break;
    const topIdx = inkRows[0];
    const nextIdx = inkRows[1];
    const curBounds = firstLastFilledCol(lineToChars(lines[topIdx] ?? ""));
    const nextBounds = firstLastFilledCol(lineToChars(lines[nextIdx] ?? ""));
    if (
      !curBounds ||
      !nextBounds ||
      !shouldCullTopCapShelf(curBounds, nextBounds)
    ) {
      break;
    }
    const chars = lineToChars(lines[topIdx] ?? "");
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] !== " ") culledFilled += 1;
      chars[i] = " ";
    }
    lines[topIdx] = charsToLine(chars);
    culledTopRows.push(topIdx);
    inkRows = listInkRowIndices(lines, 12);
  }

  const TOP_SHELF_INK_ROWS = 4;
  const REF_INK_OFFSET = 2;
  const REF_INK_ROWS_BELOW = 4;

  for (
    let i = 0;
    i < Math.min(TOP_SHELF_INK_ROWS, inkRows.length - REF_INK_OFFSET - 1);
    i++
  ) {
    const topIdx = inkRows[i];
    const curBounds = firstLastFilledCol(lineToChars(lines[topIdx] ?? ""));
    if (!curBounds) continue;

    const belowBounds: { first: number; last: number }[] = [];
    const refStart = i === 0 ? 1 : REF_INK_OFFSET;
    for (let j = refStart; j < refStart + REF_INK_ROWS_BELOW; j++) {
      const belowIdx = inkRows[i + j];
      if (belowIdx === undefined) break;
      const b = firstLastFilledCol(lineToChars(lines[belowIdx] ?? ""));
      if (b) belowBounds.push(b);
    }
    if (belowBounds.length < 2) continue;

    const ref = intersectionBounds(belowBounds);
    if (!ref) continue;

    const curSpan = curBounds.last - curBounds.first;
    const refSpan = ref.last - ref.first;
    const extendsLeft = curBounds.first < ref.first;
    const extendsRight = curBounds.last > ref.last;
    const extendsBeyond = extendsLeft || extendsRight;
    if (extendsBeyond) {
      hornProtrusions.push({
        row: topIdx,
        extendsLeft,
        extendsRight,
        curFirst: curBounds.first,
        curLast: curBounds.last,
        refFirst: ref.first,
        refLast: ref.last,
      });
    }
    if (!extendsBeyond && curSpan <= refSpan) continue;

    const clip = clipRowToBounds(lines, topIdx, ref);
    if (clip.trimmed === 0) continue;

    trimmedRows.push(topIdx);
    totalFilledBefore += clip.filledBefore;
    totalFilledAfter += clip.filledAfter;
    refRow = inkRows[i + 1] ?? topIdx + 1;
    refFirstCol = ref.first;
    refLastCol = ref.last;
  }

  if (trimmedRows.length === 0 && culledTopRows.length === 0) return null;

  return {
    row0FilledBefore: totalFilledBefore + culledFilled,
    row0FilledAfter: totalFilledAfter,
    refRow,
    refFirstCol,
    refLastCol,
    trimmedRows: [...trimmedRows, ...culledTopRows],
    firstInkRow: findFirstInkRow(lines),
    hornProtrusions,
    inkRowIndices: inkRows.slice(0, 8),
  };
}

/** Post-process AsciiEffect `<table>` output (top horn trim only). */
export function postProcessAsciiTable(
  table: HTMLTableElement,
): TopRowTrimResult | null {
  const td = table.querySelector("td");
  if (!td) return null;

  const lines = td.innerHTML.split(/<br\s*\/?>/gi);
  if (lines.length < 4) return null;

  const topTrim = trimTopRowOverflow(lines);
  if (!topTrim) return null;

  td.innerHTML = lines.join("<br/>");
  return topTrim;
}

"use client";

import { TextmodeCanvas } from "@/components/textmode/TextmodeCanvas";

const sprite = [
  "XXXXXXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXX",
  "XXXXXXX......XXXXXXX",
  "XXXXXX........XXXXXX",
  "XXXXXX..XXXX..XXXXXX",
  "XXXXXXXXXXXX..XXXXXX",
  "XXXXXXXXXXX..XXXXXXX",
  "XXXXXXXXXX..XXXXXXXX",
  "XXXXXXXXX..XXXXXXXXX",
  "XXXXXXXX..XXXXXXXXXX",
  "XXXXXXXX..XXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXX",
  "XXXXXXXX..XXXXXXXXXX",
  "XXXXXXXX..XXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXX",
];

const ink = "#aeb7c6";

export function MarioAsciiBlock() {
  return (
    <div className="relative aspect-[4/3] w-full max-w-[680px] overflow-hidden rounded-lg border border-fg-4/60 bg-white/70 dark:bg-fg-5/25">
      <TextmodeCanvas
        aria-label="Animated ASCII pixel block"
        width={480}
        height={360}
        fontSize={8}
        frameRate={30}
        className="h-full w-full"
        draw={(tm) => {
          tm.clear();
          tm.background("#ffffff00");

          const elapsed = tm.secs;
          const bob = Math.sin(elapsed * 4.8) * 1.15;

          tm.push();
          tm.translate(-10, -10 + bob);

          for (let y = 0; y < sprite.length; y += 1) {
            for (let x = 0; x < sprite[y].length; x += 1) {
              const key = sprite[y][x];
              if (key === ".") {
                continue;
              }

              tm.push();
              tm.translate(x, y);
              tm.char(" ");
              tm.charColor("#ffffff00");
              tm.cellColor(ink);
              tm.rect(1, 1);
              tm.pop();
            }
          }

          tm.pop();
        }}
      />
    </div>
  );
}

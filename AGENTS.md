# AGENTS.md

## Safety

- 永远不要使用 `rm -rf` 来删除所有文件。

## ASCII

### Rendering

- For ASCII-style animation experiments, keep a dedicated test page instead of placing prototypes directly on the homepage.
- Prefer stable character-grid rendering over stretched canvas output when the visual relies on exact character alignment.
- For text-based ASCII art, render with a `<pre>` and preserve whitespace.
- Keep `fontVariantLigatures: "none"` and `letterSpacing: 0` for ASCII grids.
- Use a font stack appropriate to the chosen character set instead of relying on the browser default.
- When using canvas/textmode rendering, keep the canvas intrinsic dimensions and CSS aspect ratio aligned to avoid horizontal or vertical distortion.
- For pixel-block experiments, use fixed logical grids and avoid compensating with non-square cells unless the distortion has been measured and is intentional.

### Greyscale character ramps

Source: [Paul Bourke — Character representation of grey scale images](https://paulbourke.net/dataformats/asciiart/) (1997).

- Map pixel luminance to characters along a fixed ramp from dark to light. Characters at the start of the ramp represent darker tones; characters at the end represent lighter tones.
- For full-range greyscale output, use Paul Bourke’s standard ramp (black → white):

  `" $@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. "`

- For roughly 10 grey levels, prefer the shorter ramp:

  `" .:-=+*#%@"`

- Index into the ramp by scaling each sample to `0 … ramp.length - 1` (for example `Math.floor(luma * (ramp.length - 1))` with `luma` in `0 … 1`).
- Expect uneven perceived density across fonts: the same ramp can look banded or patchy when glyph weights differ between typefaces. Pick one monospace font for generation and preview, and re-check on target platforms.
- Compensate for non-square character cells: terminal and UI fonts are usually taller than wide, so a 1:1 pixel grid mapped 1:1 to characters stretches the image vertically.
  - If the font aspect ratio is unknown, sample the source image at half the rate in the vertical direction relative to horizontal (Paul Bourke’s common practice).
  - If the font’s width-to-height ratio is known, scale horizontal and vertical sampling so each output cell matches the intended visual aspect ratio.
- When converting photographs or continuous-tone art, treat ASCII output as a downsampled luminance field: choose output columns/rows first, then average or point-sample source pixels into each cell before ramp lookup.

### Dense grids (sprites and dot matrices)

Follow [Paul Bourke](https://paulbourke.net/dataformats/asciiart/) for character choice and sampling; do not build a parallel scheme from Braille `charCode` values.

- Pick on/off (or grey) symbols from ### Greyscale character ramps by apparent ink density, not from the Braille Unicode block (`U+2800`–`U+28FF`).
- For binary grids, map dark/filled samples to the dark end of the ramp and light/empty samples to the light end. With the 10-level ramp `" .:-=+*#%@"`, use `@` for on and leading space for off (see `lib/ascii-ramp.ts`).
- Do not use `String.fromCharCode(0x28ff)`, partial Braille dots (`⠁`, `⣇`, …), or `⠀` (`U+2800`) for sprite or greyscale output unless you are deliberately working in real Braille typography—not ASCII density art.
- Do not pad blanks with two ASCII spaces to mimic Braille cell width; one ramp character is one grid sample.
- Use a monospace font stack (for example `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`) and validate density on target platforms—glyph weight varies between typefaces (Paul Bourke).
- Compensate for tall character cells: when the font aspect ratio is unknown, sample or step the logical grid at half the rate vertically relative to horizontal; when the ratio is known, scale both axes to preserve intended proportions.
- Prefer `<pre>` rendering with `fontVariantLigatures: "none"` and `letterSpacing: 0` (see ### Rendering).

### Glossary (ASCII on the web)

Use this section when reviewing reference sites, reading minified source, or choosing an implementation. Terms are ordered roughly from “display hardware” down to “code mechanics.”

| Term | Meaning |
|------|---------|
| **CRT** | Cathode-ray tube display (old TV / green-terminal look). On the web it usually means **CSS mimicry**: barrel distortion, scanlines, vignette—not real CRT hardware. Applied on top of ASCII/text, not a separate rendering engine. |
| **Monospace** | A font where every glyph has the **same advance width** (`i` = `W`). Required for column-aligned ASCII grids. Examples: JetBrains Mono, Source Code Pro, system `ui-monospace`. |
| **ASCII art** | Images or logos built from text characters (`/\_|#@`, etc.), not bitmap/SVG shapes. Each character is both content and a “pixel.” |
| **Character ramp** | Ordered string of glyphs from dark to light (e.g. `" .:-=+*#%@"`). Map luminance → index → character. See ### Greyscale character ramps. |
| **ASCII atlas** | Pre-authored **bank of character strings** (rows/columns of glyphs) sampled by animation logic—not necessarily a PNG texture file. The “warehouse” of characters to display. |
| **Character grid** | Fixed `rows × cols` logical layout; one character per cell. Prefer `<pre>` + monospace here (this repo’s default). |
| **WebGL** | Browser API for GPU drawing (3D, shaders, render targets). Used by bierman.io and tempo.xyz; **not** used by Midjourney’s hero ASCII (per public analysis). |
| **Three.js** | JS library on top of WebGL (scene, camera, meshes, loaders). |
| **Shader** | GPU program (vertex/fragment) that colors each pixel. tempo.xyz uses a **custom fragment shader** that samples a texture; different from Three.js `AsciiEffect`. |
| **AsciiEffect** | Three.js example addon: render 3D to a buffer, downsample, map brightness → characters, output as **HTML `<table>`** of spans. Used on bierman.io. |
| **Render target** | Off-screen texture/buffer you draw into first, then use as `uniform sampler2D` input (tempo.xyz `TextScene` → shape shader). |
| **Morph targets** | Blend shapes on a 3D mesh (e.g. `Square`, `Square_Flat` on tempo’s `shape.glb`). |
| **SVG `<text>`** | Vector text nodes in the DOM; good for per-line updates, weaker for huge stable grids vs `<pre>`. Midjourney-style backgrounds often use many `<text>` rows. |
| **`<pre>`** | HTML block that preserves spaces/newlines; best for **stable, large** character grids in this project. |
| **requestAnimationFrame (rAF)** | Browser hook: run a function on the next display refresh (~60 Hz). Standard loop for procedural ASCII animation. |
| **Minified code** | Production JS squeezed to few lines with short names (`K`, `T`). Hard to read; use DevTools breakpoints / community write-ups to infer behavior. |
| **charCode / charCodeAt** | Numeric code for a character (`'A'` → 65). Enables **numeric interpolation** between glyphs. |
| **Interpolation** | Smooth blend from value A to B (0%→100%). **charCode interpolation**: tween between character codes so glyphs appear to morph/scramble before settling. |
| **Polar / swirl mapping** | Map grid `(x, y)` through `sin`, `cos`, `sqrt`, time → sample index into an atlas (Midjourney background motion). |
| **DOM thrashing** | Updating thousands of DOM text nodes per frame; can be heavy. Prefer one `<pre>` or one canvas when possible. |
| **Braille cells** | Unicode Braille block for dot typography—not the same as ASCII density art. See workspace Braille rules when using `Apple Braille` / `⣿`; do not confuse with Paul Bourke ramps. |

### Reference site patterns (production)

When asked how a famous site does ASCII, compare against these three **documented** patterns. Do not assume all “ASCII homepages” share one stack.

#### bierman.io — 3D logo + Three.js `AsciiEffect`

- **Stack**: Vanilla ES modules, Three.js, `AsciiEffect`, `GLTFLoader` + Draco (`logo.glb`).
- **Pipeline**: WebGL renders a 3D logo → effect downsamples framebuffer → brightness picks glyphs from charset (e.g. `".:-+*=%@#&"`, `invert: true`) → DOM **`<table>`** + monospace (Source Code Pro).
- **Interaction**: Mouse parallax rotation; mobile gyro via `DeviceOrientationControls`; renders only when scrolling/mouse moves (performance).
- **Not**: `<pre>`, Braille, image-to-ASCII library, or fragment-shader ASCII.
- **Fit for**: Rotating 3D mark, hover/gyro, “terminal portrait” of a mesh.

#### tempo.xyz — 3D ribbons + custom shader (not `AsciiEffect`)

- **Stack**: Astro, fullscreen `<canvas id="gl">`, Three.js, GSAP ScrollTrigger, Lenis; desktop ≥1024px only.
- **Assets**: `shape.glb` (morph targets), `uv.jpg`, `tempo.glb` (letter morphs in `TextScene`).
- **Pipeline**: `TextScene` renders content to a **render-target texture** → each of ~13 stacked meshes samples `uTexture` in a **custom fragment shader** (`texture2D(...).r` as mask, highlight uniforms) → scroll drives morph, twist, opacity.
- **Not**: `AsciiEffect`, `<pre>` grid, or static figlet file for the hero.
- **Fit for**: Scroll-synced 3D art direction, brand shader look, fixed right-side hero column.

#### midjourney.com/home — 2D procedural SVG text + CRT CSS

- **Stack**: Client bundle + React; **JetBrains Mono**; no WebGL for hero ASCII (per network/DOM analysis and [SO #76426202](https://stackoverflow.com/questions/76426202/how-does-the-ascii-art-on-the-midjourney-home-page-work)).
- **Pipeline**: Pre-authored **character atlas** (string matrix) + `requestAnimationFrame` → polar/swirl math picks per-cell glyph → many **SVG `<text>`** rows updated via `textContent` → center **block-letter logo** (figlet-style) unscrambles via **charCode interpolation** + `fill-opacity` → **CRT** look via CSS (scanlines, barrel distortion, dark violet palette).
- **Not**: Three.js, canvas `fillText` atlas from photos, or real-time photo-to-ASCII for the hero.
- **Fit for**: Full-viewport “terminal void,” logo reveal from noise, no 3D dependency; watch DOM cost at high row counts.

#### Quick comparison

| | bierman.io | tempo.xyz | midjourney.com |
|--|------------|-----------|----------------|
| 3D | Yes (GLB) | Yes (GLB + shader) | No (2D math) |
| ASCII mechanism | Post-process (`AsciiEffect`) | Shader samples texture | Atlas + SVG text |
| Output DOM | `<table>` | `<canvas>` | SVG `<text>` (+ CSS CRT) |
| This repo’s closest match | Canvas/textmode experiments | Shader/canvas path | `<pre>` grid + CSS (not SVG rows) |

### Skills: choose an implementation

Apply these when planning a new ASCII feature in **this** repo.

#### Skill — Pick a rendering path

1. **Stable grid / Mario blocks / Braille tests** → `<pre>` + monospace + rules in ### Rendering and ### Dense grids. Dedicated `/ascii` (or similar) test page, not the homepage.
2. **Rotating 3D brand object as ASCII** → Three.js + `AsciiEffect` (bierman pattern); tune `resolution`, charset, `invert`; expect heavy DOM table from the effect.
3. **Scroll-driven 3D + custom look** → WebGL + custom shader sampling a texture (tempo pattern); not `AsciiEffect` unless you explicitly want table-based output.
4. **Full-screen terminal hero without WebGL** → Fixed `rows×cols` in `<pre>` or canvas 2D; optional CSS CRT; optional char interpolation for logo reveal (midjourney ideas, simplified)—avoid thousands of SVG `<text>` nodes unless measured OK.

#### Skill — Read a live site’s ASCII stack

1. Open DevTools → **Network**: filter `three`, `glb`, `wasm`; check for `<canvas id="gl">` vs only CSS.
2. **Elements**: search `canvas`, `pre`, `svg text`, `table` inside ASCII-looking regions.
3. If JS is **minified**, search bundles for `AsciiEffect`, `fragmentShader`, `textContent`, `requestAnimationFrame`, `charCodeAt`.
4. Map findings to the three reference patterns above before proposing code.

#### Skill — Explain tradeoffs to humans

- **Alignment & AGENTS.md compliance** → prefer `<pre>` / fixed grid (this project).
- **“Cool 3D portfolio”** → bierman or tempo paths; higher complexity and GPU cost.
- **“Retro terminal landing”** → midjourney-style 2D + CSS; simplest GPU story, mind per-frame update cost.
- **Never** mix Braille typography rules with Paul Bourke ASCII ramps unless the task explicitly calls for Braille.

### Braille (this repo)

- For Braille ASCII art, prefer rendering text in a `<pre>` instead of using a stretched canvas when the goal is stable character-grid output.
- Use complete Braille cells such as `⣿` for filled cells when the design needs even column density.
- Avoid mixing many partial Braille cells such as `⠁`, `⣇`, and `⡇` unless uneven internal dot density is intentional.
- Do not use the Braille blank character `⠀` (`U+2800`) as visual whitespace. Some fonts render it as faint placeholder dots.
- Use two normal spaces (`" "`) as one blank Braille cell when using `Apple Braille`, because a normal space is half the width of a Braille glyph in the measured browser environment.
- Use a Braille-aware font stack for these blocks:

  `"Apple Braille", "Noto Sans Symbols 2", "Segoe UI Symbol", monospace`

- Prefer symmetric or deliberately centered masks for test patterns. Asymmetric masks can look like rendering errors when evaluating dot-grid consistency.
- If columns look uneven, verify both:
  1. glyph widths via browser measurement, and
  2. whether the generator is emitting partial Braille glyphs with different internal dot patterns.

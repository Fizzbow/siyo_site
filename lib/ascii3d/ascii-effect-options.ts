/**
 * Linear scale of the 3D mesh in scene units (~0.55 → ~30% viewport area).
 */
export const ASCII_SCENE_OBJECT_SCALE = 0.55;

/** Shift model left so crescent visual mass sits in viewport center. */
export const ASCII_OPTICAL_OFFSET_X = -0.11;

/** Yaw + slight pitch so thickness and bite read at scroll start (radians). */
export const ASCII_CRESCENT_INITIAL_Y = 0.2;
/** Keep near 0 — tilt exposes bite interior walls as left-side ASCII streaks. */
export const ASCII_CRESCENT_INITIAL_X = 0.06;

/** AsciiEffect `resolution` — higher = denser character grid (more DOM). */
export const ASCII_EFFECT_RESOLUTION_DESKTOP = 0.24;
export const ASCII_EFFECT_RESOLUTION_MOBILE = 0.17;

export const ASCII_EFFECT_SCALE = 1;

export function getAsciiEffectResolution(): number {
  if (typeof window === "undefined") {
    return ASCII_EFFECT_RESOLUTION_DESKTOP;
  }
  return window.matchMedia("(max-width: 767px)").matches
    ? ASCII_EFFECT_RESOLUTION_MOBILE
    : ASCII_EFFECT_RESOLUTION_DESKTOP;
}

export function buildAsciiEffectOptions() {
  return {
    resolution: getAsciiEffectResolution(),
    scale: ASCII_EFFECT_SCALE,
    color: false,
    alpha: false,
    block: false,
    invert: true,
    strResolution: "high" as const,
  };
}

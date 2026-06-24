/** Paul Bourke 10-level grey ramp (light → dark by apparent ink). */
export const ASCII_RAMP_10 = " .:-=+*#%@";

/** Denser ramp for 3D AsciiEffect (more grey steps → finer shading). */
export const ASCII_RAMP_3D =
  " .'`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

/** Empty / light cell — ramp start. */
export const ASCII_CELL_OFF = ASCII_RAMP_10[0];

/** Filled / dark cell — ramp end. */
export const ASCII_CELL_ON = ASCII_RAMP_10[ASCII_RAMP_10.length - 1];

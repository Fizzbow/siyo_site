import {
  ExtrudeGeometry,
  Shape,
  type BufferGeometry,
} from "three";

const OUTER_R = 1;
const OUTER_CX = 0;
const OUTER_CY = 0;
const BITE_R = 0.56;
const BITE_CX = -0.46;
const BITE_CY = 0.05;

/** Radians to step back along each arc before joining the horn fillet. */
const TIP_ARC_TRIM = 0.045;
/** Less trim at top horns — keeps more glyphs on the first ASCII row. */
const TIP_ARC_TRIM_TOP = 0.008;
/** Inward pull at each horn tip only — keeps the classic crescent bite. */
const TIP_ROUND_INSET = 0.06;

const TAU = Math.PI * 2;

type Point2 = { x: number; y: number };

function circleCircleIntersections(
  cx0: number,
  cy0: number,
  r0: number,
  cx1: number,
  cy1: number,
  r1: number
): [Point2, Point2] | null {
  const dx = cx1 - cx0;
  const dy = cy1 - cy0;
  const d = Math.hypot(dx, dy);
  if (d > r0 + r1 || d < Math.abs(r0 - r1) || d === 0) {
    return null;
  }

  const a = (r0 * r0 - r1 * r1 + d * d) / (2 * d);
  const h2 = r0 * r0 - a * a;
  if (h2 < 0) {
    return null;
  }

  const h = Math.sqrt(h2);
  const px = cx0 + (a * dx) / d;
  const py = cy0 + (a * dy) / d;
  const rx = (-dy * h) / d;
  const ry = (dx * h) / d;

  return [
    { x: px + rx, y: py + ry },
    { x: px - rx, y: py - ry },
  ];
}

function angleAt(cx: number, cy: number, p: Point2): number {
  return Math.atan2(p.y - cy, p.x - cx);
}

function normalizeAngle(delta: number): number {
  let d = delta;
  while (d > Math.PI) {
    d -= TAU;
  }
  while (d < -Math.PI) {
    d += TAU;
  }
  return d;
}

function pointOnCircle(
  cx: number,
  cy: number,
  r: number,
  angle: number
): Point2 {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function trimArcAngle(
  cx: number,
  cy: number,
  tip: Point2,
  toward: Point2,
  trim: number,
  clockwise: boolean
): number {
  const aTip = angleAt(cx, cy, tip);
  let delta = normalizeAngle(angleAt(cx, cy, toward) - aTip);
  if (clockwise && delta > 0) {
    delta -= TAU;
  }
  if (!clockwise && delta < 0) {
    delta += TAU;
  }
  return aTip + Math.sign(delta) * trim;
}

/** Into solid material at the horn — not into the bite void. */
function hornInsetControl(tip: Point2): Point2 {
  const t0x = OUTER_CX - tip.x;
  const t0y = OUTER_CY - tip.y;
  const t1x = BITE_CX - tip.x;
  const t1y = BITE_CY - tip.y;
  const l0 = Math.hypot(t0x, t0y);
  const l1 = Math.hypot(t1x, t1y);
  const bx = t0x / l0 + t1x / l1;
  const by = t0y / l0 + t1y / l1;
  const len = Math.hypot(bx, by) || 1;
  return {
    x: tip.x + (bx / len) * TIP_ROUND_INSET,
    y: tip.y + (by / len) * TIP_ROUND_INSET,
  };
}

function roundHornTip(shape: Shape, tip: Point2, to: Point2) {
  const ctrl = hornInsetControl(tip);
  shape.quadraticCurveTo(ctrl.x, ctrl.y, to.x, to.y);
}

/**
 * True crescent: band between two circles. Horn tips get a light fillet only.
 */
export function createCrescentExtrudeGeometry(): ExtrudeGeometry {
  const tips = circleCircleIntersections(
    OUTER_CX,
    OUTER_CY,
    OUTER_R,
    BITE_CX,
    BITE_CY,
    BITE_R
  );

  if (!tips) {
    throw new Error("crescent-moon: circle intersection failed");
  }

  const tipTop = tips[0].y >= tips[1].y ? tips[0] : tips[1];
  const tipBottom = tips[0].y >= tips[1].y ? tips[1] : tips[0];

  const outerAtTop = trimArcAngle(
    OUTER_CX,
    OUTER_CY,
    tipTop,
    tipBottom,
    TIP_ARC_TRIM_TOP,
    true
  );
  const outerAtBottom = trimArcAngle(
    OUTER_CX,
    OUTER_CY,
    tipBottom,
    tipTop,
    TIP_ARC_TRIM,
    true
  );
  const biteAtBottom = trimArcAngle(
    BITE_CX,
    BITE_CY,
    tipBottom,
    tipTop,
    TIP_ARC_TRIM,
    false
  );
  const biteAtTop = trimArcAngle(
    BITE_CX,
    BITE_CY,
    tipTop,
    tipBottom,
    TIP_ARC_TRIM_TOP,
    false
  );

  const outerStart = pointOnCircle(OUTER_CX, OUTER_CY, OUTER_R, outerAtTop);
  const biteStart = pointOnCircle(BITE_CX, BITE_CY, BITE_R, biteAtBottom);

  const shape = new Shape();
  shape.moveTo(outerStart.x, outerStart.y);
  shape.absarc(OUTER_CX, OUTER_CY, OUTER_R, outerAtTop, outerAtBottom, true);
  roundHornTip(shape, tipBottom, biteStart);
  shape.absarc(BITE_CX, BITE_CY, BITE_R, biteAtBottom, biteAtTop, false);
  roundHornTip(shape, tipTop, outerStart);

  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.72,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.035,
    bevelSegments: 2,
    curveSegments: 72,
  });

  geometry.computeVertexNormals();
  centerGeometry(geometry);
  return geometry;
}

function centerGeometry(geometry: BufferGeometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (!box) {
    return;
  }
  const cx = (box.min.x + box.max.x) * 0.5;
  const cy = (box.min.y + box.max.y) * 0.5;
  const cz = (box.min.z + box.max.z) * 0.5;
  geometry.translate(-cx, -cy, -cz);
}

/** Face sits on the +Z cap of the extruded crescent. */
export const CRESCENT_FACE_Z = 0.38;

export type CrescentTopCapSpec = {
  position: [number, number, number];
  scale: [number, number, number];
};

/**
 * Wide +Z brow aligned to bbox.max.y — bridges horn tips for a smoother top row.
 */
export function getCrescentTopCapSpec(
  geometry?: ExtrudeGeometry
): CrescentTopCapSpec {
  const geo = geometry ?? createCrescentExtrudeGeometry();
  geo.computeBoundingBox();
  const box = geo.boundingBox;
  if (!box) {
    return {
      position: [0.08, 0.9, CRESCENT_FACE_Z + 0.02],
      scale: [1.1, 0.06, 0.12],
    };
  }

  const spanX = box.max.x - box.min.x;
  const y = box.max.y - 0.02;
  const cx = (box.min.x + box.max.x) * 0.5;

  return {
    position: [cx, y, CRESCENT_FACE_Z + 0.02],
    scale: [spanX * 0.68, 0.04, 0.08],
  };
}

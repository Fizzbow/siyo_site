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

/**
 * True crescent: only the band between two tangent circles (no full-disc leftover).
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

  const shape = new Shape();
  shape.moveTo(tipTop.x, tipTop.y);
  shape.absarc(
    OUTER_CX,
    OUTER_CY,
    OUTER_R,
    angleAt(OUTER_CX, OUTER_CY, tipTop),
    angleAt(OUTER_CX, OUTER_CY, tipBottom),
    true
  );
  shape.absarc(
    BITE_CX,
    BITE_CY,
    BITE_R,
    angleAt(BITE_CX, BITE_CY, tipBottom),
    angleAt(BITE_CX, BITE_CY, tipTop),
    false
  );

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

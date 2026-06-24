"use client";

import { useMemo } from "react";

import { createCrescentExtrudeGeometry } from "@/lib/ascii3d/crescent-moon-geometry";

const BODY_MATERIAL = {
  color: "#f0f0f4",
  metalness: 0.48,
  roughness: 0.28,
} as const;

export function CrescentMoonModel() {
  const bodyGeometry = useMemo(() => createCrescentExtrudeGeometry(), []);

  return (
    <group>
      <mesh geometry={bodyGeometry}>
        <meshStandardMaterial {...BODY_MATERIAL} />
      </mesh>
    </group>
  );
}

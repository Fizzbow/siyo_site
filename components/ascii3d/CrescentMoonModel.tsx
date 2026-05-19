"use client";

import { useMemo } from "react";

import {
  CRESCENT_FACE_Z,
  createCrescentExtrudeGeometry,
} from "@/lib/ascii3d/crescent-moon-geometry";

const BODY_MATERIAL = {
  color: "#f0f0f4",
  metalness: 0.48,
  roughness: 0.28,
} as const;

const FACE_MATERIAL = {
  color: "#5a5a64",
  metalness: 0.15,
  roughness: 0.5,
} as const;

export function CrescentMoonModel() {
  const bodyGeometry = useMemo(() => createCrescentExtrudeGeometry(), []);

  return (
    <group>
      <mesh geometry={bodyGeometry}>
        <meshStandardMaterial {...BODY_MATERIAL} />
      </mesh>

      <mesh position={[0.1, 0.1, CRESCENT_FACE_Z]} scale={[0.07, 0.12, 0.06]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial {...FACE_MATERIAL} />
      </mesh>
      <mesh position={[0.34, 0.1, CRESCENT_FACE_Z]} scale={[0.07, 0.12, 0.06]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial {...FACE_MATERIAL} />
      </mesh>

      <mesh
        position={[0.2, -0.12, CRESCENT_FACE_Z]}
        rotation={[0.15, 0, -0.04]}
      >
        <torusGeometry args={[0.12, 0.026, 14, 32, Math.PI * 0.92]} />
        <meshStandardMaterial {...FACE_MATERIAL} />
      </mesh>
    </group>
  );
}

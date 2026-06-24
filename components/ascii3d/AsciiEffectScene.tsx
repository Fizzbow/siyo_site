"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AsciiEffect } from "three/addons/effects/AsciiEffect.js";
import type { Object3D, WebGLRenderer } from "three";

import { ASCII_RAMP_3D } from "@/lib/ascii-ramp";
import { CrescentMoonModel } from "@/components/ascii3d/CrescentMoonModel";
import {
  ASCII_CRESCENT_INITIAL_X,
  ASCII_CRESCENT_INITIAL_Y,
  ASCII_OPTICAL_OFFSET_X,
  ASCII_SCENE_OBJECT_SCALE,
  buildAsciiEffectOptions,
  getAsciiEffectResolution,
} from "@/lib/ascii3d/ascii-effect-options";
import { postProcessAsciiTable } from "@/lib/ascii3d/trim-ascii-top";
import { getAsciiSquareSize } from "@/lib/ascii3d/ascii-viewport";

const TAU = Math.PI * 2;

type AsciiEffectInstance = InstanceType<typeof AsciiEffect>;

interface AsciiEffectBridgeProps {
  hostRef: RefObject<HTMLDivElement | null>;
  progressRef: RefObject<number>;
  activeRef: RefObject<boolean>;
}

function AsciiEffectBridge({
  hostRef,
  progressRef,
  activeRef,
}: AsciiEffectBridgeProps) {
  const { gl, scene, camera, size } = useThree();
  const rendererRef = useRef<WebGLRenderer | null>(null);

  const effectRef = useRef<AsciiEffectInstance | null>(null);
  const meshRef = useRef<Object3D | null>(null);
  const allowRenderRef = useRef(false);
  const asciiDim = getAsciiSquareSize(size.width, size.height);
  const resolution = getAsciiEffectResolution();

  const applyEffectDomLayout = (effect: AsciiEffectInstance, dim: number) => {
    const el = effect.domElement;
    el.style.position = "absolute";
    el.style.left = "50%";
    el.style.top = "50%";
    el.style.width = `${dim}px`;
    el.style.height = `${dim}px`;
    el.style.transform = "translate(-50%, -50%)";
    el.style.transformOrigin = "center center";
    el.style.overflow = "hidden";
  };

  const mountEffect = (dim: number, renderer: WebGLRenderer) => {
    const host = hostRef.current;
    if (!host) {
      return null;
    }

    const effect = new AsciiEffect(
      renderer,
      ASCII_RAMP_3D,
      buildAsciiEffectOptions()
    );
    effect.setSize(dim, dim);
    applyEffectDomLayout(effect, dim);
    host.appendChild(effect.domElement);
    return effect;
  };

  useLayoutEffect(() => {
    rendererRef.current = gl as WebGLRenderer;
    const renderer = rendererRef.current;
    if (!renderer) {
      return;
    }

    const originalRender = renderer.render.bind(renderer);
    renderer.render = (scene, camera) => {
      if (!allowRenderRef.current) {
        return;
      }
      originalRender(scene, camera);
    };

    effectRef.current = mountEffect(asciiDim, renderer);
    const host = hostRef.current;

    return () => {
      const effect = effectRef.current;
      if (effect && host?.contains(effect.domElement)) {
        host.removeChild(effect.domElement);
      }
      effectRef.current = null;
      renderer.render = originalRender;
    };
  }, [gl, hostRef, asciiDim]);

  useEffect(() => {
    const effect = effectRef.current;
    if (!effect) {
      return;
    }
    effect.setSize(asciiDim, asciiDim);
    applyEffectDomLayout(effect, asciiDim);
  }, [asciiDim]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const rebuild = () => {
      rendererRef.current = gl as WebGLRenderer;
      const renderer = rendererRef.current;
      if (!renderer) {
        return;
      }

      const host = hostRef.current;
      const prev = effectRef.current;
      if (prev && host?.contains(prev.domElement)) {
        host.removeChild(prev.domElement);
      }
      effectRef.current = mountEffect(
        getAsciiSquareSize(size.width, size.height),
        renderer
      );
    };
    mq.addEventListener("change", rebuild);
    return () => mq.removeEventListener("change", rebuild);
  }, [gl, hostRef, size.width, size.height]);

  useFrame(() => {
    if (!activeRef.current) {
      return;
    }

    const mesh = meshRef.current;
    const effect = effectRef.current;
    if (!mesh || !effect) {
      return;
    }

    mesh.rotation.y = progressRef.current * TAU + ASCII_CRESCENT_INITIAL_Y;
    mesh.rotation.x =
      ASCII_CRESCENT_INITIAL_X + Math.sin(progressRef.current * TAU) * 0.03;

    allowRenderRef.current = true;
    effect.render(scene, camera);
    allowRenderRef.current = false;

    const table = effect.domElement.querySelector("table");
    if (table != null) {
      postProcessAsciiTable(table);
    }
  });

  return (
    <group ref={meshRef}>
      <ambientLight intensity={0.18} />
      <directionalLight position={[7, 11, 8]} intensity={2.1} />
      <directionalLight position={[-6, 4, 5]} intensity={0.35} />
      <pointLight position={[2, 1, 6]} intensity={0.9} distance={12} />
      <directionalLight position={[0, -6, -3]} intensity={0.15} />
      <group
        position={[ASCII_OPTICAL_OFFSET_X, 0, 0]}
        scale={ASCII_SCENE_OBJECT_SCALE}
      >
        <CrescentMoonModel />
      </group>
    </group>
  );
}

interface AsciiEffectSceneProps {
  hostRef: RefObject<HTMLDivElement | null>;
  progressRef: RefObject<number>;
  activeRef: RefObject<boolean>;
  frameloop?: "always" | "never" | "demand";
  className?: string;
}

export function AsciiEffectScene({
  hostRef,
  progressRef,
  activeRef,
  frameloop = "always",
  className,
}: AsciiEffectSceneProps) {
  return (
    <Canvas
      className={className}
      frameloop={frameloop}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.6], fov: 48, near: 0.1, far: 100, aspect: 1.3 }}
      gl={{
        antialias: false,
        alpha: false,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 1);
      }}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "min(100vw, 100dvh)",
        height: "min(100vw, 100dvh)",
        maxWidth: "100%",
        maxHeight: "100%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        visibility: "hidden",
      }}
      resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
    >
      <color attach="background" args={["#000000"]} />
      <AsciiEffectBridge
        hostRef={hostRef}
        progressRef={progressRef}
        activeRef={activeRef}
      />
    </Canvas>
  );
}

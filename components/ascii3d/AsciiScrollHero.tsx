"use client";

import { useEffect, useRef, useState } from "react";

import { AsciiEffectScene } from "@/components/ascii3d/AsciiEffectScene";
import { AsciiNightSky } from "@/components/ascii3d/AsciiNightSky";
import { subscribeScrollProgress } from "@/lib/ascii3d/scroll-progress";
import { cn } from "@/lib/utils";

export function AsciiScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const activeRef = useRef(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    return subscribeScrollProgress(section, (progress) => {
      progressRef.current = progress;
    });
  }, []);

  useEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        activeRef.current = visible;
        setIsActive(visible);
      },
      { root: null, threshold: 0.05 }
    );

    observer.observe(sticky);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="ascii-scroll-hero relative min-h-[250vh] w-full"
      aria-label="3D ASCII scroll demo"
    >
      <div
        ref={stickyRef}
        className={cn(
          "sticky top-0 z-10 flex h-[100dvh] w-full items-center justify-center",
          "overflow-hidden"
        )}
      >
        <AsciiNightSky progressRef={progressRef} isActive={isActive} />
        <div
          ref={hostRef}
          className="ascii-effect-host relative z-10 h-full w-full"
          aria-hidden
        />
        <AsciiEffectScene
          hostRef={hostRef}
          progressRef={progressRef}
          activeRef={activeRef}
          frameloop={isActive ? "always" : "never"}
        />
      </div>
    </section>
  );
}

import type { ElementType, PropsWithChildren } from "react";
import { InView } from "./in-view";

export interface FadeInProps {
  as?: ElementType;
  /**
   * Delay in seconds before the animation starts.
   * This is forwarded to the underlying motion transition.
   */
  delay?: number;
  className?: string;
}

export function FadeIn({
  as: Component = "div",
  delay = 0,
  children,
}: PropsWithChildren<FadeInProps>) {
  return (
    <InView
      as={Component}
      variants={{
        hidden: {
          opacity: 0,
          y: 30,
          scale: 0.95,
          filter: "blur(4px)",
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        },
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
        delay,
      }}
      viewOptions={{
        margin: "0px 0px -50px 0px",
      }}
      once
    >
      {children}
    </InView>
  );
}

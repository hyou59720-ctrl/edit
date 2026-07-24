import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionProps } from "./types";

export const ZoomTransition: React.FC<TransitionProps> = ({
  children,
  progress = 0,
  maxScale = 1.15,
  maxBlur = 28,
}) => {
  // progress: 0 (transition የለም) → 1 (transition peak)
  const scale = 1 + (maxScale - 1) * progress;
  const blur = maxBlur * progress;
  const opacity = 1 - progress * 0.1;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        filter: blur > 0.5 ? `blur(${blur}px)` : "none",
        opacity,
        willChange: "transform, filter, opacity",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
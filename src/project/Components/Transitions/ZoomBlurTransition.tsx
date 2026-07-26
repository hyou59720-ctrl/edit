import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionProps } from "./types";

export const ZoomBlurTransition: React.FC<TransitionProps> = ({
  children,
  progress = 0,
  maxBlur = 35,
}) => {
  const scale = 1 + progress * 0.4;
  const blur = progress * maxBlur;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        filter: blur > 0.5 ? `blur(${blur}px)` : "none",
        willChange: "transform, filter",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
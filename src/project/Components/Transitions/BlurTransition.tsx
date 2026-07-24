import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionProps } from "./types";

export const BlurTransition: React.FC<TransitionProps> = ({
  children,
  progress = 0,
  maxBlur = 28,
}) => {
  const blur = progress * maxBlur;   // 👈 ተገልብጧል

  return (
    <AbsoluteFill
      style={{
        filter: blur > 0.5 ? `blur(${blur}px)` : "none",
        willChange: "filter",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionProps } from "./types";

export const WhipPanTransition: React.FC<TransitionProps> = ({ children, progress = 0 }) => {
  const blur = Math.sin(progress * Math.PI) * 45;
  const translate = (1 - Math.abs(progress - 0.5) * 2) * 0; // stays centered, blur carries motion feel
  const skew = Math.sin(progress * Math.PI) * 8;

  return (
    <AbsoluteFill
      style={{
        filter: blur > 0.5 ? `blur(${blur}px)` : "none",
        transform: `skewX(${skew}deg) scale(1.05)`,
        willChange: "filter, transform",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
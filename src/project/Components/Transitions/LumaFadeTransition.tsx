import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionProps } from "./types";

export const LumaFadeTransition: React.FC<TransitionProps> = ({ children, progress = 0 }) => (
  <AbsoluteFill style={{ opacity: 1 - progress * 0.4 }}>
    {children}
    <AbsoluteFill
      style={{
        opacity: progress,
        pointerEvents: "none",
        background: "radial-gradient(circle, #fff 0%, #000 100%)",
        mixBlendMode: "luminosity",
      }}
    />
  </AbsoluteFill>
);
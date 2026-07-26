import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionProps } from "./types";

export const LightLeakTransition: React.FC<TransitionProps> = ({ children, progress = 0 }) => (
  <AbsoluteFill>
    {children}
    <AbsoluteFill
      style={{
        opacity: progress,
        pointerEvents: "none",
        mixBlendMode: "screen",
        background: `radial-gradient(ellipse at ${20 + progress * 60}% 30%, rgba(255,220,150,0.9) 0%, rgba(255,140,60,0.6) 30%, rgba(255,80,20,0.2) 55%, transparent 75%)`,
      }}
    />
  </AbsoluteFill>
);
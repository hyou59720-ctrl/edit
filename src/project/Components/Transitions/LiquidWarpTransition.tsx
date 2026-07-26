import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionProps } from "./types";

export const LiquidWarpTransition: React.FC<TransitionProps> = ({ children, progress = 0 }) => {
  const wave = Math.sin(progress * Math.PI) * 20;

  if (progress < 0.01) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  return (
    <AbsoluteFill style={{ filter: `url(#liquidWarp)` }}>
      <AbsoluteFill style={{ transform: `scale(${1 + progress * 0.08})` }}>
        {children}
      </AbsoluteFill>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="liquidWarp">
          <feTurbulence type="turbulence" baseFrequency="0.01 0.02" numOctaves="2" seed="3" result="turb" />
          <feDisplacementMap in="SourceGraphic" in2="turb" scale={wave} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </AbsoluteFill>
  );
};
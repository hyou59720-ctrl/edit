import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionProps } from "./types";

export const GlitchTransitionFx: React.FC<TransitionProps> = ({ children, progress = 0 }) => {
  const jitter = progress * 12;
  const sliceOffset = Math.sin(progress * Math.PI * 20) * jitter;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${sliceOffset}px)` }}>
        {children}
      </AbsoluteFill>
      {progress > 0.05 && (
        <>
          <AbsoluteFill
            style={{
              opacity: progress * 0.5,
              transform: `translateX(${-sliceOffset * 1.5}px)`,
              mixBlendMode: "screen",
              backgroundColor: "rgba(255,0,60,0.3)",
              pointerEvents: "none",
            }}
          />
          <AbsoluteFill
            style={{
              opacity: progress * 0.5,
              transform: `translateX(${sliceOffset * 1.5}px)`,
              mixBlendMode: "screen",
              backgroundColor: "rgba(0,255,255,0.3)",
              pointerEvents: "none",
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};
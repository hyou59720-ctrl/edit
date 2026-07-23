import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionProps } from "./types";

export const BlurTransition: React.FC<TransitionProps> = ({
  children,
  duration = 16,
  maxBlur = 28,
}) => {
  const frame = useCurrentFrame();

  const blur = interpolate(
    frame,
    [0, duration],
    [maxBlur, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        filter: `blur(${blur}px)`,
        willChange: "filter",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

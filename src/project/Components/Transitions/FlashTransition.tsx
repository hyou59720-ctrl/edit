import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionProps } from "./types";

export const FlashTransition: React.FC<TransitionProps> = ({
  children,
  progress = 0,
}) => {
  return (
    <AbsoluteFill>
      {children}

      <AbsoluteFill
        style={{
          backgroundColor: "#fff",
          opacity: progress,
          pointerEvents: "none",
          willChange: "opacity",
        }}
      />
    </AbsoluteFill>
  );
};
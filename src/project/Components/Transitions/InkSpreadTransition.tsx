import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionProps } from "./types";

export const InkSpreadTransition: React.FC<TransitionProps> = ({ children, progress = 0 }) => {
  const radius = progress * 150;

  return (
    <AbsoluteFill>
      {children}

      {progress > 0.01 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(circle at 50% 50%, transparent ${radius}%, rgba(5,5,10,0.97) ${radius + 8}%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
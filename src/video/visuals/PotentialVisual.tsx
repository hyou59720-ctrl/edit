import React from "react";
import { interpolate } from "remotion";
import { VisualProps } from "../types";

/* POTENTIAL — an energy capsule filling up, pulsing when nearly full */
export const PotentialVisual: React.FC<VisualProps> = ({ frame, start, end }) => {
  const duration = Math.max(1, end - start);
  const progress = interpolate(frame - start, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fillHeight = 150 * progress;
  const pulse = 1 + Math.sin((frame - start) * 0.3) * 0.03;

  return (
    <svg width={160} height={240} viewBox="0 0 160 240" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="potentialGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>
      </defs>
      <rect x="35" y="20" width="90" height="180" rx="26" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="4" />
      <rect x="65" y="6" width="30" height="18" rx="6" fill="rgba(255,255,255,0.35)" />
      <rect
        x="41"
        y={194 - fillHeight}
        width="78"
        height={fillHeight}
        rx="20"
        fill="url(#potentialGrad)"
        style={{ transform: `scale(${pulse})`, transformOrigin: "80px 194px" }}
      />
    </svg>
  );
};


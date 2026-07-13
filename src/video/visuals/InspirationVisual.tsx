import React from "react";
import { interpolate } from "remotion";
import { VisualProps } from "../types";

/* INSPIRATION — a glowing bulb with pulsing light rays */
export const InspirationVisual: React.FC<VisualProps> = ({ frame, start }) => {
  const t = frame - start;
  const glow = interpolate(t, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rayLength = interpolate(t, [10, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rays = new Array(8).fill(0).map((_, i) => (i * 360) / 8);

  return (
    <svg width={220} height={220} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="bulbGlow">
          <stop offset="0%" stopColor="#5eead4" stopOpacity={glow} />
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="90" r="55" fill="url(#bulbGlow)" />
      <circle cx="100" cy="85" r="35" fill="none" stroke="#2dd4bf" strokeWidth="5" />
      <path d="M85,115 L115,115 L112,130 L88,130 Z" fill="none" stroke="#2dd4bf" strokeWidth="5" strokeLinejoin="round" />
      <line x1="90" y1="138" x2="110" y2="138" stroke="#2dd4bf" strokeWidth="5" strokeLinecap="round" />
      {rays.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const r1 = 45;
        const r2 = 45 + rayLength * 20;
        const x1 = 100 + Math.cos(rad) * r1;
        const y1 = 85 + Math.sin(rad) * r1;
        const x2 = 100 + Math.cos(rad) * r2;
        const y2 = 85 + Math.sin(rad) * r2;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#5eead4"
            strokeWidth="3"
            strokeLinecap="round"
            opacity={rayLength}
          />
        );
      })}
    </svg>
  );
};

import React from "react";
import { interpolate } from "remotion";
import { VisualProps } from "../types";

/* INSPIRE — a rotating sunburst pulsing outward from a core */
export const InspireVisual: React.FC<VisualProps> = ({ frame, start }) => {
  const t = frame - start;
  const rotate = t * 1.2;
  const rays = new Array(12).fill(0).map((_, i) => (i * 360) / 12);
  const pulse = interpolate(t, [0, 15], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg width={220} height={220} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      <g style={{ transform: `rotate(${rotate}deg)`, transformOrigin: "100px 100px" }}>
        {rays.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const r1 = 25;
          const r2 = 25 + 35 * pulse;
          const x1 = 100 + Math.cos(rad) * r1;
          const y1 = 100 + Math.sin(rad) * r1;
          const x2 = 100 + Math.cos(rad) * r2;
          const y2 = 100 + Math.sin(rad) * r2;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />;
        })}
      </g>
      <circle cx="100" cy="100" r="20" fill="#38bdf8" opacity={pulse} />
    </svg>
  );
};

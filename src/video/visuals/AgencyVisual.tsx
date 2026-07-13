import React from "react";
import { interpolate, Easing } from "remotion";
import { VisualProps } from "../types";

/* AGENCY — growth bars rising like a company's ascent */
export const AgencyVisual: React.FC<VisualProps> = ({ frame, start }) => {
  const bars = [0, 1, 2, 3];

  return (
    <svg width={220} height={200} viewBox="0 0 220 200" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="agencyGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
      </defs>
      {bars.map((i) => {
        const barStart = start + i * 6;
        const targetHeight = 40 + i * 30;
        const h = interpolate(frame, [barStart, barStart + 14], [0, targetHeight], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = 20 + i * 50;
        return <rect key={i} x={x} y={180 - h} width={36} height={h} rx="4" fill="url(#agencyGrad)" opacity={0.9} />;
      })}
      <line x1="10" y1="180" x2="210" y2="180" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
    </svg>
  );
};

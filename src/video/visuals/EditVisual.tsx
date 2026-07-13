import React from "react";
import { interpolate } from "remotion";
import { VisualProps } from "../types";

/* EDIT — a video timeline with a moving playhead */
export const EditVisual: React.FC<VisualProps> = ({ frame, start, end }) => {
  const duration = Math.max(1, end - start);
  const progress = interpolate(frame - start, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const w = 260;
  const clips = [0, 1, 2, 3, 4];

  return (
    <svg width={w} height={100} viewBox={`0 0 ${w} 100`} style={{ overflow: "visible" }}>
      <rect x="0" y="35" width={w} height="30" rx="6" fill="rgba(139,92,246,0.25)" stroke="rgba(139,92,246,0.6)" strokeWidth="2" />
      {clips.map((i) => (
        <line key={i} x1={(w / clips.length) * i} y1="35" x2={(w / clips.length) * i} y2="65" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      ))}
      <line x1={progress * w} y1="20" x2={progress * w} y2="80" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
      <circle cx={progress * w} cy="20" r="6" fill="#a78bfa" />
    </svg>
  );
};

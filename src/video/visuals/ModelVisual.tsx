import React from "react";
import { interpolate, Easing } from "remotion";
import { VisualProps } from "../types";

/* MODEL — a bullseye target with rings popping in */
export const ModelVisual: React.FC<VisualProps> = ({ frame, start }) => {
  const t = frame - start;
  const rings = [55, 38, 20];

  return (
    <svg width={200} height={200} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      {rings.map((r, i) => {
        const scale = interpolate(t, [i * 5, i * 5 + 12], [0, 1], {
          easing: Easing.out(Easing.back(1.3)),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={i % 2 === 0 ? "#38bdf8" : "#0ea5e9"}
            strokeWidth="8"
            style={{ transform: `scale(${scale})`, transformOrigin: "100px 100px" }}
          />
        );
      })}
      <circle cx="100" cy="100" r="8" fill="#0284c7" />
    </svg>
  );
};

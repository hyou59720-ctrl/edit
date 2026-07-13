import React from "react";
import { interpolate, Easing } from "remotion";
import { VisualProps } from "../types";

/* TEMPLATE — a layout grid whose cells pop in one by one */
export const TemplateVisual: React.FC<VisualProps> = ({ frame, start }) => {
  const cells = [0, 1, 2, 3, 4, 5];

  return (
    <svg width={240} height={180} viewBox="0 0 240 180" style={{ overflow: "visible" }}>
      {cells.map((i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const cellStart = start + i * 4;
        const scale = interpolate(frame, [cellStart, cellStart + 10], [0, 1], {
          easing: Easing.out(Easing.back(1.5)),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = 10 + col * 78;
        const y = 10 + row * 82;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width="68"
            height="72"
            rx="10"
            fill="rgba(217,70,239,0.5)"
            stroke="#e879f9"
            strokeWidth="2"
            style={{ transform: `scale(${scale})`, transformOrigin: `${x + 34}px ${y + 36}px` }}
          />
        );
      })}
    </svg>
  );
};

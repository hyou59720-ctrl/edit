import React from "react";
import { interpolate, Easing } from "remotion";
import { VisualProps } from "../types";

/* MOTIVATION — a flickering flame with rising embers */
export const MotivationVisual: React.FC<VisualProps> = ({ frame, start }) => {
  const t = frame - start;
  const flicker = Math.sin(t * 0.4) * 4;
  const scale = interpolate(t, [0, 15], [0.6, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width={220} height={220} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="flameGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <g
        style={{
          transform: `translate(100px, 110px) scale(${scale}) translateX(${flicker}px)`,
          transformOrigin: "0px 0px",
        }}
      >
        <path
          d="M0,-70 C25,-40 30,-10 15,10 C25,0 35,-15 30,-30 C45,-10 40,25 15,40 C25,35 30,20 25,10 C20,30 -10,45 -15,20 C-25,30 -20,5 -10,-5 C-25,0 -30,-20 -15,-35 C-10,-20 -5,-15 0,-25 C5,-45 0,-60 0,-70 Z"
          fill="url(#flameGrad)"
        />
      </g>
      {[0, 1, 2].map((i) => {
        const rise = (t + i * 12) % 40;
        const opacity = interpolate(rise, [0, 10, 30, 40], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <circle
            key={i}
            cx={100 + (i - 1) * 22}
            cy={130 - rise * 2.2}
            r={3}
            fill="#fde68a"
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
};

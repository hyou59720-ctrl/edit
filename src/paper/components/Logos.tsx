import React from "react";

// Original abstract sunburst mark (Fable side) — 12-point burst
export const SunburstLogo: React.FC<{ size?: number; color?: string }> = ({
  size = 200,
  color = "#d95f3b",
}) => {
  const points = 12;
  const rays = Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2;
    const len = i % 2 === 0 ? 1 : 0.82;
    const x1 = 100 + Math.cos(angle) * 14;
    const y1 = 100 + Math.sin(angle) * 14;
    const x2 = 100 + Math.cos(angle) * 92 * len;
    const y2 = 100 + Math.sin(angle) * 92 * len;
    const perp = angle + Math.PI / 2;
    const wobble = 7;
    const xa = x1 + Math.cos(perp) * wobble;
    const ya = y1 + Math.sin(perp) * wobble;
    const xb = x1 - Math.cos(perp) * wobble;
    const yb = y1 - Math.sin(perp) * wobble;
    return `M ${xa} ${ya} L ${x2} ${y2} L ${xb} ${yb} Z`;
  }).join(" ");

  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <path d={rays} fill={color} />
    </svg>
  );
};

// Original abstract interlocking-loop mark (Sol side)
export const KnotLogo: React.FC<{ size?: number; color?: string }> = ({
  size = 200,
  color = "#1f8f78",
}) => {
  const loops = [0, 60, 120, 180, 240, 300];
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <g fill="none" stroke={color} strokeWidth={16}>
        {loops.map((deg, i) => (
          <circle
            key={i}
            cx={100 + Math.cos((deg * Math.PI) / 180) * 34}
            cy={100 + Math.sin((deg * Math.PI) / 180) * 34}
            r={38}
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
      </g>
    </svg>
  );
};

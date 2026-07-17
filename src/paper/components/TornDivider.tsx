import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

/**
 * Recreates the jagged vertical crack down the middle of the reference
 * image — the single background paper is "torn" into two halves that
 * pull slightly apart, revealing a dark gap between them.
 */
export const TornDivider: React.FC<{
  width: number;
  height: number;
  seed?: number;
  gapFrame?: number; // animate gap width from Scene via frame value
}> = ({ width, height, seed = 5, gapFrame = 0 }) => {
  const frame = useCurrentFrame();

  const rand = (n: number) => {
    const x = Math.sin(seed * 71.3 + n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };

  // build a jagged vertical line from top to bottom, roughly centered
  const points: { x: number; y: number }[] = [];
  const steps = 26;
  let cx = width / 2;
  for (let i = 0; i <= steps; i++) {
    const y = (height / steps) * i;
    cx += (rand(i) - 0.5) * 34;
    // keep it roughly centered
    cx = Math.max(width * 0.42, Math.min(width * 0.58, cx));
    points.push({ x: cx, y });
  }

  const gap = interpolate(gapFrame, [0, 1], [0, 16]);
  const wobble = Math.sin(frame / 60) * 2;

  const leftEdge = points.map((p) => `${p.x - gap / 2 + wobble} ${p.y}`);
  const rightEdge = points.map((p) => `${p.x + gap / 2 + wobble} ${p.y}`);

  const leftPath = `M 0 0 L ${leftEdge[0]} ${leftEdge
    .map((p) => `L ${p}`)
    .join(" ")} L 0 ${height} Z`;
  const rightPath = `M ${width} 0 L ${rightEdge[0]} ${rightEdge
    .map((p) => `L ${p}`)
    .join(" ")} L ${width} ${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
    >
      <defs>
        <clipPath id={`divider-left-${seed}`}>
          <path d={leftPath} />
        </clipPath>
        <clipPath id={`divider-right-${seed}`}>
          <path d={rightPath} />
        </clipPath>
        {/* dark crevice gradient visible in the gap */}
        <linearGradient id={`crevice-${seed}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(20,14,6,0.45)" />
          <stop offset="50%" stopColor="rgba(20,14,6,0.15)" />
          <stop offset="100%" stopColor="rgba(20,14,6,0.45)" />
        </linearGradient>
      </defs>

      {/* shadow strip inside the crack */}
      <rect
        x={width * 0.4}
        y={0}
        width={width * 0.2}
        height={height}
        fill={`url(#crevice-${seed})`}
      />

      {/* pale fiber edge on both sides of the tear */}
      <polyline
        points={leftEdge.map((p) => p).join(" ")}
        fill="none"
        stroke="#fffdf6"
        strokeWidth={3}
        strokeOpacity={0.85}
      />
      <polyline
        points={rightEdge.map((p) => p).join(" ")}
        fill="none"
        stroke="#fffdf6"
        strokeWidth={3}
        strokeOpacity={0.85}
      />
    </svg>
  );
};

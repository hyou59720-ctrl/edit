import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

// Paper-cutout back-view businessman with breathing/idle motion
export const Character: React.FC<{
  size?: number;
  headColor: string;
  bodyColor?: string;
  delay?: number;
}> = ({ size = 180, headColor, bodyColor = "#4a4a4a", delay = 0 }) => {
  const frame = useCurrentFrame() - delay;
  const breathe = interpolate(
    Math.sin(frame / 22),
    [-1, 1],
    [0, 1]
  );
  const scaleY = 1 + breathe * 0.012;
  const floatY = Math.sin(frame / 30) * 4;

  return (
    <svg
      viewBox="0 0 120 160"
      width={size}
      height={(size * 160) / 120}
      style={{
        transform: `translateY(${floatY}px) scaleY(${scaleY})`,
        transformOrigin: "bottom center",
        filter: "drop-shadow(0 8px 10px rgba(20,15,5,0.3))",
      }}
    >
      {/* legs */}
      <rect x="42" y="118" width="14" height="38" rx="3" fill="#3a3a3a" />
      <rect x="64" y="118" width="14" height="38" rx="3" fill="#333" />
      {/* torso / jacket */}
      <path
        d="M35 62 Q60 50 85 62 L90 122 Q60 132 30 122 Z"
        fill={bodyColor}
      />
      {/* jacket back seam */}
      <path
        d="M60 58 L60 126"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth={2}
      />
      {/* arms */}
      <path d="M33 65 Q22 85 28 112 L36 110 Q33 88 40 68 Z" fill={bodyColor} />
      <path d="M87 65 Q98 85 92 112 L84 110 Q87 88 80 68 Z" fill={bodyColor} />
      {/* neck */}
      <rect x="53" y="44" width="14" height="14" fill="#e0b58c" />
      {/* head */}
      <circle cx="60" cy="32" r="20" fill={headColor} />
    </svg>
  );
};

// src/project/Components/UI/Popups/CheckBadge.tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const CheckBadge = ({
  text = "Practical",
  color = "#22D3EE",
  scale: customScale = 1,
  durationInFrames,
}: {
  text?: string;
  color?: string;
  scale?: number;
  durationInFrames?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hexToRgb = (hex: string) => {
    const m = hex.replace("#", "");
    const bigint = parseInt(m.length === 3 ? m.split("").map(c => c + c).join("") : m, 16);
    return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
  };
  const rgb = hexToRgb(color);

  const entranceScale = spring({ frame, fps, config: { damping: 10, mass: 0.6, stiffness: 220 } });
  const opacityIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  const EXIT_DURATION = 12;
  const exitStart = durationInFrames ? durationInFrames - EXIT_DURATION : Infinity;
  const exitOpacity = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const exitScale = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  // checkmark draw progress
  const checkProgress = interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = Math.sin(frame / 5) * 12 + 22;
  const idleFloat = Math.sin(frame / 14) * 5;

  return (
    <div
      style={{
        opacity: Math.min(opacityIn, exitOpacity),
        transform: `scale(${entranceScale * customScale * exitScale}) translateY(${idleFloat}px)`,
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "20px 34px",
        borderRadius: "50px",
        background: `linear-gradient(135deg, rgba(${rgb},0.22) 0%, rgba(8,8,18,0.85) 100%)`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: `2px solid rgba(${rgb}, 0.65)`,
        boxShadow: `0 18px 35px rgba(0,0,0,0.5), 0 0 ${pulse}px rgba(${rgb}, 0.45)`,
      }}
    >
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r="23" fill="none" stroke={color} strokeWidth="3" opacity={0.4} />
        <path
          d="M15 27 L22 34 L38 16"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="40"
          strokeDashoffset={40 * (1 - checkProgress)}
          style={{ filter: `drop-shadow(0 0 8px rgba(${rgb},0.9))` }}
        />
      </svg>

      <span
        style={{
          fontSize: "38px",
          fontWeight: 900,
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#ffffff",
          textShadow: `0 0 16px rgba(${rgb}, 0.8)`,
        }}
      >
        {text}
      </span>
    </div>
  );
};
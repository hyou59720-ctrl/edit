// src/project/Components/UI/Popups/CircleTimer.tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const CircleTimer = ({
  seconds = 30,
  countDirection = "down",
  text = "sec",              // 🆕 label — "sec", "hour", "day", "min" ወዘተ
  size = 220,
  strokeWidth = 20,
  color = "#F59E0B",
  bgColor = "rgba(255,255,255,0.15)",
  scale: customScale = 1,
  durationInFrames,
}: {
  seconds?: number;
  countDirection?: "down" | "up";
  text?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  scale?: number;
  durationInFrames?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ============ 🌟 ENTRANCE ============
  const entranceScale = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.7 },
  });

  const opacityIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ============ 🌟 EXIT ============
  const EXIT_DURATION = 12;
  const exitStart = durationInFrames ? durationInFrames - EXIT_DURATION : Infinity;

  const exitScale = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0.7], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const opacityOut = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const finalScale = entranceScale * customScale * exitScale;
  const finalOpacity = Math.min(opacityIn, opacityOut);

  // ============ 🕐 FRAME-PROPORTIONAL COUNTING ============
  const totalFrames = durationInFrames && durationInFrames > 0 ? durationInFrames : seconds * fps;

  const currentSecond =
    countDirection === "down"
      ? Math.round(
          interpolate(frame, [0, totalFrames], [seconds, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        )
      : Math.round(
          interpolate(frame, [0, totalFrames], [0, seconds], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        );

  const progress = Math.min(Math.max(frame / totalFrames, 0), 1);

  // ============ ⭕ CIRCLE PROGRESS RING ============
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const ringProgress = countDirection === "down" ? 1 - progress : progress;
  const dashOffset = circumference * (1 - ringProgress);

  const hexToRgb = (hex: string) => {
    const m = hex.replace("#", "");
    const bigint = parseInt(m.length === 3 ? m.split("").map(c => c + c).join("") : m, 16);
    return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
  };
  const rgb = hexToRgb(color);

  const tickPulse = 1 + Math.sin((frame % fps) / fps * Math.PI) * 0.04;

  return (
    <div
      style={{
        opacity: finalOpacity,
        transform: `scale(${finalScale})`,
        width: size,
        height: size,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size}
        height={size}
        style={{
          position: "absolute",
          transform: "rotate(-90deg)",
          filter: `drop-shadow(0 0 ${10 + Math.sin(frame / 5) * 6}px rgba(${rgb}, 0.6))`,
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>

      <div
        style={{
          transform: `scale(${tickPulse})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: size * 0.32,
            fontWeight: 900,
            fontFamily: "system-ui, -apple-system, sans-serif",
            background: `linear-gradient(180deg, #ffffff 0%, ${color} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: `0 0 20px rgba(${rgb}, 0.8)`,
            lineHeight: 1,
          }}
        >
          {currentSecond}
        </span>
        <span
          style={{
            fontSize: size * 0.08,
            fontWeight: 700,
            color: "rgba(255,255,255,0.75)",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
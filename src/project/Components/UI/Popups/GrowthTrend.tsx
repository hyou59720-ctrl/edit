// src/project/Components/UI/Popups/GrowthTrend.tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const GrowthTrend = ({
  text = "High Demand",
  color = "#F59E0B",
  scale: customScale = 1,
  size = 1,
  durationInFrames,
}: {
  text?: string;
  color?: string;
  scale?: number;
  size?: number;
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

  // ============ 🌟 CONTAINER ENTRANCE ============
  const opacityIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const translateYIn = interpolate(frame, [0, 22], [130, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ============ 🌟 EXIT ============
  const EXIT_DURATION = 16;
  const exitStart = durationInFrames ? durationInFrames - EXIT_DURATION : Infinity;
  const exitOpacity = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const translateYOut = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [0, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const exitScale = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  const finalOpacity = Math.min(opacityIn, exitOpacity);
  const finalTranslateY = translateYIn + translateYOut;
  const idleFloat = Math.sin(frame / 14) * 5;
  const glowPulse = Math.sin(frame / 5) * 12 + 22;

  // ============ 📊 BAR CHART ============
  const barHeights = [30, 50, 72, 96, 122];
  const barWidth = 30;
  const barGap = 14;
  const staggerFrames = 8;

  const bars = barHeights.map((h, i) => {
    const barStart = i * staggerFrames;
    const localFrame = frame - barStart;

    const growProgress = spring({
      frame: localFrame,
      fps,
      config: { damping: 10, mass: 0.5, stiffness: 200 },
    });
    const clampedGrow = Math.max(0, Math.min(growProgress, 1.15));

    const barOpacity = interpolate(localFrame, [0, 6], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return { height: h, grow: clampedGrow, opacity: barOpacity, x: i * (barWidth + barGap) };
  });

  const chartWidth = barHeights.length * (barWidth + barGap) - barGap;
  const chartHeight = 140;

  // ============ ✍️ HAND-DRAWN JAGGED LINE — ሙሉ በሙሉ ከ አሞሌዎቹ በላይ ============
  // 🔑 KEY FIX: tallest bar top = chartHeight - 122 = 18. Line ሁሉም ከዛ በላይ (negative y) እንዲሆን
  const lineTopClearance = 5; // ከ ረጅሙ አሞሌ ጫፍ ስንት ርቀት በላይ እንደሚጀምር
  const baseY = chartHeight - barHeights[barHeights.length - 1] - lineTopClearance; // መነሻ Y (ከ ሁሉም አሞሌ በላይ)

  const startX = -10;
  const startY = baseY;
  const endX = chartWidth + 50;
  const endY = baseY - 130; // ከ መነሻው ብዙ ወደ ላይ

  // hand-drawn zigzag points — ሁሉም ከ አሞሌዎቹ በላይ ባለው ክልል ውስጥ
  const rawPoints: [number, number][] = [
    [startX, startY],
    [startX + 30, startY - 10],
    [startX + 55, startY - 2],
    [startX + 90, startY - 35],
    [startX + 120, startY - 25],
    [startX + 155, startY - 55],
    [startX + 175, startY - 45],
    [startX + 210, startY - 80],
    [startX + 240, startY - 65],
    [startX + 270, startY - 100],
    [endX, endY],
  ];

  const segLens: number[] = [];
  for (let i = 1; i < rawPoints.length; i++) {
    const [x1, y1] = rawPoints[i - 1];
    const [x2, y2] = rawPoints[i];
    segLens.push(Math.hypot(x2 - x1, y2 - y1));
  }
  const totalLen = segLens.reduce((a, b) => a + b, 0);

  const pathD = `M ${rawPoints.map(p => p.join(",")).join(" L ")}`;

  const drawStartFrame = 8;
  const drawEndFrame = 70;
  const rawProgress = interpolate(frame, [drawStartFrame, drawEndFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = rawProgress * rawProgress * (3 - 2 * rawProgress);

  const dashOffset = totalLen * (1 - eased);

  const tipIndex = Math.min(
    Math.floor(eased * (rawPoints.length - 1)),
    rawPoints.length - 2
  );
  const localT = eased * (rawPoints.length - 1) - tipIndex;
  const [tx1, ty1] = rawPoints[tipIndex];
  const [tx2, ty2] = rawPoints[Math.min(tipIndex + 1, rawPoints.length - 1)];
  const tipX = tx1 + (tx2 - tx1) * localT;
  const tipY = ty1 + (ty2 - ty1) * localT;
  const jitterX = Math.sin(frame * 3) * 1.2;
  const jitterY = Math.cos(frame * 2.5) * 1.2;

  const showTip = eased > 0.01 && eased < 0.995;

  return (
    <div
      style={{
        position: "relative",
        opacity: finalOpacity,
        transform: `scale(${customScale * exitScale * size}) translateY(${finalTranslateY + idleFloat}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <svg
        width={chartWidth + 80}
        height={chartHeight + 170}
        viewBox={`-20 ${endY - 20} ${chartWidth + 80} ${chartHeight - endY + 40}`}
        style={{
          overflow: "visible",
          filter: `drop-shadow(0 0 ${glowPulse}px rgba(${rgb},0.7))`,
        }}
      >
        {/* Bars */}
        {bars.map((b, i) => {
          const h = b.height * Math.min(b.grow, 1);
          const y = chartHeight - h;
          return (
            <g key={i} opacity={b.opacity}>
              <rect
                x={b.x}
                y={y}
                width={barWidth}
                height={h}
                rx={6}
                fill="url(#barGradient)"
                style={{ filter: `drop-shadow(0 0 8px rgba(${rgb},0.8))` }}
              />
              <rect x={b.x} y={y} width={barWidth} height={4} rx={2} fill="#ffffff" opacity={0.85} />
            </g>
          );
        })}

        {/* ✍️ Hand-drawn jagged line — ከ አሞሌዎቹ ሙሉ በሙሉ በላይ */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLen}
          strokeDashoffset={dashOffset}
          style={{ filter: `drop-shadow(0 0 10px rgba(${rgb},0.95))` }}
        />

        {showTip && (
          <circle
            cx={tipX + jitterX}
            cy={tipY + jitterY}
            r={7}
            fill="#ffffff"
            style={{ filter: `drop-shadow(0 0 14px rgba(${rgb},1))` }}
          />
        )}

        <polygon
          points={`${endX},${endY} ${endX - 18},${endY + 2} ${endX - 6},${endY + 16}`}
          fill={color}
          opacity={eased > 0.97 ? 1 : 0}
          style={{ filter: `drop-shadow(0 0 10px rgba(${rgb},0.95))` }}
        />

        <defs>
          <linearGradient id="barGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      <span
        style={{
          marginTop: "16px",
          fontSize: "44px",
          fontWeight: 900,
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "1px",
          background: `linear-gradient(180deg, #ffffff 0%, ${color} 90%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textShadow: `0 0 22px rgba(${rgb}, 0.9), 0 0 44px rgba(${rgb}, 0.5)`,
        }}
      >
        {text}
      </span>
    </div>
  );
};
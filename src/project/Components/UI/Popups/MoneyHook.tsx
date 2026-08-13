// src/project/Components/UI/Popups/MoneyHook.tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const MoneyHook = ({
  text = "20,000 ETB",
  width,
  height,
  borderRadius = "24px",
  scale: customScale = 1,
  color = "#34D399", // 🎨 አዲስ ፕሮፕ — main accent color
  durationInFrames, // 🆕 ለ exit animation የግድ ያስፈልጋል (endFrame - startFrame)
}: {
  text?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  scale?: number;
  color?: string;
  durationInFrames?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ============ 🌟 ENTRANCE ANIMATION ============
  const entranceScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const translateYIn = interpolate(frame, [0, 20], [40, 0], {
    extrapolateRight: "clamp",
  });

  const opacityIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ============ 🌟 EXIT ANIMATION ============
  // durationInFrames ካልተሰጠ exit animation አይሰራም (ድሮ እንደነበረው ጥፍት ብሎ ይጠፋል)
  const EXIT_DURATION = 15; // ስንት frame ውስጥ እንደሚጠፋ
  const exitStart = durationInFrames ? durationInFrames - EXIT_DURATION : Infinity;

  const exitScale = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0.], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const translateYOut = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [0, -50], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const opacityOut = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // ============ 🌟 IDLE / STYLE ANIMATIONS ============
  const idleFloat = Math.sin(frame / 15) * 6;
  const pulse = Math.sin(frame / 5) * 10 + 20;
  const shimmerX = interpolate(frame % 60, [0, 60], [-150, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const coinRotate = Math.sin(frame / 8) * 15;

  // ============ 🌟 COMBINE ALL ============
  const finalScale = entranceScale * customScale * exitScale;
  const finalTranslateY = translateYIn + idleFloat + translateYOut;
  const finalOpacity = Math.min(opacityIn, opacityOut);

  // color-ን ለ rgba አጠቃቀም (glow/border) ወደ rgb እንቀይረው
  const hexToRgb = (hex: string) => {
    const m = hex.replace("#", "");
    const bigint = parseInt(m.length === 3 ? m.split("").map(c => c + c).join("") : m, 16);
    return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
  };
  const rgb = hexToRgb(color);

  return (
    <div
      style={{
        width: width,
        height: height,
        opacity: finalOpacity,
        transform: `scale(${finalScale}) translateY(${finalTranslateY}px) rotate(-3deg)`,
        background: `linear-gradient(135deg, rgba(${rgb},0.20) 0%, rgba(${rgb},0.10) 100%)`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: `2px solid rgba(${rgb}, 0.65)`,
        borderRadius: borderRadius,
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 18px 35px rgba(0,0,0,0.55), 0 0 ${pulse}px rgba(${rgb}, 0.45), inset 0 1px 0 rgba(255,255,255,0.15)`,
      }}
    >
      {/* Shimmer overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${shimmerX}px`,
          width: "60px",
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
          transform: "skewX(-20deg)",
          pointerEvents: "none",
        }}
      />

      <span
        style={{
          fontSize: "48px",
          filter: `drop-shadow(0 0 12px rgba(${rgb}, 0.9))`,
          transform: `rotate(${coinRotate}deg)`,
          display: "inline-block",
        }}
      >
        💸
      </span>

      <span
        style={{
          fontSize: "42px",
          fontWeight: 900,
          letterSpacing: "1px",
          background: `linear-gradient(180deg, #ffffff 0%, #d1fae5 60%, ${color} 100%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textShadow: `0 0 18px rgba(${rgb}, 0.9), 0 0 35px rgba(${rgb}, 0.55)`,
          fontFamily: "system-ui, -apple-system, sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
};
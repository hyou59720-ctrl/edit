// src/project/Components/UI/Popups/MoneyHook.tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const MoneyHook = ({
  text = "20,000 ETB",
  width,
  height,
  borderRadius = "28px",
  scale: customScale = 1,
}: {
  text?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  scale?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 🌟 Explosive pop-in
  const animatedScale = spring({
    frame,
    fps,
    config: { damping: 9, mass: 0.6, stiffness: 180 },
  });

  // 🌟 Entry: drop + bounce ከላይ
  const translateY = interpolate(frame, [0, 18], [-60, 0], {
    extrapolateRight: "clamp",
  });

  // 🌟 Continuous wobble rotation (ያበደ feel)
  const wobble = Math.sin(frame / 6) * 4;

  // 🌟 Idle float
  const idleFloat = Math.sin(frame / 12) * 8;

  // 🌟 Chaotic pulse glow — ባለ ብዙ ቀለም
  const pulse = Math.sin(frame / 4) * 15 + 25;
  const hueShift = (frame * 3) % 40; // ከአረንጓዴ ወደ ቢጫ ትንሽ ይሸጋገራል

  // 🌟 Border rotating gradient (spinning ring effect)
  const borderRotate = (frame * 4) % 360;

  // 🌟 Flying coins particles (SVG) - 5 coins በዙሪያው
  const coinCount = 6;
  const coins = Array.from({ length: coinCount }).map((_, i) => {
    const angle = (i / coinCount) * Math.PI * 2 + frame / 25;
    const radius = 90 + Math.sin(frame / 10 + i) * 15;
    const cx = Math.cos(angle) * radius;
    const cy = Math.sin(angle) * radius * 0.55;
    const coinScale = interpolate(frame, [0, 15], [0, 1], {
      extrapolateRight: "clamp",
    });
    const coinRotate = frame * 6 + i * 60;
    const opacity = interpolate(frame, [0, 12], [0, 1], {
      extrapolateRight: "clamp",
    });
    return { cx, cy, coinScale, coinRotate, opacity, key: i };
  });

  // 🌟 Text shake (money hype vibe)
  const textShake = Math.sin(frame / 2) * 1.5;

  return (
    <div
      style={{
        position: "relative",
        width: width,
        height: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Flying coin particles በዙሪያው */}
      {coins.map((c) => (
        <div
          key={c.key}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(${c.cx}px, ${c.cy}px) scale(${c.coinScale}) rotate(${c.coinRotate}deg)`,
            opacity: c.opacity,
            filter: "drop-shadow(0 0 8px rgba(250, 204, 21, 0.9))",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#FACC15" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="6.5" fill="none" stroke="#B45309" strokeWidth="1" />
            <text
              x="12"
              y="16"
              textAnchor="middle"
              fontSize="9"
              fontWeight="900"
              fill="#B45309"
            >
              ብ
            </text>
          </svg>
        </div>
      ))}

      {/* Rotating gradient ring in background */}
      <div
        style={{
          position: "absolute",
          width: "calc(100% + 16px)",
          height: "calc(100% + 16px)",
          borderRadius: borderRadius,
          background: `conic-gradient(from ${borderRotate}deg, #34d399, #facc15, #10b981, #fbbf24, #34d399)`,
          filter: "blur(2px)",
          opacity: 0.9,
          zIndex: 0,
        }}
      />

      {/* Main card */}
      <div
        style={{
          position: "relative",
          width: width,
          height: height,
          transform: `scale(${animatedScale * customScale}) translateY(${translateY + idleFloat}px) rotate(${wobble}deg)`,
          background:
            "linear-gradient(145deg, rgba(6, 78, 59, 0.55) 0%, rgba(16, 185, 129, 0.35) 50%, rgba(6, 78, 59, 0.55) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "3px solid rgba(250, 204, 21, 0.85)",
          borderRadius: borderRadius,
          padding: "18px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          overflow: "hidden",
          zIndex: 1,
          boxShadow: `0 20px 40px rgba(0,0,0,0.6), 0 0 ${pulse}px rgba(250, 204, 21, ${0.45 + hueShift / 200}), inset 0 2px 0 rgba(255,255,255,0.25)`,
        }}
      >
        {/* Diagonal shine sweep */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${interpolate(frame % 50, [0, 50], [-200, 200])}px`,
            width: "80px",
            height: "200%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            transform: "skewX(-25deg)",
            pointerEvents: "none",
          }}
        />

        {/* SVG Cash Stack Icon */}
        <svg
          width="52"
          height="52"
          viewBox="0 0 64 64"
          fill="none"
          style={{
            filter: "drop-shadow(0 0 14px rgba(250, 204, 21, 1))",
            transform: `rotate(${wobble * -2}deg)`,
          }}
        >
          <rect x="6" y="30" width="46" height="26" rx="4" fill="#059669" stroke="#FACC15" strokeWidth="2" />
          <rect x="12" y="22" width="46" height="26" rx="4" fill="#10B981" stroke="#FACC15" strokeWidth="2" />
          <rect x="18" y="14" width="46" height="26" rx="4" fill="#34D399" stroke="#FDE68A" strokeWidth="2" />
          <circle cx="41" cy="27" r="7" fill="#FACC15" stroke="#B45309" strokeWidth="1.5" />
          <text
            x="41"
            y="30.5"
            textAnchor="middle"
            fontSize="9"
            fontWeight="900"
            fill="#B45309"
          >
            ብር
          </text>
        </svg>

        {/* Text with shake + gradient */}
        <span
          style={{
            fontSize: "44px",
            fontWeight: 900,
            letterSpacing: "1px",
            transform: `translateX(${textShake}px)`,
            background:
              "linear-gradient(180deg, #ffffff 0%, #fef9c3 40%, #facc15 75%, #34d399 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow:
              "0 0 20px rgba(250, 204, 21, 0.9), 0 0 40px rgba(16, 185, 129, 0.6)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
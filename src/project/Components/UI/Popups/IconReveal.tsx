// src/project/Components/UI/Popups/IconReveal.tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";

export const IconReveal = ({
  text = "Rofi Edits",
  imageSrc = "Rofi.png",  
  color = "#8B5CF6",
  scale: customScale = 1,
  size = 1,
  durationInFrames,
}: {
  text?: string;
  imageSrc?: string;
  color?: string;
  scale?: number;
  size?: number;
  durationInFrames?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Color Converter
  const hexToRgb = (hex: string) => {
    const m = hex.replace("#", "");
    const bigint = parseInt(m.length === 3 ? m.split("").map(c => c + c).join("") : m, 16);
    return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
  };
  const rgb = hexToRgb(color);

  // ============ 🌟 ENTRANCE (Main Card) ============
  const entranceScale = spring({ frame, fps, config: { damping: 12, mass: 0.7, stiffness: 200 } });
  const opacityIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const translateYIn = interpolate(frame, [0, 20], [80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ============ 🌟 EXIT ============
  const EXIT_DURATION = 15;
  const exitStart = durationInFrames ? durationInFrames - EXIT_DURATION : Infinity;
  const exitOpacity = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const translateYOut = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const exitScale = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  const finalOpacity = Math.min(opacityIn, exitOpacity);
  const finalTranslateY = translateYIn + translateYOut;
  const finalScale = entranceScale * customScale * exitScale * size;

  // ============ 🌀 CONTINUOUS EFFECTS (Idle) ============
  const idleFloat = Math.sin(frame / 20) * 8;
  const idleRotate = Math.sin(frame / 25) * 1.5;
  const pulseGlow = Math.sin(frame / 8) * 15 + 30;
  
  // Ring Rotations
  const ring1Rotate = frame * 3;
  const ring2Rotate = -frame * 2.5;

  // ============ 🎭 ICON 3D REVEAL ============
  // አይከኑ ትንሽ ዘግይቶ እና በ 3D እየተሽከረከረ ይገባል
  const iconSpring = spring({ frame: frame - 5, fps, config: { damping: 10, mass: 0.6, stiffness: 220 } });
  const iconRotateY = interpolate(iconSpring, [0, 1], [-90, 0]);

  // ============ 🔤 TEXT SLIDE-IN ============
  const textTranslateX = interpolate(frame, [8, 22], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textOpacity = interpolate(frame, [8, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity: finalOpacity,
        transform: `scale(${finalScale}) translateY(${finalTranslateY + idleFloat}px) rotate(${idleRotate}deg)`,
        display: "flex",
        alignItems: "center",
        gap: "24px",
        padding: "20px 40px 20px 24px",
        borderRadius: "40px",
        // Modern Premium Glassmorphism
        background: `linear-gradient(145deg, rgba(10, 10, 15, 0.9) 0%, rgba(${rgb}, 0.15) 100%)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        borderTop: `1px solid rgba(255, 255, 255, 0.3)`, // Top highlight
        borderBottom: `2px solid rgba(${rgb}, 0.8)`, // Bottom neon glow
        boxShadow: `
          0 25px 45px -10px rgba(0,0,0,0.7), 
          inset 0 0 20px rgba(${rgb}, 0.2),
          0 10px ${pulseGlow}px rgba(${rgb}, 0.3)
        `,
      }}
    >
      {/* 🖼️ ICON CONTAINER */}
      <div
        style={{
          position: "relative",
          width: "84px",
          height: "84px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${iconSpring}) perspective(600px) rotateY(${iconRotateY}deg)`,
        }}
      >
        {/* Outer Dashed Ring (Sci-Fi Effect) */}
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            border: `3px dashed rgba(${rgb}, 0.8)`,
            transform: `rotate(${ring1Rotate}deg)`,
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
        
        {/* Inner Dotted Ring */}
        <div
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: "50%",
            border: `3px dotted rgba(255, 255, 255, 0.6)`,
            transform: `rotate(${ring2Rotate}deg)`,
          }}
        />

        {/* Core Image Wrapper */}
        <div
          style={{
            position: "relative",
            width: "74px",
            height: "74px",
            borderRadius: "50%",
            overflow: "hidden",
            background: "#000",
            border: `2px solid rgba(255, 255, 255, 0.9)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 25px ${color}, inset 0 0 10px #fff`,
          }}
        >
          {/* Shimmer/Glare over the image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "50%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
              transform: "skewX(-25deg)",
              left: `${(frame % 80) * 3 - 100}%`, // Moving glare
              zIndex: 10,
            }}
          />
          <Img
            src={staticFile(imageSrc)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(1.05)`, // slight zoom
            }}
          />
        </div>
      </div>

      {/* 🔤 TEXT CONTAINER */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity: textOpacity,
          transform: `translateX(${textTranslateX}px)`,
        }}
      >
        <span
          style={{
            fontSize: "48px",
            fontWeight: 900,
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            letterSpacing: "1.5px",
            background: `linear-gradient(90deg, #ffffff 0%, ${color} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: `0 4px 12px rgba(${rgb}, 0.6)`,
            whiteSpace: "nowrap",
            textTransform: "uppercase",
            lineHeight: "1.1",
          }}
        >
          {text}
        </span>
        
        {/* Optional glowing underline / accent */}
        <div 
          style={{
            width: "40%",
            height: "4px",
            background: color,
            borderRadius: "2px",
            marginTop: "6px",
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      </div>
    </div>
  );
};

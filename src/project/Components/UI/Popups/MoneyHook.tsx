// src/project/Components/UI/Popups/MoneyHook.tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const MoneyHook = ({
  text = "20,000 ETB" 
  }: { 
  text?: string 
  }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 🌟 አኒሜሽን 1: ብቅ ማለት (Pop Up)
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  // 🌟 አኒሜሽን 2: ወደ ላይ መንሳፈፍ (Floating up)
  const translateY = interpolate(frame, [0, 20], [40, 0], {
    extrapolateRight: "clamp",
  });

  // 🌟 አኒሜሽን 3: ማብረቅረቅ (Pulse Glow)
  const pulse = Math.sin(frame / 5) * 10 + 20;

  return (
    <div
      style={{
        transform: `scale(${scale}) translateY(${translateY}px) rotate(-3deg)`,
        background: "rgba(16, 185, 129, 0.15)", // ስስ አረንጓዴ Glass
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "2px solid rgba(52, 211, 153, 0.6)",
        borderRadius: "20px",
        padding: "15px 30px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: `0 15px 30px rgba(0,0,0,0.5), 0 0 ${pulse}px rgba(52, 211, 153, 0.4)`,
      }}
    >
      <span style={{ fontSize: "45px", filter: "drop-shadow(0 0 10px rgba(52, 211, 153, 0.8))" }}>
        💸
      </span>
      <span
        style={{
          fontSize: "40px",
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "1px",
          textShadow: "0 0 15px rgba(52, 211, 153, 0.8), 0 0 30px rgba(16, 185, 129, 0.5)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {text}
      </span>
    </div>
  );
};

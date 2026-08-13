// src/project/Components/UI/Popups/OnlineBadge.tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const OnlineBadge = ({
  text = "100% ONLINE",
  color = "#00E5FF",
  scale: customScale = 1,
  size = 1, // እዚህ ጋር size ተጨምሯል (Default: 1)
  durationInFrames,
}: {
  text?: string;
  color?: string;
  scale?: number;
  size?: number; // የ size prop አይነት (Type)
  durationInFrames?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ቀለሙን ወደ RGB ለመቀየር
  const hexToRgb = (hex: string) => {
    const m = hex.replace("#", "");
    const bigint = parseInt(m.length === 3 ? m.split("").map(c => c + c).join("") : m, 16);
    return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
  };
  const rgb = hexToRgb(color);

  // የመግቢያ አኒሜሽን (Entrance)
  const entranceScale = spring({ frame, fps, config: { damping: 14, mass: 0.8, stiffness: 100 } });
  const opacityIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // የመውጫ አኒሜሽን (Exit)
  const EXIT_DURATION = 15;
  const exitStart = durationInFrames ? durationInFrames - EXIT_DURATION : Infinity;
  const exitOpacity = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const exitScale = durationInFrames
    ? interpolate(frame, [exitStart, exitStart + EXIT_DURATION], [1, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  // ቀጣይነት ያላቸው እንቅስቃሴዎች
  const idleFloat = Math.sin(frame / 20) * 8; 
  const glowPulse = interpolate(Math.sin(frame / 10), [-1, 1], [0.3, 0.8]); 
  
  // የ "Live" አረንጓዴ ነጥብ ብልጭ ድርግም ማለት
  const dotPulse = interpolate(Math.sin(frame / 8), [-1, 1], [0.3, 1]);

  // የ Globe ማሽከርከሪያ
  const globeRotation = frame * 2.5;

  // 4 የሲግናል ባሮች
  const bars = [0, 1, 2, 3].map((i) => {
    const t = (frame + i * 5) % 20;
    return interpolate(t, [0, 10, 20], [0.25, 1, 0.25]);
  });

  // እዚህ ጋር size ወደ አጠቃላይ scale ተባዝቶ ገብቷል 👇
  const finalScale = entranceScale * customScale * size * exitScale;

  return (
    <div
      style={{
        opacity: Math.min(opacityIn, exitOpacity),
        // size እዚህ ጋር ይሰራል (በትልቁ ወይም በትንሹ ለማሳየት)
        transform: `scale(${finalScale}) translateY(${idleFloat}px)`,
        display: "flex",
        alignItems: "center",
        gap: "24px",
        padding: "24px 44px",
        borderRadius: "60px",
        background: `linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(2, 6, 23, 0.95) 100%)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `2px solid rgba(${rgb}, ${glowPulse})`,
        boxShadow: `
          0 25px 50px -12px rgba(0,0,0,0.7),
          inset 0 0 20px rgba(${rgb}, 0.15),
          0 0 35px rgba(${rgb}, ${glowPulse * 0.5})
        `,
      }}
    >
      {/* የራዳር እና የዓለም (Globe) ክፍል */}
      <div style={{ position: "relative", width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: `conic-gradient(from ${frame * 4}deg, transparent 0%, transparent 70%, rgba(${rgb}, 0.8) 100%)`,
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: `2px dashed rgba(${rgb}, 0.4)`,
            transform: `rotate(${-frame}deg)`,
          }}
        />
        
        <svg width="34" height="34" viewBox="0 0 40 40" style={{ filter: `drop-shadow(0 0 10px ${color})`, zIndex: 2 }}>
          <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="3" />
          <ellipse cx="20" cy="20" rx="9" ry="18" fill="none" stroke={color} strokeWidth="2.5" style={{ transformOrigin: 'center', transform: `rotateY(${globeRotation}deg)` }} />
          <line x1="2" y1="20" x2="38" y2="20" stroke={color} strokeWidth="2.5" />
        </svg>
      </div>

      {/* የፅሁፍ እና Live Dot ክፍል */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            backgroundColor: "#10B981", 
            boxShadow: `0 0 16px #10B981`,
            opacity: dotPulse,
          }}
        />
        <span
          style={{
            fontSize: "42px",
            fontWeight: 900,
            letterSpacing: "2px",
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            background: `linear-gradient(to right, #ffffff 20%, ${color} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: `0 0 25px rgba(${rgb}, 0.5)`,
            textTransform: "uppercase",
          }}
        >
          {text}
        </span>
      </div>

      {/* የዋይፋይ/ሲግናል ባሮች ክፍል */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "36px", marginLeft: "8px" }}>
        {bars.map((scaleY, i) => (
          <div
            key={i}
            style={{
              width: "8px",
              height: `${14 + i * 7.3}px`,
              borderRadius: "4px",
              background: color,
              opacity: scaleY,
              boxShadow: `0 0 15px ${color}`,
              transform: `scaleY(${scaleY})`,
              transformOrigin: "bottom",
            }}
          />
        ))}
      </div>
    </div>
  );
};

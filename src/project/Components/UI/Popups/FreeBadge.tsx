// src/project/Components/UI/Popups/FreeBadge.tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const FreeBadge = ({
  text = "FREE",
  color = "#F43F5E",
  scale: customScale = 1,
  size = 1, // አዲሱ የ size prop እዚህ ተጨምሯል
  durationInFrames,
}: {
  text?: string;
  color?: string;
  scale?: number;
  size?: number; // የ size type
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

  // ፈጣን እና ጉልበት ያለው የመግቢያ አኒሜሽን
  const entranceScale = spring({ frame, fps, config: { damping: 8, mass: 0.6, stiffness: 300 } });
  const opacityIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const rotateIn = interpolate(frame, [0, 15], [-25, -5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // የመውጫ አኒሜሽን
  const EXIT_DURATION = 12;
  const exitStart = durationInFrames ? durationInFrames - EXIT_DURATION : Infinity;
  const exitOpacity = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const exitScale = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  // ቀጣይነት ያለው እንቅስቃሴ (Pulse & Wobble)
  const pulse = Math.sin(frame / 5) * 15 + 25;
  const wobble = Math.sin(frame / 10) * 4;
  
  // የኮከብ (Sparkle) ማሽከርከሪያ
  const sparkleRotation = frame * 4;

  // ድንገተኛ ፍንዳታ (Shockwave burst)
  const shockScale = interpolate(frame, [0, 20], [0.5, 2.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shockOpacity = interpolate(frame, [0, 20], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Sizeን ከአጠቃላይ Scale ጋር ማዋሃድ 👇
  const finalScale = entranceScale * customScale * size * exitScale;

  return (
    <div
      style={{
        position: "relative",
        opacity: Math.min(opacityIn, exitOpacity),
        // size እዚህ ላይ ይሰራል
        transform: `scale(${finalScale}) rotate(${rotateIn + wobble}deg)`,
        display: "inline-block",
      }}
    >
      {/* የፍንዳታ ቀለበት (Shockwave ring) */}
      <div
        style={{
          position: "absolute",
          inset: "-10px",
          borderRadius: "30px",
          border: `4px solid ${color}`,
          opacity: shockOpacity,
          transform: `scale(${shockScale})`,
          pointerEvents: "none",
        }}
      />

      {/* ዋናው የ Free ካርድ */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "18px 40px",
          borderRadius: "24px",
          background: `linear-gradient(135deg, ${color} 0%, #ff7e67 100%)`, // ይበልጥ ደማቅ እና ማራኪ ከለር
          boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6), 0 0 ${pulse}px rgba(${rgb}, 0.8)`,
          overflow: "hidden",
        }}
      >
        {/* የኩፖን (Ticket/Coupon) ስታይል የተቆራረጠ ቦርደር ውስጡ ላይ */}
        <div
          style={{
            position: "absolute",
            inset: "8px",
            borderRadius: "16px",
            border: "2px dashed rgba(255, 255, 255, 0.6)",
            pointerEvents: "none",
          }}
        />

        {/* የሚያብረቀርቅ ብርሃን (Shimmer Effect) ከላይ ወደ ታች የሚንቀሳቀስ */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "50%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            transform: "skewX(-20deg)",
            animation: "shimmer 3s infinite",
            // Remotion ውስጥ animationን በ frame መስራት እንችላለን 
            left: `${(frame % 90) * 3 - 100}%`, 
          }}
        />

        {/* የዋጋ መለያ (Price Tag) አይከን */}
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))", zIndex: 1 }}
        >
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="4"></line>
        </svg>

        {/* ፅሁፉ */}
        <span
          style={{
            fontSize: "64px",
            fontWeight: 900,
            fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif",
            color: "#ffffff",
            letterSpacing: "4px",
            textTransform: "uppercase",
            textShadow: `0 8px 16px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.5)`,
            zIndex: 1,
          }}
        >
          {text}
        </span>

        {/* የሚያብረቀርቅ ኮከብ (Sparkle) */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="#FFF3C7"
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            transform: `rotate(${sparkleRotation}deg)`,
            filter: "drop-shadow(0 0 8px #FFF3C7)",
          }}
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
        
        {/* ሌላ ትንሽ ኮከብ */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#ffffff"
          style={{
            position: "absolute",
            bottom: "8px",
            left: "14px",
            transform: `rotate(${-sparkleRotation}deg)`,
            filter: "drop-shadow(0 0 5px #ffffff)",
          }}
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
    </div>
  );
};

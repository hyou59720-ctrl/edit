import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

/**
 * BROLL 5 — MONEY (650 VISIBILITY EDITION)
 * Duration: 85 frames (615 to 700)
 * ሁሉም አኒሜሽን በ 35 ፍሬሞች ውስጥ (ማለትም ግሎባል 650 ላይ) አልቆ በደንብ ይታያል
 */

export const MoneyBroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 700 ላይ ሲደርስ Fade out ያደርጋል
  const bgOpacity = interpolate(frame, [75, 85], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ከስር ወደ ላይ ፈጥኖ ይገባል
  const slideUpIn = spring({
    frame,
    fps,
    from: 300,
    to: 0,
    durationInFrames: 12,
    config: { damping: 14, mass: 0.8 },
  });

  // --- "2 YEARS AGO" አኒሜሽን (በፍጥነት ይወጣል) ---
  const oldBarP = spring({
    frame: frame - 5, 
    fps,
    from: 0,
    to: 1,
    durationInFrames: 10,
    config: { damping: 14, mass: 0.5 },
  });
  const oldBarHeight = interpolate(oldBarP, [0, 1], [0, 140]);

  const countP = spring({
    frame: frame - 5,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 12,
    config: { damping: 20 },
  });
  const displayCount = Math.round(interpolate(countP, [0, 1], [0, 100]));

  // --- IMPACT & FLASH ---
  // ልክ frame 17 ላይ ብርሃኑ ይፈነዳል
  const shake = spring({
    frame: frame - 17, 
    fps,
    from: 0,
    to: 1,
    durationInFrames: 8,
    config: { damping: 5, mass: 0.5, stiffness: 200 },
  });
  
  const scaleBounce = interpolate(shake, [0, 0.5, 1], [1, 1.05, 1]);
  const rotateShake = interpolate(shake, [0, 0.25, 0.75, 1], [0, -1, 1, 0]);

  const flashOpacity = interpolate(frame, [16, 18, 25], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- NEW BAR (NOW) ---
  // ግሎባል 650 (ሎካል 35) ላይ ሙሉ ለሙሉ ወጥቶ እንዲያልቅ
  const newBarP = spring({
    frame: frame - 20, 
    fps,
    from: 0,
    to: 1,
    durationInFrames: 15,
    config: { damping: 13, mass: 0.6 },
  });
  const newBarHeight = interpolate(newBarP, [0, 1], [0, 250]);

  const newLabelOpacity = interpolate(frame, [25, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dotPulse = (offset: number) =>
    0.3 + 0.7 * Math.max(0, Math.sin((frame - offset) * 0.35));

  return (
    <AbsoluteFill style={{ opacity: bgOpacity }}>
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(5, 5, 7, 0.0) 40%, rgba(5, 5, 7, 0.7) 65%, rgba(5, 5, 7, 0.95) 85%, #050507 100%)",
        }}
      />

      <AbsoluteFill 
        style={{ 
          opacity: flashOpacity, 
          background: "radial-gradient(circle at 50% 80%, rgba(255,214,10,0.3) 0%, transparent 60%)" 
        }} 
      />

      <AbsoluteFill>
        {[...Array(10)].map((_, i) => {
          const startOffset = 20 + i * 2; 
          const upwardMotion = interpolate(frame, [startOffset, startOffset + 40], [0, 350], { extrapolateRight: "clamp" });
          const sway = Math.sin((frame - startOffset) / 8) * 25;
          const particleOpacity = interpolate(
            frame, 
            [startOffset, startOffset + 10, startOffset + 30, startOffset + 40], 
            [0, 0.6, 0.6, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: 50, 
                left: `${20 + (i * 7)}%`, 
                transform: `translateY(${-upwardMotion}px) translateX(${sway}px)`,
                opacity: particleOpacity,
                color: "#FFD60A",
                fontSize: i % 2 === 0 ? 18 : 28,
                fontWeight: "900",
                textShadow: "0 0 12px rgba(255,214,10,0.8)",
              }}
            >
              $
            </div>
          );
        })}
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingBottom: 150, 
          gap: 64, 
          transform: `translateY(${slideUpIn}px) scale(${scaleBounce}) rotate(${rotateShake}deg)`,
        }}
      >
        <div className="flex flex-col items-center">
          <span
            className="font-black text-white mb-3"
            style={{ fontSize: 40, textShadow: "0 0 10px rgba(255,255,255,0.3)" }}
          >
            ${displayCount}K
          </span>
          <div
            className="w-24 rounded-t-md bg-[#3A3A44] border border-white/10"
            style={{ height: oldBarHeight }}
          />
          <p className="text-[#8A8A96] font-semibold text-xs tracking-[0.25em] uppercase mt-4 text-center leading-relaxed">
            2 years
            <br />
            ago
          </p>
        </div>

        <div className="flex flex-col items-center">
          <span
            className="font-black text-[#FFD60A] mb-3 flex items-center gap-1"
            style={{ 
              fontSize: 40, 
              opacity: newLabelOpacity,
              textShadow: "0 0 15px rgba(255,214,10,0.4)" 
            }}
          >
            NOW
          </span>
          <div className="relative">
            <div
              className="w-24 rounded-t-md bg-[#FFD60A]"
              style={{
                height: newBarHeight,
                boxShadow: "0 0 30px rgba(255,214,10,0.5)",
              }}
            />
            <div
              className="absolute left-0 right-0 flex justify-center gap-1"
              style={{
                bottom: newBarHeight + 10,
                opacity: newLabelOpacity,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-[#FFD60A]"
                  style={{ opacity: dotPulse(i * 4) }}
                />
              ))}
            </div>
          </div>
          <p
            className="text-[#8A8A96] font-semibold text-xs tracking-[0.25em] uppercase mt-4 text-center leading-relaxed"
            style={{ opacity: newLabelOpacity }}
          >
            per
            <br />
            video
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default MoneyBroll;

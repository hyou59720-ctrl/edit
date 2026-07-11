import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface BackgroundProps {
  children: React.ReactNode;
}

export const ModernBackground: React.FC<BackgroundProps> = ({ children }) => {
  const frame = useCurrentFrame();

  // --- ዝግተኛ float እንቅስቃሴ ለ circles (loop በየ 250 frame) ---
  const floatSlow = Math.sin((frame / 250) * Math.PI * 2) * 20;
  const floatMed = Math.sin((frame / 180) * Math.PI * 2 + 1) * 25;
  const floatFast = Math.sin((frame / 130) * Math.PI * 2 + 2) * 15;

  // --- ወርቃማ glow pulse (breathing effect) ---
  const goldPulse = interpolate(
    Math.sin((frame / 90) * Math.PI * 2),
    [-1, 1],
    [0.55, 0.85]
  );
  const goldGlowOpacity = interpolate(
    Math.sin((frame / 100) * Math.PI * 2),
    [-1, 1],
    [0.15, 0.35]
  );

  // --- Wave subtle vertical drift ---
  const waveDrift1 = Math.sin((frame / 200) * Math.PI * 2) * 8;
  const waveDrift2 = Math.sin((frame / 170) * Math.PI * 2 + 1.5) * 6;

  // --- ገና ፕሮጀክቱ ሲጀምር (frame 0-30) ለስላሳ fade-in ለ background ---
  const bgFadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="relative overflow-hidden bg-[#F7FBF3]" style={{ opacity: bgFadeIn }}>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7FBF3] via-[#EEF8E8] to-[#E2F0D9]" />

      {/* Large Soft Circle - ዝግተኛ float */}
      <div
        className="absolute -top-28 -left-32 w-[520px] h-[520px] rounded-full bg-[#B9E18C] opacity-30 blur-3xl"
        style={{ transform: `translate(${floatSlow}px, ${floatSlow * 0.6}px)` }}
      />

      {/* Middle Soft Circle */}
      <div
        className="absolute top-28 left-20 w-[420px] h-[420px] rounded-full bg-[#D8F0B5] opacity-50 blur-3xl"
        style={{ transform: `translate(${-floatMed}px, ${floatMed * 0.5}px)` }}
      />

      {/* Right Circle */}
      <div
        className="absolute top-10 right-[-120px] w-[350px] h-[350px] rounded-full bg-[#D4EDB0] opacity-35 blur-3xl"
        style={{ transform: `translate(${floatFast}px, ${-floatFast}px)` }}
      />

      {/* Decorative Gold Glow - pulse breathing */}
      <div
        className="absolute bottom-44 right-10 w-40 h-40 rounded-full bg-yellow-300 blur-[80px]"
        style={{ opacity: goldGlowOpacity }}
      />

      {/* Extra Gold Accent Glow - ተጨማሪ ወርቃማ ብርሃን */}
      <div
        className="absolute top-20 left-10 w-56 h-56 rounded-full bg-[#F5B400] blur-[100px]"
        style={{ opacity: goldGlowOpacity * 0.6 }}
      />

      {/* Gold Wave - subtle vertical drift */}
      <svg
        className="absolute bottom-[36%] left-0 w-full z-10"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        style={{ transform: `translateY(${waveDrift1}px)` }}
      >
        <path
          d="M0,90
             C250,170
             500,20
             720,90
             C980,170
             1200,40
             1440,100
             L1440,160
             L0,160Z"
          fill="#F5B400"
          style={{ opacity: goldPulse }}
        />
      </svg>

      {/* Green Wave - subtle vertical drift (የተለየ ፍጥነት) */}
      <svg
        className="absolute bottom-[35%] left-0 w-full z-20"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        style={{ transform: `translateY(${waveDrift2}px)` }}
      >
        <path
          d="M0,90
             C250,170
             500,20
             720,90
             C980,170
             1200,40
             1440,100
             L1440,160
             L0,160Z"
          fill="#6CC04A"
        />
      </svg>

      {/* Bottom Green */}
      <div className="absolute bottom-0 left-0 w-full h-[35%] bg-[#6CC04A]" />

      {/* Dark Depth Gradient - አረንጓዴው ስር ጥቁር ጥላ ለጥልቀት */}
      <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-b from-transparent via-transparent to-black/25 z-25" />

      {/* Subtle White Overlay */}
      <div className="absolute bottom-[35%] left-0 w-full h-12 bg-gradient-to-b from-white/30 to-transparent z-30" />

      {/* Content */}
      <AbsoluteFill className="relative z-50 flex flex-col justify-between">
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

interface BackgroundProps {
  opacity?: number;
  children?: React.ReactNode;
}

export const Background: React.FC<BackgroundProps> = ({ opacity = 1, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // በሰከንድ ውስጥ የሚኖረውን ለስላሳ እንቅስቃሴ መቆጣጠሪያ (Time in seconds)
  const time = frame / fps;

  // 1ኛ የብርሃን ኳስ (Purple/Indigo) ኦርጋኒክ እንቅስቃሴ
  const blob1X = Math.sin(time * 0.4) * 90;
  const blob1Y = Math.cos(time * 0.3) * 70;
  const blob1Scale = 1 + Math.sin(time * 0.2) * 0.12;

  // 2ኛ የብርሃን ኳስ (Cyan/Blue) ተቃራኒ እንቅስቃሴ
  const blob2X = Math.cos(time * 0.35) * 110;
  const blob2Y = Math.sin(time * 0.45) * 80;
  const blob2Scale = 1 + Math.cos(time * 0.25) * 0.1;

  // 3ኛ የብርሃን ኳስ (Warm Pink/Peach) መሃል ላይ ለስላሳ ሙቀት የሚሰጥ
  const blob3X = Math.sin(time * 0.5) * 60;
  const blob3Y = Math.sin(time * 0.3) * 80;

  return (
    <AbsoluteFill className="bg-[#030014] flex items-center justify-center font-sans overflow-hidden">
      {/* 1. Premium Noise Texture Overlay (ፊልም ላይ የሚኖር ስስ የድምቀት ግሬን) */}
      <div 
        className="absolute inset-0 opacity-[0.018] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* 2. Apple-Style የሚንቀሳቀሱ የብርሃን ነጸብራቆች (Animated Orbs) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
        
        {/* Blob 1: Deep Violet/Indigo */}
        <div
          className="absolute w-[900px] h-[900px] bg-gradient-to-tr from-[#5E5CE6] to-[#BF7AF0] rounded-full blur-[170px] mix-blend-screen"
          style={{
            top: "-25%",
            left: "-15%",
            transform: `translate(${blob1X}px, ${blob1Y}px) scale(${blob1Scale})`,
            opacity: 0.45,
          }}
        />

        {/* Blob 2: Vibrant Cyan/Teal */}
        <div
          className="absolute w-[850px] h-[850px] bg-gradient-to-br from-[#00D2FF] to-[#0A84FF] rounded-full blur-[150px] mix-blend-screen"
          style={{
            bottom: "-20%",
            right: "-15%",
            transform: `translate(${blob2X}px, ${blob2Y}px) scale(${blob2Scale})`,
            opacity: 0.35,
          }}
        />

        {/* Blob 3: Soft Sunset Pink (ለስላሳ Highlight ለመፍጠር) */}
        <div
          className="absolute w-[650px] h-[650px] bg-[#FF2D55] rounded-full blur-[180px] mix-blend-screen"
          style={{
            top: "20%",
            left: "20%",
            transform: `translate(${blob3X}px, ${blob3Y}px)`,
            opacity: 0.18,
          }}
        />
      </div>

      {/* 3. ስክሪኑ ዳርና ዳር ላይ ጥቁረት እንዲኖረው የሚያደርግ (Vignette Shadow) */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: "radial-gradient(circle, transparent 40%, rgba(3, 0, 20, 0.6) 100%)"
        }}
      />

      {/* 4. ዋናው የውስጥ ይዘት (UI / Text / Videos) */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </AbsoluteFill>
  );
};

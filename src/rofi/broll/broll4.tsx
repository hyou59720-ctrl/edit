import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import React from "react";

// 🖼️ 5ቱን የቪዲዮ ምስሎች Import ማድረግ (15.png - 19.png)
import img15 from "../icon/15.png";
import img16 from "../icon/16.png";
import img17 from "../icon/17.png";
import img18 from "../icon/18.png";
import img19 from "../icon/19.png";

export const Broll4 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig(); // durationInFrames = 74

  const cardsData = [
    { id: 1, img: img15 },
    { id: 2, img: img16 },
    { id: 3, img: img17 },
    { id: 4, img: img18 },
    { id: 5, img: img19 },
  ];

  // በሰከንድ ውስጥ የሚኖረውን ለስላሳ የጀርባ ብርሃን እንቅስቃሴ መቆጣጠሪያ
  const time = frame / fps;

  // --- ጀርባ ላይ የሚንቀሳቀሱ የብርሃን ኳሶች (Dynamic Background Glows) ---
  const blob1X = Math.sin(time * 0.4) * 90;
  const blob1Y = Math.cos(time * 0.3) * 70;
  const blob1Scale = 1 + Math.sin(time * 0.2) * 0.12;

  const blob2X = Math.cos(time * 0.35) * 110;
  const blob2Y = Math.sin(time * 0.45) * 80;
  const blob2Scale = 1 + Math.cos(time * 0.25) * 0.1;

  // --- 1. የመግቢያ አኒሜሽን (ከታች ወደ ላይ መምጣት) ---
  const entrySpring = spring({
    frame: frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  // --- 2. የመበተን አኒሜሽን (Card Fan Out) ---
  const fanOutProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // --- 3. የመውጫ አኒሜሽን (Zoom Out & Combine) ---
  const exitSpring = spring({
    frame: frame - 62,
    fps,
    config: { damping: 11, stiffness: 120 },
  });

  return (
    <AbsoluteFill className="bg-[#030014] flex flex-col items-center justify-center overflow-hidden">
      
      {/* 1. Premium Noise Texture (ለጀርባው የፊልም ግሬን ውበት ይሰጣል) */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* 2. Apple-Style የሚንቀሳቀሱ የብርሃን ነጸብራቆች (Dynamic Orbs) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blob 1: Deep Purple */}
        <div
          className="absolute w-[850px] h-[850px] bg-gradient-to-tr from-[#5E5CE6] to-[#BF7AF0] rounded-full blur-[160px] mix-blend-screen"
          style={{
            top: "-20%",
            left: "-10%",
            transform: `translate(${blob1X}px, ${blob1Y}px) scale(${blob1Scale})`,
            opacity: 0.38,
          }}
        />

        {/* Blob 2: Vibrant Cyan/Blue */}
        <div
          className="absolute w-[800px] h-[800px] bg-gradient-to-br from-[#00D2FF] to-[#0A84FF] rounded-full blur-[140px] mix-blend-screen"
          style={{
            bottom: "-15%",
            right: "-10%",
            transform: `translate(${blob2X}px, ${blob2Y}px) scale(${blob2Scale})`,
            opacity: 0.3,
          }}
        />
      </div>

      {/* 3. ስስ የጠርዝ ጥላ (Vignette Shadow) */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: "radial-gradient(circle, transparent 40%, rgba(3, 0, 20, 0.7) 100%)"
        }}
      />

      {/* 5ቱ ካርዶች የሚቀመጡበት ዋና ቦታ */}
      <div className="relative w-[1200px] h-[500px] flex items-center justify-center">
        {cardsData.map((card, idx) => {
          const targetRotate = (idx - 2) * 9; 
          const targetTranslateX = (idx - 2) * 220; 

          // 1. መግቢያ እና መበተን
          const currentTranslateX = interpolate(fanOutProgress, [0, 1], [0, targetTranslateX]);
          const currentRotate = interpolate(fanOutProgress, [0, 1], [0, targetRotate]);

          // 2. በስሱ መንሳፈፍ (Idle floating)
          const floatOffset = Math.sin((frame / fps) * 2 + idx) * 12;

          // 3. መውጫ (ወደ መሃል ተሰብስቦ መጥፋት)
          const exitTranslateX = interpolate(exitSpring, [0, 1], [currentTranslateX, 0]);
          const exitRotate = interpolate(exitSpring, [0, 1], [currentRotate, 0]);
          
          const scale = entrySpring * (1 - exitSpring * 0.95);
          const opacity = interpolate(exitSpring, [0, 0.8], [1, 0], { extrapolateRight: "clamp" });

          return (
            <div
              key={card.id}
              // ✨ MODERN GLASS EFFECT: በከፊል ግልጽ የሆነ ነጭ ጀርባ (bg-white/[0.04])፣ ስስ የነጭ ድንበር (border-white/15) እና የጀርባ ብዥታ (backdrop-blur-xl)
              className="absolute w-[210px] h-[310px] bg-white/[0.04] border border-white/15 rounded-[32px] flex flex-col p-2.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden"
              style={{
                transform: `translateX(${exitTranslateX}px) translateY(${((1 - entrySpring) * 180) + floatOffset}px) rotate(${exitRotate}deg) scale(${scale})`,
                opacity: opacity,
                zIndex: idx === 2 ? 30 : 20 - Math.abs(idx - 2),
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
              }}
            >
              {/* የካርዱ ፎቶ - በብርጭቆው ፍሬም ውስጥ በሚያምር ሁኔታ ተቀምጧል */}
              <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-black/40 border border-white/[0.08]">
                <img 
                  src={card.img} 
                  alt="Card Preview" 
                  className="w-full h-full object-cover"
                />
                {/* ከላይ የተደረገ ስስ የብርሃን ነጸብራቅ (Glossy highlight overlay) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
              </div>
            </div>
          );
        })}
      </div>
      
    </AbsoluteFill>
  );
};

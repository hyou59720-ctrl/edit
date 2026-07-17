import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";
import React from "react";
import { PhoneFrame } from "./PhoneFrame";
import { YouTubeFeed } from "./YouTubeFeed";

// 💸 SVG Icon (ባዶ የኪስ ቦርሳ በረራ)
const WalletSvg = () => (
  <svg
    width="38"
    height="38"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="14" width="40" height="26" rx="4" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="3" />
    <path d="M30 22H42V32H30C27.2386 32 25 29.7614 25 27C25 24.2386 27.2386 22 30 22Z" fill="#05050a" stroke="#ef4444" strokeWidth="3" />
    <circle cx="33" cy="27" r="2.5" fill="#ef4444" />
    <path d="M10 10L6 6M20 8l-2-5M32 8l1-5M40 11l4-4" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 📉 SVG Icon (የቁልቁለት ገበታ)
const ChartDownSvg = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 3V21H21" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 8L12 13L16 9L21 15" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 15H21V11" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Broll1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. 🚀 የመግቢያ አኒሜሽን (ከታች ወደ ላይ መግቢያ) - frame 0-30 አካባቢ
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.9 },
  });

  // 2. 🔄 የቦታ መለዋወጫ አኒሜሽን (Shift) - ከframe 50 እስከ 65
  // ይህ ኢንተርፖሌሽን ስልኩን ወደ ግራ፣ ጽሁፉን ወደ ቀኝ ለማስገባት ያገለግላል።
  const shiftProgress = interpolate(
    frame,
    [50, 65], // አንቀሳቃሹ ከframe 50 እስከ 65 ይቆያል
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  // --- 📱 የስልክ አኒሜሽን ሂሳቦች ---
  
  // መጀመሪያ በትልቁ (1.3) ይጀምራል፣ ከframe 50 በኋላ ወደ መደበኛ መጠን (1.0) ይመለሳል
  const phoneScale = interpolate(shiftProgress, [0, 1], [1.5, 1]);
  
  // የመግቢያ translateY (ከታች መምጣት)
  const introTranslateY = interpolate(introSpring, [0, 1], [400, 0]);
  
  // ከframe 50 በኋላ ስልኩን ወደ ግራ (Left) መግፋት
  const phoneTranslateX = interpolate(shiftProgress, [0, 1], [0, -250]); // 250px ወደ ግራ

  // --- 🔴 የጽሁፍ (Info) አኒሜሽን ሂሳቦች ---
  
  // ከframe 50 በፊት አይታይም (opacity 0)፣ ከዛ በፈጣኑ ይበራል (opacity 1)
  const infoOpacity = interpolate(frame, [50, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // ከframe 50 በኋላ ከቀኝ (Right: 400px) ወደ መደበኛ ቦታው (0px) ይገባል
  const infoTranslateX = interpolate(shiftProgress, [0, 1], [400, 0]);


  // 3. 🚪 አጠቃላይ መውጫ አኒሜሽን (ከframe 105 በኋላ)
  const outroStartFrame = 105;
  const outroProgress = interpolate(frame, [outroStartFrame, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  const finalOpacity = (1 - outroProgress);
  const finalOutroTranslateY = interpolate(outroProgress, [0, 1], [0, 450]);

  // የጀርባው ቀይ ማስጠንቀቂያ (Glow Pulse)
  const glowPulse = interpolate(Math.sin(frame / 10), [-1, 1], [0.15, 0.35]);

  return (
    <AbsoluteFill 
      style={{
        backgroundColor: "#05050a",
        backgroundImage: `
          radial-gradient(circle at 75% 50%, rgba(239, 68, 68, ${glowPulse}) 0%, transparent 60%),
          linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 30px 30px, 30px 30px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        // gap: "60px", // በTransition ጊዜ አስቸጋሪ ስለሚሆን gapን እናጠፋዋለን
        padding: "0 80px",
        overflow: "hidden",
        opacity: finalOpacity, // አጠቃላይ መውጫ
      }}
    >
      
      {/* 📱 ስልክ (በግራ በኩል የሚሆን) */}
      <div
        style={{
          // የመግቢያ translateY + የመውጫ translateY + ወደ ግራ መግፊያ translateX + መጠን (Scale)
          transform: `translateY(${introTranslateY + finalOutroTranslateY}px) translateX(${phoneTranslateX}px) scale(${phoneScale})`,
          opacity: interpolate(introSpring, [0, 1], [0, 1]), // መግቢያ opacity
          transformOrigin: "center center",
          flexShrink: 0,
          filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.8))",
          position: "absolute", // ለትክክለኛ Shift positioning absolute እንጠቀማለን
          left: '50%', // መጀመሪያ መሃል ላይ ለማድረግ
          marginLeft: -160, // የስልኩን ግማሽ ስፋት (PhoneFrame width approx 320/2) በመቀነስ በትክክል መሃል እናደርገዋለን
        }}
      >
        <PhoneFrame>
          <YouTubeFeed frame={frame} />
        </PhoneFrame>
      </div>

      {/* 🔴 የትርጉም ማስረገጫ ክፍል (በቀኝ በኩል የሚገባ) */}
      <div 
        style={{
          opacity: infoOpacity, // frame 50 ላይ መታየት ይጀምራል
          // የመውጫ translateY + ከቀኝ የመግቢያ translateX
          transform: `translateY(${finalOutroTranslateY}px) translateX(${infoTranslateX}px)`,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 450,
          zIndex: 5,
          position: "absolute",
          right: 80, // የመጨረሻ ቦታው በቀኝ 80px ርቆ
        }}
      >
        {/* የኪሳራ/ባዶነት ቪዥዋል ካርድ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <WalletSvg />
            <span style={{ color: "#ef4444", fontSize: 18, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase" }}>
              Total Profit (ኪሳራ)
            </span>
          </div>
          
          <div
            style={{
              fontSize: 110,
              fontWeight: 950,
              color: "#ffffff",
              lineHeight: 0.9,
              letterSpacing: "-4px",
              textShadow: "0 0 30px rgba(239, 68, 68, 0.6)",
              display: "flex",
              alignItems: "baseline",
              gap: 8
            }}
          >
            0 <span style={{ fontSize: 32, color: "#ef4444", fontWeight: 700 }}>ETB</span>
          </div>
        </div>

        {/* እድገት የለም ገላጭ ካርድ */}
        <div 
          style={{ 
            background: "rgba(239, 68, 68, 0.07)", 
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(239, 68, 68, 0.3)", 
            padding: "20px 24px", 
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            boxShadow: "0 10px 30px rgba(239, 68, 68, 0.05)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ChartDownSvg />
            <span style={{ color: "#ef4444", fontSize: 20, fontWeight: 900, letterSpacing: 1 }}>
              እድገት የለም!
            </span>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            ያለ ተግባር ስልኮ ላይ ቪዲዮዎችን ማሸብለል (Scroll) ብቻውን የትም አያደርስም። ስትራቴጂው እዚህ ጋር ይቋረጣል!
          </p>
        </div>

        {/* 📉 Flatline (የሞተ ምት) SVG ቪዥዋል */}
        <div style={{ position: "relative", height: 40, width: "100%", marginTop: 10 }}>
          <svg width="100%" height="100%" viewBox="0 0 300 40" preserveAspectRatio="none">
            <path 
              d="M 0 20 L 80 20 L 90 5 L 100 35 L 110 20 L 300 20" 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity: 0.85,
                filter: "drop-shadow(0 0 5px #ef4444)"
              }}
            />
          </svg>
          <div 
            style={{ 
              position: "absolute", 
              left: `${(frame * 2.5) % 100}%`, 
              top: 17, 
              width: 7, 
              height: 7, 
              borderRadius: "50%", 
              background: "#ffffff",
              boxShadow: "0 0 12px 4px #ef4444"
            }} 
          />
        </div>

      </div>
    </AbsoluteFill>
  );
};

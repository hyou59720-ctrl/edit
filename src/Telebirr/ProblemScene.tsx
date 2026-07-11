import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { ModernBackground } from "./ModernBackground";

// የመግቢያ አኒሜሽን ክፍል (ያልተነካ)
const SmoothFadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame - delay, [0, 15], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }} className="transition-all">
      {children}
    </div>
  );
};

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  // 📍 አዲስ የተጨመረ የመውጫ አኒሜሽን (ከፍሬም 75 እስከ 85 ባለው ጊዜ ይከስማል)
  // 90ኛ ፍሬም ላይ Sequence ስለሚያልቅ 75 ላይ መጥፋት መጀመር አለበት
  const exitOpacity = interpolate(frame, [75, 85], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ሲጠፋ ጽሑፉ ይበልጥ ወደ ላይ ተንሸራቶ እንዲጠፋ (Y-axis መውጫ)
  const exitTranslateY = interpolate(frame, [75, 85], [0, -30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <ModernBackground>
      {/* 📍 የቪዲዮ ረንደር ላይ አማርኛው እንዳይሰበር የ Google ፎንት ድጋፍ እዚህ ተካቷል */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@800;900&display=swap');
          .telebrr-font { font-family: 'Noto Sans Ethiopic', sans-serif !important; }
        `}
      </style>

      {/* 📍 ሙሉውን የይዘት ሳጥን የመውጫ ስታይል (exitOpacity እና exitTranslateY) ሰጥተነዋል */}
      <div 
        style={{ 
          opacity: exitOpacity, 
          transform: `translateY(${exitTranslateY}px)` 
        }}
        className="flex flex-col justify-center items-center w-full h-full p-12 select-none transition-all"
      >
        
        {/* ፩. የመጀመሪያው ጥያቄ (መጠኑ ከ 65px ወደ 85px አድጓል) */}
        <SmoothFadeIn delay={0}>
          <h1 className="telebrr-font text-[85px] font-black text-[#0070C0] text-center leading-[1.2] filter drop-shadow-[0_6px_15px_rgba(0,0,0,0.12)] tracking-tight max-w-[1000px]">
            ገንዘብ ለመላክ ወረፋ መጠበቅ ሰለቸህ?
          </h1>
        </SmoothFadeIn>

        {/* ፪. ሁለተኛው መልስ (መጠኑ ከ 48px ወደ 65px አድጓል) */}
        <SmoothFadeIn delay={40}>
          <div className="mt-[60px] px-12 py-5 bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
            <p className="telebrr-font text-[65px] font-black text-[#F7B500] tracking-wide text-center leading-none">
              ያ ጊዜ አልፏል!
            </p>
          </div>
        </SmoothFadeIn>

      </div>
    </ModernBackground>
  );
};

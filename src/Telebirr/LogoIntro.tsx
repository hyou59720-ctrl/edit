import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from "remotion";
import { ModernBackground } from "./ModernBackground";

export const LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ----------------------------------------------------
  // ፩. የአይኮን (Image) አኒሜሽኖች - ከጽሑፍ መጥፋት በኋላ የሚጀምሩ
  // ----------------------------------------------------
  const introScale = spring({ 
    frame, 
    fps, 
    config: { damping: 14, stiffness: 10, mass: 0.2 } 
  });

  const exitScale = interpolate(
    frame,
    [138, 150],
    [1, 0], 
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const finalScale = introScale * exitScale;

  const iconTranslateX = interpolate(
    frame,
    [30, 50, 135, 146], 
    [0, -260, -260, 0], // 📍 የጽሑፉ መጠን ሲያድግ አይኮኑ በደንብ እንዲርቅ ከ -200 ወደ -260 ከፍ ብሏል
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const iconOpacity = interpolate(
    frame,
    [138, 150],
    [1, 0], 
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ----------------------------------------------------
  // ፪. የጽሑፍ አኒሜሽን (ፊደል በፊደል - ከግራ ወደ ቀኝ መግቢያ)
  // ----------------------------------------------------
  const amharicText = "ቴሌብር";
  const englishText = "telebirr"; // 📍 ልክ እንደ እውነተኛው ብራንድ በትንሽ ፊደላት (lowercase)

  const amharicLetterCount = Math.floor(
    interpolate(frame, [50, 60], [0, amharicText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const englishLetterCount = Math.floor(
    interpolate(frame, [65, 95], [0, englishText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // ----------------------------------------------------
  // ፫. የጽሑፍ መውጫ አኒሜሽን 
  // ----------------------------------------------------
  const isDisappearing = frame >= 115;

  const englishDisappearCount = Math.floor(
    interpolate(frame, [115, 128], [0, englishText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const amharicDisappearCount = Math.floor(
    interpolate(frame, [124, 135], [0, amharicText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const currentAmharicVisible = isDisappearing 
    ? Math.max(0, amharicText.length - amharicDisappearCount)
    : amharicLetterCount;

  const currentEnglishVisible = isDisappearing
    ? Math.max(0, englishText.length - englishDisappearCount)
    : englishLetterCount;

  const visibleAmharic = amharicText.slice(0, currentAmharicVisible);
  const visibleEnglish = englishText.slice(0, currentEnglishVisible);

  return (
    <ModernBackground>
      {/* 📍 የቪዲዮ ረንደር ላይ አማርኛው እንዳይሰበር የ Google ፎንት ድጋፍ እዚህ ተካቷል */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@800;900&family=Ubuntu:wght@700;900&display=swap');
          .amharic-font { font-family: 'Noto Sans Ethiopic', sans-serif !important; }
          .english-font { font-family: 'Ubuntu', 'Helvetica Neue', sans-serif !important; }
        `}
      </style>

      <div className="flex w-full h-full justify-center items-center select-none">
        
        {/* ጠቅላላ የሳጥን ስፋት ለትልቁ ጽሑፍ እንዲመች ከ 600px ወደ 750px አሳድገነዋል */}
        <div className="flex items-center justify-center relative w-[750px]">
          
          {/* አይኮኑ (Image) */}
          <div
            style={{ 
              transform: `scale(${finalScale}) translateX(${iconTranslateX}px)`,
              opacity: iconOpacity 
            }}
            className="flex justify-center items-center filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] z-20 absolute"
          >
            <img 
              src={staticFile("/icon/telebirr-logo.png")} 
              alt="Telebirr Logo"
              className="w-[260px] h-auto object-contain rounded-3xl" 
            />
          </div>

          {/* 📍 የተስተካከለው የጽሑፍ ክፍል (የመጠን እና የፎንት ማሻሻያ) */}
          <div 
            className="flex flex-col items-start z-10 absolute"
            style={{ left: "320px" }} // ጽሑፉ ትልቅ ሲሆን ከአይኮኑ ጋር እንዳይጋጭ ወደ ቀኝ ፈቀቅ ተደርጓል
          >
            {/* የአማርኛው "ቴሌብር" ጽሑፍ */}
            <div className="amharic-font text-[90px] font-black text-[#0070C0] leading-[0.9] h-[95px] flex items-center tracking-tight filter drop-shadow-sm">
              {visibleAmharic}
            </div>
            
            {/* የእንግሊዘኛው "telebirr" ጽሑፍ */}
            <div className="english-font text-[95px] font-black text-[#F7B500] leading-[0.9] -mt-1 h-[100px] flex items-center tracking-tighter filter drop-shadow-sm">
              {visibleEnglish}
            </div>
          </div>

        </div>

      </div>
    </ModernBackground>
  );
};

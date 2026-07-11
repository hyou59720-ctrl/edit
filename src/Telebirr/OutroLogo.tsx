import React from "react";
// 📍 'interpolateColors' እዚህ ጋር ተጨምሯል
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, staticFile, interpolateColors } from "remotion";

export const OutroLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 📍 ስህተቱን ለመፍታት በ 'interpolate' ፈንታ 'interpolateColors' ተጠቅመናል
  const backgroundColor = interpolateColors(
    frame,
    [0, 25],
    ["#F7B500", "#0070C0"] // ከ ወርቅማ ወደ ደማቅ ሰማያዊ በትክክል ይለወጣል
  );

  // የሎጎውና የጽሑፉ መግቢያ ዙም አኒሜሽን
  const scale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // የጽሑፎቹ ቅልጥታ (Fade In)
  const opacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor }}
      className="flex flex-col justify-center items-center gap-8 select-none"
    >
      {/* 📍 የቪዲዮ ረንደር ላይ አማርኛና እንግሊዘኛው እንዳይሰበር የ Google ፎንት ድጋፍ እዚህ ተካቷል */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@500;700;800;900&family=Ubuntu:wght@700;900&display=swap');
          .amharic-font { font-family: 'Noto Sans Ethiopic', sans-serif !important; }
          .english-font { font-family: 'Ubuntu', sans-serif !important; }
        `}
      </style>

      {/* ማዕከላዊው የቴሌብር አይኮን (Image - መጠኑ ከ 180px ወደ 230px አድጓል) */}
      <div style={{ transform: `scale(${scale})` }} className="mb-4 filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
        <img 
          src={staticFile("/icon/telebirr-logo.png")} 
          alt="Telebirr Final Logo" 
          className="w-[230px] h-auto object-contain bg-white p-4 rounded-[35px]"
        />
      </div>

      {/* የብራንድ ስም እና መፈክር በቅልጥታ የሚመጡ */}
      <div style={{ opacity }} className="flex flex-col items-center text-center gap-2">
        
        {/* የቴሌብር እንግሊዘኛ ስም በትክክለኛ ቀለማት (መጠኑ ከ 75px ወደ 95px አድጓል) */}
        <div className="english-font text-[95px] font-black text-white tracking-tight leading-none filter drop-shadow-sm">
          tele<span className="text-[#F7B500]">birr</span>
        </div>
        
        {/* የአማርኛው "ቴሌብር" ጽሑፍ (መጠኑ ከ 40px ወደ 65px አድጓል) */}
        <div className="amharic-font text-[65px] font-black text-white/95 tracking-wide mt-2 leading-none filter drop-shadow-sm">
          ቴሌብር
        </div>

        {/* የስራ መፈክሩ (መጠኑ ከ 26px ወደ 38px አድጓል) */}
        <p className="amharic-font text-[38px] font-bold text-[#E0E0E0] mt-6 tracking-normal border-t-2 border-white/20 pt-4 px-10 leading-snug">
          የኢትዮጵያ ድጅታ ባንክ 
        </p>

      </div>
    </AbsoluteFill>
  );
};

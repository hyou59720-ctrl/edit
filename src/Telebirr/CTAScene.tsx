import React from "react";
// 📍 'interpolateColors' እዚህ ጋር በትክክል ተጨምሯል
import { useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, interpolateColors } from "remotion";
import { ModernBackground } from "./ModernBackground";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clickStartFrame = 55;
  const zoomEndFrame = clickStartFrame + 20; // 75

  // ቁልፉ መጀመሪያ ብቅ የሚልበት አኒሜሽን
  const introScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 1.5) * 0.03;

  // ቁልፉ ሲነካ ስክሪኑን ለመሸፈን የሚያብጥበት ስኬል
  const zoomInTransition = interpolate(frame, [clickStartFrame, zoomEndFrame], [1, 15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const finalButtonScale = introScale * (frame < clickStartFrame ? pulse : zoomInTransition);

  // 📍 ስህተቱን የፈታው ማስተካከያ (interpolateColors በመጠቀም)
  const buttonColor = interpolateColors(
    frame,
    [clickStartFrame, clickStartFrame + 15],
    ["#F7B500", "#0070C0"]
  );

  const buttonContentOpacity = interpolate(frame, [clickStartFrame, clickStartFrame + 7], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // የማውስ እንቅስቃሴ
  const cursorX = interpolate(frame, [15, 45], [300, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cursorY = interpolate(frame, [15, 45], [400, 40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cursorOpacity = interpolate(frame, [15, 25, clickStartFrame, clickStartFrame + 5], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cursorClickScale = interpolate(frame, [clickStartFrame, clickStartFrame + 4], [1, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame, [clickStartFrame, clickStartFrame + 7], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <ModernBackground>
      {/* 📍 የቪዲዮ ረንደር ላይ አማርኛና እንግሊዘኛው እንዳይሰበር የ Google ፎንት ድጋፍ እዚህ ተካቷል */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@800;900&family=Ubuntu:wght@700;900&display=swap');
          .amharic-font { font-family: 'Noto Sans Ethiopic', sans-serif !important; }
          .english-font { font-family: 'Ubuntu', sans-serif !important; }
        `}
      </style>

      <div className="flex flex-col justify-center items-center w-full h-full relative select-none">
        
        {/* "አሁኑኑ ያውርዱ!" ጽሑፍ (መጠኑ ከ 60px ወደ 80px ከፍ ብሏል) */}
        <div style={{ opacity: textOpacity }} className="mb-14 text-center transition-all">
          <p className="amharic-font text-[80px] font-black text-[#0070C0] filter drop-shadow-sm leading-none">
            አሁኑኑ ያውርዱ!
          </p>
        </div>

        {/* የማውረጃ ቁልፍ (Button) */}
        <div
          style={{ 
            transform: `scale(${finalButtonScale})`, 
            transformOrigin: "center center",
            backgroundColor: buttonColor
          }}
          className="px-14 py-6 rounded-[50px] flex items-center gap-8 border-4 border-white/50 filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.25)] z-10"
        >
          <div style={{ opacity: buttonContentOpacity }} className="flex items-center gap-8 transition-all">
            {/* የቴሌብር ሎጎ በአዝራሩ ውስጥ */}
            <img 
              src={staticFile("/icon/telebirr-logo.png")} 
              alt="Logo" 
              className="w-[110px] h-auto object-contain bg-white p-2 rounded-2xl"
            />
            <div className="flex flex-col items-start justify-center">
              {/* DOWNLOAD ጽሑፍ (መጠኑ ከ 24px ወደ 32px አድጓል) */}
              <span className="english-font text-[32px] font-black text-white/90 leading-none tracking-wider">
                DOWNLOAD
              </span>
              {/* telebirr App ጽሑፍ (መጠኑ ከ 44px ወደ 58px አድጓል) */}
              <span className="english-font text-[58px] font-black text-white leading-none mt-1 tracking-tight">
                telebirr App
              </span>
            </div>
          </div>
        </div>

        {/* የማውስ ጠቋሚ (Cursor) */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(${cursorX}px, ${cursorY}px) scale(${cursorClickScale})`,
            opacity: cursorOpacity,
            pointerEvents: "none",
            zIndex: 50
          }}
          className="transition-all"
        >
          <svg width="75" height="75" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(3px 5px 8px rgba(0,0,0,0.35))" }}>
            <path d="M4.29289 2.29289C3.90237 1.90237 3.2692 2.02334 3.04757 2.5332L1.13064 6.94215C1.04273 7.14436 1.02641 7.36881 1.08412 7.58133C1.14182 7.79386 1.2701 7.98144 1.44969 8.11546L5.36066 11.0341C5.79555 11.3587 6.41724 11.1396 6.5492 10.6083L7.74735 5.78283C7.79047 5.60914 7.7679 5.42581 7.68331 5.2675C7.59872 5.10919 7.45749 4.98595 7.28721 4.92131L4.29289 2.29289Z" fill="white"/>
            <path d="M3.5 2L17 12.5L11.5 13.5L16 20L13.5 21.5L9 15L5.5 18V2Z" fill="black" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>

      </div>
    </ModernBackground>
  );
};

import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ModernBackground } from "./ModernBackground";

const icons = {
  moneyTransfer: (
    <svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="#F7B500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l6 6" />
    </svg>
  ),
  bill: (
    <svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="#F7B500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
      <line x1="16" y1="3" x2="16" y2="21" />
      <line x1="8" y1="7" x2="12" y2="7" />
      <line x1="8" y1="11" x2="12" y2="11" />
      <line x1="8" y1="15" x2="12" y2="15" />
    </svg>
  ),
  airtime: (
    <svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="#F7B500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.94 0M12 20h.01" />
    </svg>
  ),
  bank: (
    <svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="#F7B500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
    </svg>
  ),
};

const features = [
  { icon: icons.moneyTransfer, label: "ገንዘብ ላክ / ተቀበል" },
  { icon: icons.bill, label: "ቢል ክፈል" },
  { icon: icons.airtime, label: "ኤርታይም ግዛ" },
  { icon: icons.bank, label: "ቁጠባ እና ብድር" },
];

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exitStartFrame = 85; 
  const textStartFrame = 125; 

  // ----------------------------------------------------
  // 📍 ሲኒማቲክ የጊዜ ሰሌዳ ማሻሻያ (የመስመር ወርድ መጠን ጨምሯል)
  // ----------------------------------------------------
  const lineLineWidth = interpolate(frame, [textStartFrame, textStartFrame + 15], [16, 680], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textIntroSpring = spring({
    frame: frame - (textStartFrame + 15),
    fps,
    config: { damping: 11, stiffness: 120 },
  });
  const textScaleFrame = interpolate(textIntroSpring, [0, 1], [0.5, 1]);
  const textIntroOpacity = interpolate(frame - (textStartFrame + 15), [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textExitTranslateY = interpolate(frame, [165, 178], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sceneOutroOpacity = interpolate(frame, [175, 180], [1, 0], {
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

      <div 
        style={{ opacity: sceneOutroOpacity }} 
        className="flex flex-col justify-center items-center w-full h-full p-12 select-none relative"
      >
        
        {/* ፩. የፊቸሮች ዝርዝር ሳጥን (ከትላልቅ ጽሑፎች ጋር እንዲመጥን ስፋቱ ወደ 850px አድጓል) */}
        {frame < textStartFrame + 5 && (
          <div className="flex flex-col gap-6 w-[850px]">
            {features.map((f, i) => {
              const introDelay = i * 15;
              const exitDelay = exitStartFrame + (i * 8);

              const introSpring = spring({
                frame: frame - introDelay,
                fps,
                config: { damping: 15, stiffness: 100 },
              });
              const introTranslateX = interpolate(introSpring, [0, 1], [-500, 0]);
              const introOpacity = interpolate(frame - introDelay, [0, 12], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              const exitTranslateX = interpolate(frame - exitDelay, [0, 10], [0, 600], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const exitOpacity = interpolate(frame - exitDelay, [0, 10], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              const finalTranslateX = introTranslateX + exitTranslateX;
              const finalOpacity = frame >= exitStartFrame ? exitOpacity : introOpacity;

              return (
                <div
                  key={f.label}
                  style={{ 
                    transform: `translateX(${finalTranslateX}px)`, 
                    opacity: finalOpacity 
                  }}
                  className="flex items-center gap-[30px] bg-white/70 backdrop-blur-md px-8 py-5 rounded-3xl border border-white/40 filter drop-shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-all"
                >
                  <div className="flex justify-center items-center filter drop-shadow-sm p-2 bg-amber-50 rounded-2xl">
                    {f.icon}
                  </div>
                  {/* 📍 የፊቸር ጽሑፎች መጠን ከ 42px ወደ 58px አድጓል */}
                  <span className="telebrr-font text-[58px] font-black text-[#0070C0] tracking-tight leading-none">
                    {f.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* 📍 ፪. አዲሱ ሲኒማቲክ ማጠቃለያ ጽሑፍ እና የማስገቢያ መስመር */}
        {frame >= textStartFrame && (
          <div className="absolute flex flex-col items-center justify-center min-h-[200px] w-full">
            
            {/* ጽሑፉ ትልቅ ስለሆነ ከመስመሩ በታች ሲወርድ በደንብ እንዲደበቅ h-[110px] ሰጥተነዋል */}
            <div className="overflow-hidden pb-4 px-10 flex items-center justify-center h-[110px]">
              {/* 📍 የማጠቃለያ ጽሑፍ መጠን ከ 54px ወደ 80px አድጓል */}
              <h2 
                style={{ 
                  opacity: textIntroOpacity,
                  transform: `scale(${textScaleFrame}) translateY(${textExitTranslateY}px)`,
                  transformOrigin: "center center"
                }}
                className="telebrr-font text-[80px] font-black text-[#0070C0] leading-none filter drop-shadow-sm"
              >
                ይህ ሁሉ ያለው በ <span className="text-[#F7B500]">ቴሌብር</span> ነው!
              </h2>
            </div>

            {/* 📍 መስመሩ ከጽሑፉ ጋር እንዲመጥን ቁመቱ (height) 10px ሆኗል */}
            <div 
              style={{ 
                width: `${lineLineWidth}px`,
                height: "10px"
              }}
              className="bg-[#F7B500] rounded-full mt-4 filter drop-shadow-sm transition-all"
            />
            
          </div>
        )}

      </div>
    </ModernBackground>
  );
};

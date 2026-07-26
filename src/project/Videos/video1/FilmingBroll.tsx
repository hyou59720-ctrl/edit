import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
  Video,
} from "remotion";

// አዲሱን ፋይል ኢምፖርት እናደርጋለን (ፋይሎቹ በተመሳሳይ ቦታ ከሆኑ)
import { EditingSoftwareUI } from "./assets/EditingSoftwareUI";

import broll from "./assets/broll.mp4";

const VIDEO_SRC = broll;

export const FilmingBroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // አጠቃላይ ኮንቴይነሩ ሲጀምር እና ሲጨርስ Fade In/Out እንዲያደርግ
  const containerOpacity = interpolate(frame, [0, 8, 90, 100], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 1. መጀመሪያ ቪዲዮው ሲገባ ብድግ የሚለው (Pop-in)
  const videoCardInitialScale = spring({
    frame,
    fps,
    from: 0.85,
    to: 1,
    config: { damping: 16, mass: 0.9 },
  });

  // ጀርባው ላይ ያለው ብዥ ያለ ቪዲዮ ዙም (Zoom)
  const bgKenBurns = interpolate(frame, [0, 100], [1.35, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const recBlink = Math.floor(frame / 10) % 2 === 0 ? 1 : 0;

  // ==========================================
  // TRANSITION: ከ Filming ወደ Editing (Frame 38 ላይ ይጀምራል)
  // ==========================================
  const transitionP = spring({
    frame: frame - 38,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 22,
    config: { damping: 14, mass: 0.8 },
  });

  // 🎯 ማስተካከያ፦ UI በ 0.75 scale ስለሚያንስ፣ ቪዲዮውም አብሮ ወደ 0.66 scale ያንሳል። 
  // እንዲሁም ትክክለኛው የሞኒተር ማረፊያ ላይ እንዲቀመጥ X እና Y ተስተካክሏል።
  const videoScale = interpolate(transitionP, [0, 1], [1.5, 0.66]); 
  const videoTranslateX = interpolate(transitionP, [0, 1], [0, 127]);
  const videoTranslateY = interpolate(transitionP, [0, 1], [0, -81]);

  // የ Filming ማዕዘኖች እና የ Editing UI መለዋወጫ (Crossfade)
  const filmingUIOpacity = interpolate(transitionP, [0, 0.4], [1, 0], { extrapolateRight: "clamp" });
  const editingUIOpacity = interpolate(transitionP, [0.3, 1], [0, 1], { extrapolateLeft: "clamp" });

  // የጽሁፎች መለዋወጫ
  const textTranslateY = interpolate(transitionP, [0, 1], [0, -40]);

  // ==========================================
  // EDITING TIMELINE ANIMATIONS
  // ==========================================
  const playheadMove = interpolate(frame, [45, 95], [0, 680], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  const clip1Width = spring({ frame: frame - 42, fps, from: 0, to: 280 });
  const clip2Width = spring({ frame: frame - 46, fps, from: 0, to: 400 });
  const clip3Width = spring({ frame: frame - 44, fps, from: 0, to: 690 });

  return (
    <AbsoluteFill className="bg-[#08080C]" style={{ opacity: containerOpacity }}>
      
      {/* ---- የጀርባ ፍርግርግ እና ብዥ ያለ ቪዲዮ (Blurred Background) ---- */}
      <AbsoluteFill className="overflow-hidden z-[0]">
        <Video
          src={VIDEO_SRC}
          muted // የጀርባ ቪዲዮ ድምጽ እንዳያስተጋባ ድምጹ ጠፍቷል
          className="absolute top-1/2 left-1/2 w-full h-full object-cover"
          style={{
            filter: "blur(40px) brightness(0.3)",
            transform: `translate(-50%, -50%) scale(${bgKenBurns})`,
          }}
        />
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, rgba(8,8,12,0.7) 0%, rgba(8,8,12,0.4) 30%, rgba(8,8,12,0.4) 70%, rgba(8,8,12,0.9) 100%)",
          }}
        />
      </AbsoluteFill>

      {/* ======================================================== */}
      {/* ለብቻው ፋይል ያደረግነው የ EDITING SOFTWARE UI እዚህ ጋር ይጠራል */}
      {/* ======================================================== */}
      {/* 🎯 ማስተካከያ፡ Editing UI ወደ 0.75 scale ተደርጓል በጎን በኩል እንዳይቆረጥ */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ transform: "scale(0.75)", transformOrigin: "center" }}
      >
        <EditingSoftwareUI 
          opacity={editingUIOpacity}
          videoSrc={VIDEO_SRC}
          clip1Width={clip1Width}
          clip2Width={clip2Width}
          clip3Width={clip3Width}
          playheadMove={playheadMove}
        />
      </div>

      {/* ======================================================== */}
      {/* ዋናው ቪዲዮ (ከካሜራ ቀረጻ ወደ ሞኒተርነት የሚለወጠው) */}
      {/* ======================================================== */}
      <div
        className="absolute z-[2] rounded-md overflow-hidden shadow-2xl"
        style={{
          width: 640,
          height: 360, 
          transformOrigin: "center",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translate(${videoTranslateX}px, ${videoTranslateY}px) scale(${videoCardInitialScale * videoScale})`,
        }}
      >
        <Video
          src={VIDEO_SRC}
          volume={0.6}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* --- FILMING OVERLAY (ማዕዘኖቹ እና REC ምልክት) - ሽግግሩ ላይ ይጠፋል --- */}
        <div style={{ opacity: filmingUIOpacity }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-6 left-6 w-12 h-12 border-t-[4px] border-l-[4px] border-white opacity-80 shadow-sm" />
          <div className="absolute top-6 right-6 w-12 h-12 border-t-[4px] border-r-[4px] border-white opacity-80 shadow-sm" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-b-[4px] border-l-[4px] border-white opacity-80 shadow-sm" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-b-[4px] border-r-[4px] border-white opacity-80 shadow-sm" />

          {/* REC ምልክት */}
          <div className="absolute top-8 right-8 flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full bg-[#FF3B30] shadow-[0_0_10px_red]"
              style={{ opacity: recBlink }}
            />
            <span className="text-[#FF3B30] font-black text-lg tracking-widest drop-shadow-md">REC</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ጽሑፎች (FILMING -> EDITING) */}
      {/* ======================================================== */}
      <div
        className="absolute bottom-[220px] left-0 right-0 flex flex-col items-center z-[3]"
        style={{ transform: `translateY(${textTranslateY}px)` }}
      >
        {/* Filming Text (ይጠፋል) */}
        <div className="absolute flex flex-col items-center" style={{ opacity: filmingUIOpacity }}>
          <span className="text-white/70 font-black text-3xl tracking-[0.4em] uppercase mb-4">
            Couple Weeks
          </span>
          <span
            className="text-white font-black text-[100px] leading-none tracking-tight"
            style={{ textShadow: "0 0 40px rgba(255,255,255,0.3)" }}
          >
            FILMING
          </span>
        </div>

        {/* Editing Text (ይገባል) */}
        <div className="absolute flex flex-col items-center" style={{ opacity: editingUIOpacity }}>
          <span className="text-white/70 font-black text-3xl tracking-[0.4em] uppercase mb-4">
            Three Weeks
          </span>
          <span
            className="text-[#3b769f] font-black text-[100px] leading-none tracking-tight"
            style={{ textShadow: "0 0 40px rgba(59,118,159,0.5)" }}
          >
            EDITING
          </span>
        </div>
      </div>
      
    </AbsoluteFill>
  );
};

export default FilmingBroll;

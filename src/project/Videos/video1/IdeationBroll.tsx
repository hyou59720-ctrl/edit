import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

/**
 * BROLL 1 — IDEATION (ULTRA DYNAMIC & OPTIMIZED)
 * Subtitle covered: "there's an ideation where we brainstorm what they are"
 * 
 * የጀርባ ጥላ (Background Gradient) ማስተካከያ የተደረገበት፡
 * - አሁን የጀርባው ጥቁር ጥላ ከ frame 62 እስከ 74 ካለው አይኮን ጋር እኩል FADE OUT ያደርጋል።
 */

const BULB_POINTS: [number, number][] = [
  // bulb head (circle-ish ring)
  [50, 14], [61, 17], [69, 24], [73, 34], [72, 45],
  [67, 54], [59, 60], [50, 62], [41, 60], [33, 54],
  [28, 45], [27, 34], [31, 24], [39, 17],
  // inner filament suggestion
  [45, 40], [50, 46], [55, 40], [50, 34],
  // neck / base
  [43, 66], [57, 66], [44, 72], [56, 72], [46, 78], [54, 78],
];

const IDEA_CHIPS = ["NEW IDEA", "CONCEPT", "PITCH", "DRAFT", "HOOK"];

const scatterStart = (i: number): [number, number] => {
  const angle = (i * 137.5 * Math.PI) / 180;
  const radius = 70 + (i % 5) * 12;
  const x = 50 + Math.cos(angle) * radius;
  const y = 42 + Math.sin(angle) * radius;
  return [x, y];
};

export const IdeationBroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. የጊዜ ሰሌዳ (Timing) እና መውጫ (Fade out)
  // ከ frame 62 እስከ 74 ባለው ጊዜ ውስጥ ቀስ ብሎ ይጠፋል
  const containerOpacity = interpolate(
    frame,
    [0, 8, 62, 74],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. ቀስ ያለ የማሳደግ አኒሜሽን (Continuous Scale)
  const entryScale = spring({
    frame,
    fps,
    from: 0.9,
    to: 1,
    durationInFrames: 20,
    config: { damping: 14, mass: 0.6 },
  });

  const idleScale = interpolate(frame, [20, 74], [1, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const finalContainerScale = entryScale * (frame > 20 ? idleScale : 1);

  // 3. የመብራቱ ብርሃን እና የብርሃን ምት (Glow Pulse)
  const bulbLit = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  const glowPulse = Math.sin(frame / 6) * 0.15 + 1; 
  const effectiveGlow = bulbLit * glowPulse;

  // 4. የጽሑፍ መግቢያ
  const textEntrance = spring({
    frame: frame - 15,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill className="flex items-center justify-center overflow-hidden bg-black/10">
      {/* 
        ማስተካከያ፡ የጀርባው ጥቁር ጥላ (Gradient) ራሱን የቻለ opacity ተሰጥቶታል 
        ከአይኮኖቹ ጋር እኩል ቀስ ብሎ fade out እንዲያደርግ containerOpacity ተጨምሮበታል።
      */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0.95) 100%)",
          opacity: containerOpacity,
        }}
      />

      {/* 1. የመብራት አይኮኑ (Lightbulb Icon) እና የ"Idea Word Chips" ስብስብ */}
      <div
        className="absolute"
        style={{
          width: 700,
          height: 700,
          opacity: containerOpacity,
          transform: `scale(${finalContainerScale}) translate(-50%, -50%)`,
          left: "50%",
          bottom: "-5%",
          filter: `brightness(1.1)`,
          zIndex: 0,
        }}
      >
        {BULB_POINTS.map(([tx, ty], i) => {
          const p = spring({
            frame: frame, 
            fps,
            from: 0,
            to: 1,
            durationInFrames: 20, 
            config: { damping: 14, mass: 0.4 }, 
          });

          const [sx, sy] = scatterStart(i);
          const x = interpolate(p, [0, 1], [sx, tx]);
          const y = interpolate(p, [0, 1], [sy, ty]);
          const dotOpacity = interpolate(p, [0, 0.1], [0, 1]);
          const isFilament = i >= 14 && i <= 17;

          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: isFilament ? 16 : 20,
                height: isFilament ? 16 : 20,
                transform: "translate(-50%, -50%)",
                backgroundColor: isFilament ? "#FFFFFF" : "#FFD60A",
                boxShadow:
                  isFilament && effectiveGlow > 0
                    ? `0 0 ${20 + 30 * effectiveGlow}px rgba(255,255,255,${0.6 * effectiveGlow})`
                    : `0 0 ${20 + 15 * glowPulse}px rgba(255,214,10,0.6)`,
                opacity: dotOpacity,
              }}
            />
          );
        })}

        {/* የ"Idea Word Chips" አኒሜሽን ከነ መንሳፈፊያው (Floating Effect) */}
        {IDEA_CHIPS.map((word, i) => {
          const angle = (i / IDEA_CHIPS.length) * Math.PI * 2 - Math.PI / 2;
          const orbitRadius = 420;
          const tx = 50 + Math.cos(angle) * (orbitRadius / 7);
          const ty = 45 + Math.sin(angle) * (orbitRadius / 10);

          const delay = 12 + i * 2;
          const p = spring({
            frame: frame - delay,
            fps,
            from: 0,
            to: 1,
            durationInFrames: 15,
            config: { damping: 14 },
          });

          const chipFloatingOffset = frame > delay + 15 
            ? Math.sin(frame / 8 + i) * 8 
            : 0;

          return (
            <div
              key={word}
              className="absolute px-6 py-3 rounded-full border border-[#FFD60A]/80 bg-black/70 backdrop-blur-md"
              style={{
                left: `${interpolate(p, [0, 1], [50, tx])}%`,
                top: `${interpolate(p, [0, 1], [60, ty]) + (chipFloatingOffset / 7)}%`, 
                transform: "translate(-50%, -50%)",
                opacity: interpolate(p, [0.2, 1], [0, 1]),
                zIndex: 1,
                boxShadow: `0 0 ${20 + 10 * glowPulse}px rgba(255, 214, 10, 0.6)`,
              }}
            >
              <span className="text-[#FFD60A] font-extrabold text-[20px] tracking-wider whitespace-nowrap">
                {word}
              </span>
            </div>
          );
        })}
      </div>

      {/* 2. የጽሑፍ መለያ (Bottom label) */}
      <div
        className="absolute bottom-[8%] left-1/2 text-center"
        style={{
          transform: `translateX(-50%) scale(${interpolate(textEntrance, [0, 1], [0.8, 1])})`,
          opacity: containerOpacity * textEntrance, 
          zIndex: 10,
        }}
      >
        <p
          className="text-white font-black leading-none tracking-tighter"
          style={{
            fontSize: "140px",
            filter: `drop-shadow(0 0 15px rgba(255, 214, 10, 0.7)) drop-shadow(0 0 30px rgba(255, 214, 10, 0.5))`,
          }}
        >
          BRAINSTORM<span className="text-[#FFD60A]">.</span>
        </p>
        <p className="text-[#A1A1AA] font-bold text-2xl tracking-[0.4em] mt-6 uppercase opacity-90">
          Where every video starts
        </p>
      </div>
    </AbsoluteFill>
  );
};

export default IdeationBroll;

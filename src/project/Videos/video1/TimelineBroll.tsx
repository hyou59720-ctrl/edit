import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";

/**
 * BROLL 4 — TIMELINE (FAST EDITION)
 * Duration: 60 frames (556 to 615)
 * አኒሜሽኑ ፈጥኖ ይገባና 48 ፍሬም ላይ ወደ ታች መውረድ ይጀምራል
 */

const NODES = [
  { label: "IDEA", months: "1-2" },
  { label: "WORK", months: "3-4" },
  { label: "FILM", months: "0.5" },
  { label: "EDIT", months: "0.75" },
];

export const TimelineBroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ፈጥኖ Fade in ያደርጋል
  const containerOpacity = interpolate(frame, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 60 ፍሬም ስለሆነ ከ 48 ጀምሮ ፈጥኖ ወደ ታች ይወርዳል
  const slideDownOut = interpolate(frame, [48, 59], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  
  const contentOpacity = interpolate(frame, [50, 59], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const trackWidth = 640;
  const nodeCount = NODES.length;

  // መስመሩ በ 15 ፍሬም ውስጥ ተስሎ ያልቃል
  const lineProgress = spring({
    frame: frame - 2,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 15,
    config: { damping: 18, mass: 0.7 },
  });

  // "5 MONTHS" ፈጥኖ (frame 25 ላይ) ይወጣል
  const stampScale = spring({
    frame: frame - 25,
    fps,
    from: 1.8,
    to: 1,
    durationInFrames: 10,
    config: { damping: 11 },
  });
  
  const stampOpacity = interpolate(frame, [25, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowAmount = interpolate(frame, [25, 32, 45], [0, 60, 25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: containerOpacity }}>
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(5, 5, 7, 0.0) 40%, rgba(5, 5, 7, 0.7) 65%, rgba(5, 5, 7, 0.95) 85%, #050507 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 220,
          opacity: contentOpacity,
          transform: `translateY(${slideDownOut}px)`,
        }}
      >
        <div className="relative" style={{ width: trackWidth, height: 80 }}>
          <div className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2 bg-white/10 rounded-full" />
          <div
            className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 bg-[#FFD60A] rounded-full"
            style={{
              width: `${lineProgress * 100}%`,
              boxShadow: "0 0 14px rgba(255,214,10,0.7)",
            }}
          />

          {NODES.map((node, i) => {
            const posPct = (i / (nodeCount - 1)) * 100;
            const delay = 4 + i * 5; // አይኮኖቹ በፍጥነት ይከፈታሉ
            const pop = spring({
              frame: frame - delay,
              fps,
              from: 0,
              to: 1,
              durationInFrames: 10,
              config: { damping: 12, mass: 0.5 },
            });
            const labelOpacity = interpolate(
              frame,
              [delay, delay + 5],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={node.label}
                className="absolute top-1/2 flex flex-col items-center"
                style={{
                  left: `${posPct}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="rounded-full bg-[#FFD60A] border-4 border-[#08080C]"
                  style={{
                    width: 20,
                    height: 20,
                    transform: `scale(${pop})`,
                    boxShadow: "0 0 16px rgba(255,214,10,0.8)",
                  }}
                />
                <span
                  className="text-white font-black text-sm tracking-widest mt-4 whitespace-nowrap"
                  style={{ opacity: labelOpacity, textShadow: "0 0 5px rgba(255,255,255,0.4)" }}
                >
                  {node.label}
                </span>
                <span
                  className="text-[#8A8A96] font-semibold text-xs tracking-wider mt-1 whitespace-nowrap"
                  style={{ opacity: labelOpacity }}
                >
                  {node.months} mo
                </span>
              </div>
            );
          })}
        </div>

        <div
          className="mt-12 flex items-baseline gap-4"
          style={{
            opacity: stampOpacity,
            transform: `scale(${stampScale})`,
          }}
        >
          <span
            className="font-black text-white leading-none"
            style={{
              fontSize: 110,
              textShadow: `0 0 ${glowAmount}px rgba(255,214,10,0.7), 0 0 15px rgba(255,255,255,0.3)`,
            }}
          >
            5
          </span>
          <span 
            className="font-black text-[#FFD60A] text-5xl tracking-tight"
            style={{
               textShadow: `0 0 ${glowAmount / 2}px rgba(255,214,10,0.5)`,
            }}
          >
            MONTHS
          </span>
        </div>
        <p
          className="text-[#8A8A96] font-semibold text-base tracking-[0.4em] uppercase mt-3"
          style={{ opacity: stampOpacity }}
        >
          start to finish
        </p>
      </div>
    </AbsoluteFill>
  );
};

export default TimelineBroll;

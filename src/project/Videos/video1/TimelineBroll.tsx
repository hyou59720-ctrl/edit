import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

/**
 * BROLL 4 — TIMELINE
 * Subtitle covered: "So probably five months from start to finish."
 * Duration: 64 frames (~2.1s @ 30fps)
 *
 * Concept: the full pipeline draws itself left-to-right as a connected
 * node timeline (Idea -> Work -> Film -> Edit), each node popping in
 * with its month-count, then a big "5 MONTHS" total stamps down as
 * the summary payoff.
 */

const NODES = [
  { label: "IDEA", months: "1-2", },
  { label: "WORK", months: "3-4" },
  { label: "FILM", months: "0.5" },
  { label: "EDIT", months: "0.75" },
];

export const TimelineBroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerOpacity = interpolate(frame, [0, 8, 55, 64], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const trackWidth = 640;
  const nodeCount = NODES.length;

  // Connecting line draws left to right
  const lineProgress = spring({
    frame: frame - 4,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 24,
    config: { damping: 18, mass: 0.7 },
  });

  // "5 MONTHS" total stamp, appears after nodes settle
  const stampScale = spring({
    frame: frame - 40,
    fps,
    from: 2.2,
    to: 1,
    durationInFrames: 14,
    config: { damping: 11 },
  });
  const stampOpacity = interpolate(frame, [40, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="bg-[#08080C] flex items-center justify-center overflow-hidden">
      <AbsoluteFill
        className="opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        className="relative flex flex-col items-center"
        style={{ opacity: containerOpacity }}
      >
        {/* Timeline track */}
        <div className="relative" style={{ width: trackWidth, height: 96 }}>
          {/* base line */}
          <div className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2 bg-white/10 rounded-full" />
          {/* animated fill line */}
          <div
            className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 bg-[#FFD60A] rounded-full"
            style={{
              width: `${lineProgress * 100}%`,
              boxShadow: "0 0 14px rgba(255,214,10,0.7)",
            }}
          />

          {/* Nodes */}
          {NODES.map((node, i) => {
            const posPct = (i / (nodeCount - 1)) * 100;
            const delay = 6 + i * 8;
            const pop = spring({
              frame: frame - delay,
              fps,
              from: 0,
              to: 1,
              durationInFrames: 14,
              config: { damping: 12, mass: 0.5 },
            });
            const labelOpacity = interpolate(
              frame,
              [delay, delay + 6],
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
                  style={{ opacity: labelOpacity }}
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

        {/* "5 MONTHS" total stamp */}
        <div
          className="mt-16 flex items-baseline gap-3"
          style={{
            opacity: stampOpacity,
            transform: `scale(${stampScale})`,
          }}
        >
          <span
            className="font-black text-white leading-none"
            style={{
              fontSize: 130,
              textShadow: "0 0 60px rgba(255,214,10,0.4)",
            }}
          >
            5
          </span>
          <span className="font-black text-[#FFD60A] text-4xl tracking-tight">
            MONTHS
          </span>
        </div>
        <p
          className="text-[#8A8A96] font-semibold text-base tracking-[0.4em] uppercase mt-2"
          style={{ opacity: stampOpacity }}
        >
          start to finish
        </p>
      </div>
    </AbsoluteFill>
  );
};

export default TimelineBroll;
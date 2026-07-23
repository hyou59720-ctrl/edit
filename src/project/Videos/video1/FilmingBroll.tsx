import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

/**
 * BROLL 3 — FILMING
 * Subtitle covered: "and then a couple weeks filming,"
 * Duration: 53 frames (~1.8s @ 30fps)
 *
 * Concept: a camera viewfinder frame snaps open with corner brackets,
 * a REC dot pulses, and a "2-3 WEEKS" stat racks focus into view —
 * evoking the production/shooting stage of the pipeline.
 */

export const FilmingBroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerOpacity = interpolate(frame, [0, 8, 44, 53], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Viewfinder corner brackets snap outward from center
  const bracketSpread = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 16,
    config: { damping: 13, mass: 0.5 },
  });

  const frameW = 560;
  const frameH = 360;
  const bracketLen = 56;
  const bracketInset = interpolate(bracketSpread, [0, 1], [40, 0]);

  // Rack focus blur on the center label
  const focusBlur = interpolate(frame, [10, 24], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelOpacity = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // REC dot pulse
  const recPulse = 0.6 + 0.4 * Math.sin(frame * 0.5);
  const recOpacity = interpolate(frame, [6, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scanning line sweeping down through the frame
  const scanY = interpolate(frame % 30, [0, 30], [0, frameH], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanOpacity = interpolate(frame, [16, 24, 44, 53], [0, 0.5, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const Corner = ({
    top,
    left,
    flipX,
    flipY,
  }: {
    top: boolean;
    left: boolean;
    flipX: number;
    flipY: number;
  }) => (
    <div
      className="absolute"
      style={{
        top: top ? -bracketInset : "auto",
        bottom: !top ? -bracketInset : "auto",
        left: left ? -bracketInset : "auto",
        right: !left ? -bracketInset : "auto",
        width: bracketLen,
        height: bracketLen,
        transform: `scale(${flipX}, ${flipY})`,
        transformOrigin: `${left ? "left" : "right"} ${top ? "top" : "bottom"}`,
      }}
    >
      <div
        className="absolute bg-[#FFD60A]"
        style={{
          width: bracketLen,
          height: 5,
          top: top ? 0 : "auto",
          bottom: !top ? 0 : "auto",
          left: 0,
          boxShadow: "0 0 12px rgba(255,214,10,0.6)",
        }}
      />
      <div
        className="absolute bg-[#FFD60A]"
        style={{
          width: 5,
          height: bracketLen,
          top: top ? 0 : "auto",
          bottom: !top ? 0 : "auto",
          left: left ? 0 : "auto",
          right: !left ? 0 : "auto",
          boxShadow: "0 0 12px rgba(255,214,10,0.6)",
        }}
      />
    </div>
  );

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
        className="relative"
        style={{
          width: frameW,
          height: frameH,
          opacity: containerOpacity,
        }}
      >
        {/* Viewfinder frame outline */}
        <div className="absolute inset-0 border border-white/10 rounded-sm" />

        {/* corner brackets */}
        <Corner top left flipX={1} flipY={1} />
        <Corner top left={false} flipX={-1} flipY={1} />
        <Corner top={false} left flipX={1} flipY={-1} />
        <Corner top={false} left={false} flipX={-1} flipY={-1} />

        {/* scanning sweep line */}
        <div
          className="absolute left-0 right-0 h-[2px] bg-[#FFD60A]"
          style={{
            top: scanY,
            opacity: scanOpacity,
            boxShadow: "0 0 16px rgba(255,214,10,0.8)",
          }}
        />

        {/* REC indicator, top-left */}
        <div
          className="absolute top-5 left-6 flex items-center gap-2"
          style={{ opacity: recOpacity }}
        >
          <div
            className="w-3 h-3 rounded-full bg-red-500"
            style={{
              opacity: recPulse,
              boxShadow: `0 0 ${8 * recPulse}px rgba(239,68,68,0.8)`,
            }}
          />
          <span className="text-white font-black text-sm tracking-widest">
            REC
          </span>
        </div>

        {/* frame counter, top-right */}
        <div
          className="absolute top-5 right-6 text-[#8A8A96] font-mono text-xs tracking-wider"
          style={{ opacity: recOpacity }}
        >
          00:14:07
        </div>

        {/* Center stat, racks into focus */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            opacity: labelOpacity,
            filter: `blur(${focusBlur}px)`,
          }}
        >
          <span
            className="font-black text-white leading-none"
            style={{
              fontSize: 110,
              textShadow: "0 0 50px rgba(255,214,10,0.35)",
            }}
          >
            2-3<span className="text-[#FFD60A]">wk</span>
          </span>
          <p className="text-[#8A8A96] font-semibold text-base tracking-[0.4em] uppercase mt-3">
            on set, filming
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default FilmingBroll;
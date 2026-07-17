import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { Background } from "./components/Background";
import { TornPaper } from "./components/TornPaper";
import { SunburstLogo, KnotLogo } from "./components/Logos";
import { Character } from "./components/Character";
import { TitleWord } from "./components/TitleWord";

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // slow cinematic dolly + drift for whole scene (parallax base layer)
  const camScale = interpolate(frame, [0, 250], [1.06, 1.0], {
    easing: Easing.out(Easing.cubic),
  });
  const camX = Math.sin(frame / 140) * 10;
  const camY = interpolate(frame, [0, 250], [10, -6]);

  // paper tear reveal: two panels split apart from center
  const tear = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 90 },
    durationInFrames: 40,
  });
  const panelGap = interpolate(tear, [0, 1], [0, 22]);

  // arrows pulse
  const arrowPulse = interpolate(Math.sin(frame / 15), [-1, 1], [0, 6]);

  const panelW = width * 0.42;
  const panelH = height * 0.34;

  return (
    <AbsoluteFill>
      <Background />

      {/* camera parallax wrapper */}
      <AbsoluteFill
        style={{
          transform: `scale(${camScale}) translate(${camX}px, ${camY}px)`,
        }}
      >
        {/* torn paper panels with logos */}
        <div
          className="absolute flex justify-center items-start"
          style={{ top: height * 0.1, width, gap: panelGap }}
        >
          <Sequence from={0}>
            <TornPaper width={panelW} height={panelH} seed={3} fill="#f4ecd8">
              <FloatingLogo delay={0}>
                <SunburstLogo size={panelW * 0.55} />
              </FloatingLogo>
            </TornPaper>
          </Sequence>

          <Sequence from={0}>
            <TornPaper width={panelW} height={panelH} seed={9} fill="#eef1e4">
              <FloatingLogo delay={6}>
                <KnotLogo size={panelW * 0.55} />
              </FloatingLogo>
            </TornPaper>
          </Sequence>
        </div>

        {/* facing arrows between panels */}
        <div
          className="absolute flex flex-col items-center justify-center gap-6"
          style={{
            top: height * 0.1 + panelH * 0.42,
            left: width / 2 - 40,
            width: 80,
          }}
        >
          <Arrow direction="right" offset={arrowPulse} />
          <Arrow direction="left" offset={-arrowPulse} />
        </div>

        {/* characters standing beneath panels */}
        <div
          className="absolute flex justify-center items-end"
          style={{
            top: height * 0.1 + panelH - 60,
            width,
            gap: panelGap + panelW * 0.55,
          }}
        >
          <Character headColor="#d5502e" delay={10} />
          <Character headColor="#1f8f78" delay={40} bodyColor="#454545" />
        </div>

        {/* title strips */}
        <div
          className="absolute flex flex-wrap justify-center items-center"
          style={{ top: height * 0.62, width }}
        >
          <TitleWord word="FABLE" delay={55} rotate={-3} />
          <TitleWord word="VS" delay={68} rotate={2} underline />
          <TitleWord word="SOL" delay={80} rotate={-1} />
        </div>

        {/* Vox-style badge, bottom right */}
        <Sequence from={95}>
          <VoxBadge width={width} height={height} />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FloatingLogo: React.FC<{ children: React.ReactNode; delay: number }> = ({
  children,
  delay,
}) => {
  const frame = useCurrentFrame() - delay;
  const float = Math.sin(frame / 45) * 6;
  const rot = Math.sin(frame / 70) * 3;
  return (
    <div
      style={{
        transform: `translateY(${float}px) rotate(${rot}deg)`,
        filter: "drop-shadow(0 6px 10px rgba(20,15,5,0.25))",
      }}
    >
      {children}
    </div>
  );
};

const Arrow: React.FC<{ direction: "left" | "right"; offset: number }> = ({
  direction,
  offset,
}) => {
  const dx = direction === "right" ? offset : -offset;
  return (
    <svg
      width={60}
      height={28}
      viewBox="0 0 60 28"
      style={{ transform: `translateX(${dx}px) ${direction === "left" ? "scaleX(-1)" : ""}` }}
    >
      <path
        d="M2 14 H46 M34 2 L48 14 L34 26"
        stroke="#e8b23d"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

const VoxBadge: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 15 } });
  const rot = interpolate(enter, [0, 1], [12, -4]);

  return (
    <div
      className="absolute flex flex-col items-end gap-1"
      style={{
        right: width * 0.06,
        bottom: height * 0.05,
        opacity: enter,
        transform: `scale(${enter}) rotate(${rot}deg)`,
        transformOrigin: "bottom right",
      }}
    >
      <div className="bg-[#f4d33c] px-6 py-3 shadow-[0_8px_16px_rgba(20,15,5,0.3)]">
        <span className="font-serif italic font-black text-black text-3xl">
          Vox
        </span>
      </div>
      <div className="bg-black/85 px-4 py-1">
        <span className="font-sans text-white text-xs tracking-widest">
          STYLE
        </span>
      </div>
    </div>
  );
};

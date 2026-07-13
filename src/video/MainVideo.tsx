import React from "react";
import {
  AbsoluteFill,
  Video,
  Sequence,
  useCurrentFrame,
  staticFile,
  interpolate,
  Easing,
  Audio, // 'Audio' import ተደርጓል
} from "remotion";
import { subtitles, Subtitle } from "./Subtitles";
import { Broll1 } from "./Broll1";
import { Broll2 } from "./Broll2";
import { Broll3 } from "./Broll3";
import { Broll4 } from "./Broll4";
import { FontStyles } from "./Fonts";
import { KEYWORD_STYLES, findKeyword } from "./keywordStyles";
import { KeywordConceptVisual } from "./KeywordConceptVisual";

const AMHARIC_STYLE = {
  color: "#FFF5CC",
  textShadow: `
    -2px -2px 0 #000,  2px -2px 0 #000, -2px  2px 0 #000,  2px  2px 0 #000,
    0px 4px 14px rgba(0, 0, 0, 0.95), 
    0px 8px 35px rgba(255, 215, 0, 0.25)
  `,
};

const seededValue = (str: string, index: number): number => {
  let hash = 0;
  const seedStr = `${str}-${index}`;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 1000) / 1000;
};

type EntryDirection = "top" | "bottom" | "left" | "right";
const ENTRY_DIRECTIONS: EntryDirection[] = ["top", "bottom", "left", "right"];
const FONT_SIZE_STEPS_EN = [58, 66, 74, 84, 96];
const FONT_SIZE_STEPS_AM = [64, 72, 80, 90, 102];

const CUT_POINTS = [91, 185, 271, 365, 451, 561, 721, 871];
const CUT_WINDOW = 8;

const getCutIntensity = (frame: number): number => {
  let intensity = 0;
  for (const cp of CUT_POINTS) {
    const dist = Math.abs(frame - cp);
    if (dist < CUT_WINDOW) {
      const local = 1 - dist / CUT_WINDOW;
      intensity = Math.max(intensity, local);
    }
  }
  return intensity;
};

const CameraLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const cutIntensity = getCutIntensity(frame);
  const cutBlur = cutIntensity * 16;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        filter: cutBlur > 0.1 ? `blur(${cutBlur}px)` : undefined,
      }}
    >
      <Video
        src={staticFile("/raw.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

const BrollTransition: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const WINDOW = CUT_WINDOW;

  const entryIntensity = interpolate(frame, [0, WINDOW], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitIntensity = interpolate(
    frame,
    [durationInFrames - WINDOW, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const intensity = Math.max(entryIntensity, exitIntensity);
  const blur = intensity * 16;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

const BackgroundGraphics: React.FC = () => {
  const frame = useCurrentFrame();

  const particles = new Array(6).fill(0).map((_, i) => {
    const seedX = 15 + i * 14;
    const speed = 0.12 + (i % 3) * 0.04;
    const y = 100 - ((frame * speed + i * 40) % 130);
    const opacity = interpolate(y, [0, 15, 85, 100], [0, 0.2, 0.2, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { x: seedX, y, opacity };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] mix-blend-overlay">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <div className="absolute top-[8%] right-[6%] w-[1px] h-[15%] bg-gradient-to-b from-white/0 via-white/15 to-white/0" />
      <div className="absolute bottom-[10%] left-[6%] w-[1px] h-[12%] bg-gradient-to-b from-white/0 via-white/10 to-white/0" />
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-[2px] h-[2px] rounded-full bg-white"
          style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: p.opacity }}
        />
      ))}
    </AbsoluteFill>
  );
};

const SubtitleWord: React.FC<{
  word: string;
  wordIndex: number;
  totalWords: number;
  chunk: Subtitle;
  frame: number;
}> = ({ word, wordIndex, totalWords, chunk, frame }) => {
  const isAmharic = /[\u1200-\u137F]/.test(word);
  const staggerFrames = 3;
  const wordStart = isAmharic
    ? chunk.startFrame
    : chunk.startFrame + wordIndex * staggerFrames;

  const revealDuration = 8;
  const fadeOutStart = chunk.endFrame - 5;

  const seedA = seededValue(word, wordIndex);
  const seedB = seededValue(word, wordIndex + 100);

  const keyword = findKeyword(word);
  const style = keyword ? KEYWORD_STYLES[keyword] : null;

  const sizeSteps = isAmharic ? FONT_SIZE_STEPS_AM : FONT_SIZE_STEPS_EN;
  const sizeIndex = style
    ? sizeSteps.length - 1
    : Math.floor(seedA * (sizeSteps.length - 1));
  const fontSize = `${sizeSteps[sizeIndex]}px`;

  const direction: EntryDirection =
    ENTRY_DIRECTIONS[Math.floor(seedA * ENTRY_DIRECTIONS.length) % ENTRY_DIRECTIONS.length];

  const travel = 40 + seedB * 25;

  let entryX = 0;
  let entryY = 0;
  if (direction === "top") entryY = -travel;
  if (direction === "bottom") entryY = travel;
  if (direction === "left") entryX = -travel;
  if (direction === "right") entryX = travel;

  const enterOpacity = interpolate(
    frame,
    [wordStart, wordStart + revealDuration - 2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateX = interpolate(
    frame,
    [wordStart, wordStart + revealDuration],
    [entryX, 0],
    { easing: Easing.out(Easing.back(1.2)), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateY = interpolate(
    frame,
    [wordStart, wordStart + revealDuration],
    [entryY, 0],
    { easing: Easing.out(Easing.back(1.2)), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const rotationSign = seedB > 0.5 ? 1 : -1;
  const entryRotation = rotationSign * (8 + seedB * 10);
  const rotate = interpolate(
    frame,
    [wordStart, wordStart + revealDuration],
    [entryRotation, 0],
    { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const baselineOffset = (seedB - 0.5) * 16;

  const blurAmount = interpolate(
    frame,
    [wordStart, wordStart + revealDuration],
    [12, 0],
    { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const totalDuration = chunk.endFrame - chunk.startFrame;
  const perWordDuration = totalDuration / totalWords;
  const activeWordStart = chunk.startFrame + wordIndex * perWordDuration;
  const activeWordEnd = activeWordStart + perWordDuration;

  const isActive = frame >= activeWordStart && frame <= activeWordEnd;

  const highlightScale = interpolate(
    frame,
    [activeWordStart, activeWordStart + 3, activeWordEnd - 2, activeWordEnd],
    [1, 1.18, 1.18, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const activeWobble = isActive
    ? Math.sin((frame - activeWordStart) * 0.9) * 1.5
    : 0;

  const exitOpacity = interpolate(frame, [fadeOutStart, chunk.endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const baseOpacity = Math.min(enterOpacity, exitOpacity);
  const finalOpacity = isActive ? baseOpacity : baseOpacity * 0.6;

  return (
    <span
      className={`inline-block leading-none tracking-tight select-none transition-all duration-150 ${
        style ? style.textClass : ""
      }`}
      style={{
        opacity: finalOpacity,
        transform: `translate(${translateX}px, ${translateY + baselineOffset}px) rotate(${
          rotate + activeWobble
        }deg) scale(${highlightScale})`,
        fontSize,
        fontFamily: "'AkiraExpanded', 'HabeshaStencil', sans-serif",
        fontWeight: "normal",
        padding: "0 6px",
        transformOrigin: "center center",
        ...(style
          ? { filter: `blur(${blurAmount}px) drop-shadow(0px 4px 12px rgba(0,0,0,${isActive ? 0.9 : 0.5}))` }
          : {
              color: AMHARIC_STYLE.color,
              textShadow: AMHARIC_STYLE.textShadow,
              filter: `blur(${blurAmount}px)`,
            }),
      }}
    >
      {word}
    </span>
  );
};

export const MainVideo: React.FC = () => {
  const frame = useCurrentFrame();

  const currentSubtitle = subtitles.find(
    (sub) => frame >= sub.startFrame && frame <= sub.endFrame
  );

  // SFX Timing Logic
  const getSfxForFrame = (f: number): { src: string; volume: number } | null => {
    // 1. Scene Intro at Frame 0
    if (f === 0) {
      return { src: staticFile("audio/whoosh.mp3"), volume: 0.5 };
    }

    // 2. Cut Points with stagger to avoid overlap if necessary
    for (let i = 0; i < CUT_POINTS.length; i++) {
      if (f === CUT_POINTS[i]) {
        // Alt b/w whoosh and pop for cuts
        const src =
          i % 2 === 0
            ? staticFile("audio/whoosh.mp3")
            : staticFile("audio/pop.mp3");
        return { src, volume: 0.35 };
      }
    }

    // 3. Subtitle Word Entries (click sound)
    if (currentSubtitle) {
      const isAmharic = /[\u1200-\u137F]/.test(currentSubtitle.text);
      if (!isAmharic) {
        const staggerFrames = 3;
        const words = currentSubtitle.text.split(" ");
        for (let i = 0; i < words.length; i++) {
          const wordStart = currentSubtitle.startFrame + i * staggerFrames;
          if (f === wordStart) {
            return { src: staticFile("audio/click.mp3"), volume: 0.25 };
          }
        }
      } else {
        // Amharic chunks often enter as a whole, play one sound
        if (f === currentSubtitle.startFrame) {
            return { src: staticFile("audio/click.mp3"), volume: 0.3 };
        }
      }
    }

    return null;
  };

  const sfx = getSfxForFrame(frame);

  // ቪዲዮውን ይበልጥ ህያው ለማድረግ የሚከተሉትን የድምፅ ፋይሎች መጠቀም ትችላለህ፡
  // 1. 'impact.mp3': ለትልልቅ ትራንዚሽኖች (ለምሳሌ ከረጅም አኒሜሽን በኋላ)።
  // 2. 'swoosh_fast.mp3': ለፈጣን የጽሑፍ ለውጦች ወይም ስክሪን ለውጦች።

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* SFX Playback -> ምንም ማለቀያ የለውም፣ ራሱ ያልቃል */}
      {sfx && <Audio src={sfx.src} volume={sfx.volume} />}

      <FontStyles />
      <CameraLayer />
      <BackgroundGraphics />

      <Sequence from={91} durationInFrames={94}>
        <BrollTransition durationInFrames={94}>
          <Broll1 />
        </BrollTransition>
      </Sequence>
      <Sequence from={271} durationInFrames={94}>
        <BrollTransition durationInFrames={94}>
          <Broll2 />
        </BrollTransition>
      </Sequence>
      <Sequence from={451} durationInFrames={110}>
        <BrollTransition durationInFrames={110}>
          <Broll3 />
        </BrollTransition>
      </Sequence>
      <Sequence from={721} durationInFrames={200}>
        <BrollTransition durationInFrames={200}>
          <Broll4 />
        </BrollTransition>
      </Sequence>

      {currentSubtitle && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <KeywordConceptVisual chunk={currentSubtitle} frame={frame} />
        </AbsoluteFill>
      )}

      {currentSubtitle && (
        <div
          className="absolute w-full flex justify-center items-center px-6 gap-x-6 gap-y-3 flex-wrap max-w-[96%] left-[2%]"
          style={{ bottom: "22%", pointerEvents: "none", zIndex: 100 }}
        >
          {currentSubtitle.text.split(" ").map((word, i, arr) => (
            <SubtitleWord
              key={`${currentSubtitle.startFrame}-${i}`}
              word={word}
              wordIndex={i}
              totalWords={arr.length}
              chunk={currentSubtitle}
              frame={frame}
            />
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

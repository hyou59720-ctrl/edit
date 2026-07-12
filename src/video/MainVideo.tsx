import React from "react";
import {
  AbsoluteFill,
  Video,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  interpolate,
  Easing,
  delayRender,
  continueRender,
} from "remotion";
import {
  Lightbulb,
  Target,
  ArrowRight,
  TrendingUp,
  LayoutTemplate,
  Building2,
  Video as VideoIcon,
  Flame,
  LucideIcon,
} from "lucide-react";
import { subtitles, Subtitle } from "./Subtitles";
import { Broll1 } from "./Broll1";
import { Broll2 } from "./Broll2";
import { Broll3 } from "./Broll3";
import { Broll4 } from "./Broll4";

/* ------------------------------------------------------------------ */
/* CUSTOM LOCAL FONTS REGISTRATION (የአንተን የፎንት ፋይሎች መጫኛ)          */
/* ------------------------------------------------------------------ */

const waitForFont = delayRender("Loading custom fonts");

const fontTimeout = setTimeout(() => {
  console.warn("Font loading timed out, continuing render anyway");
  continueRender(waitForFont);
}, 8000);

if (typeof window !== "undefined" && "FontFace" in window) {
  const habeshaFont = new FontFace(
    "HabeshaStencil",
    `url(${staticFile("/font/Waldba_Yebse_Regular_299c8ff034.ttf")})`
  );

  const akiraFont = new FontFace(
    "AkiraExpanded",
    `url(${staticFile("/font/Akira Expanded Demo.otf")})`
  );

  Promise.all([habeshaFont.load(), akiraFont.load()])
    .then(([loadedHabesha, loadedAkira]) => {
      document.fonts.add(loadedHabesha);
      document.fonts.add(loadedAkira);
      clearTimeout(fontTimeout);
      continueRender(waitForFont);
    })
    .catch((err) => {
      console.error("Font መጫን አልተቻለም:", err);
      clearTimeout(fontTimeout);
      continueRender(waitForFont);
    });
} else {
  clearTimeout(fontTimeout);
  continueRender(waitForFont);
}

/* ------------------------------------------------------------------ */
/* KEYWORD DESIGN SYSTEM (Premium 2 to 4 Gradient Colors for TikTok)  */
/* ------------------------------------------------------------------ */

type KeywordStyle = {
  textClass: string;
  icon?: LucideIcon;
};

const KEYWORD_STYLES: Record<string, KeywordStyle> = {
  MOTIVATION: { textClass: "bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent", icon: Flame },
  AGENCY: { textClass: "bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent", icon: Building2 },
  INSPIRATION: { textClass: "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent", icon: Lightbulb },
  PROGRESS: { textClass: "bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent", icon: TrendingUp },
  STEP: { textClass: "bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent", icon: ArrowRight },
  TEMPLATE: { textClass: "bg-gradient-to-r from-red-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent", icon: LayoutTemplate },
  INSPIRE: { textClass: "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent", icon: Lightbulb },
  MODEL: { textClass: "bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent", icon: Target },
  EDIT: { textClass: "bg-gradient-to-r from-violet-400 via-pink-500 to-red-400 bg-clip-text text-transparent", icon: VideoIcon },
};

const AMHARIC_STYLE = {
  color: "#FFF5CC",
  textShadow: `
    -2px -2px 0 #000,  2px -2px 0 #000, -2px  2px 0 #000,  2px  2px 0 #000,
    0px 4px 14px rgba(0, 0, 0, 0.95), 
    0px 8px 35px rgba(255, 215, 0, 0.25)
  `,
};

const findKeyword = (word: string): string | null => {
  const upper = word.toUpperCase();
  for (const key of Object.keys(KEYWORD_STYLES)) {
    if (upper.includes(key)) return key;
  }
  return null;
};

/* ------------------------------------------------------------------ */
/* TRANSITION HELPERS — Cut-point Whip Zoom & Subtitle Breathing      */
/* ------------------------------------------------------------------ */

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

// እያንዳንዱ subtitle phrase ትክክለኛ ርዝመት ልክ (startFrame → endFrame) ላይ
// ለስላሳ zoom-in → hold → zoom-out ("breathing") ያደርጋል
const getBreathIntensity = (frame: number): number => {
  const sub = subtitles.find((s) => frame >= s.startFrame && frame <= s.endFrame);
  if (!sub) return 0;

  const duration = sub.endFrame - sub.startFrame;
  // ramp ርዝመት: ከ duration 35% ወይም ከፍተኛ 16 frame (የትኛውም ያነሰው)፣ ቢያንስ 5 frame
  const ramp = Math.max(5, Math.min(16, duration * 0.35));

  return interpolate(
    frame,
    [
      sub.startFrame,
      sub.startFrame + ramp,
      sub.endFrame - ramp,
      sub.endFrame,
    ],
    [0, 1, 1, 0],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
};

/* ------------------------------------------------------------------ */
/* CAMERA — Ken-Burns + Cut-point Whip + Subtitle Breathing            */
/* ------------------------------------------------------------------ */

const CameraLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // 1. ነባር slow overall Ken-Burns punch-in
  const kenBurnsScale = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateRight: "clamp",
  });

  // 2. B-roll cut point ዙሪያ whip zoom + blur
  const cutIntensity = getCutIntensity(frame);
  const cutScale = 1 + cutIntensity * 0.18;
  const cutBlur = cutIntensity * 16;

  // 3. subtitle phrase ልክ ላይ ለስላሳ breathing zoom (in → hold → out)
  const breathIntensity = getBreathIntensity(frame);
  const breathScale = 1 + breathIntensity * 0.06;

  const totalScale = kenBurnsScale * cutScale * breathScale;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transform: `scale(${totalScale})`,
        transformOrigin: "center center",
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

/* ------------------------------------------------------------------ */
/* BROLL TRANSITION WRAPPER — entry/exit whip zoom + blur              */
/* ------------------------------------------------------------------ */

const BrollTransition: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ durationInFrames, children }) => {
  const frame = useCurrentFrame(); // Sequence-relative frame (ከ0 ይጀምራል)
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
  const scale = 1 + intensity * 0.18;
  const blur = intensity * 16;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* BACKGROUND GRAPHICS — Vignette, Clean Noise & Particles            */
/* ------------------------------------------------------------------ */

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
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* SUBTITLE WORD — Hybrid English Staggered & Amharic Slide Up        */
/* ------------------------------------------------------------------ */

const SubtitleWord: React.FC<{
  word: string;
  wordIndex: number;
  chunk: Subtitle;
  frame: number;
}> = ({ word, wordIndex, chunk, frame }) => {
  const isAmharic = /[\u1200-\u137F]/.test(word);

  const staggerFrames = 3;
  const wordStart = isAmharic
    ? chunk.startFrame
    : chunk.startFrame + wordIndex * staggerFrames;

  const revealDuration = 7;
  const fadeOutStart = chunk.endFrame - 5;

  const enterOpacity = interpolate(
    frame,
    [wordStart, wordStart + revealDuration],
    [0, 1],
    { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateY = interpolate(
    frame,
    [wordStart, wordStart + revealDuration],
    [45, 0],
    { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const blurAmount = interpolate(
    frame,
    [wordStart, wordStart + revealDuration],
    [12, 0],
    { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const keyword = findKeyword(word);
  const style = keyword ? KEYWORD_STYLES[keyword] : null;

  const baseScale = style ? 1.12 : 1.0;
  const scale = interpolate(
    frame,
    [wordStart, wordStart + revealDuration],
    [baseScale * 0.8, baseScale],
    { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const exitOpacity = interpolate(frame, [fadeOutStart, chunk.endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = Math.min(enterOpacity, exitOpacity);
  const fontSize = isAmharic ? "80px" : "74px";

  return (
    <span
      className={`inline-block leading-none tracking-tight select-none ${
        style ? style.textClass : ""
      }`}
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        fontSize: fontSize,
        fontFamily: "'AkiraExpanded', 'HabeshaStencil', sans-serif",
        fontWeight: "normal",
        padding: "0 6px",
        ...(style
          ? { filter: `blur(${blurAmount}px) drop-shadow(0px 4px 12px rgba(0,0,0,0.7))` }
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

/* ------------------------------------------------------------------ */
/* KEYWORD ICON BADGE — Much Bigger & Hidden on B-Roll                */
/* ------------------------------------------------------------------ */

const KeywordIconBadge: React.FC<{ chunk: Subtitle; frame: number }> = ({
  chunk,
  frame,
}) => {
  const isBroll =
    (frame >= 91 && frame <= 185) ||
    (frame >= 271 && frame <= 365) ||
    (frame >= 451 && frame <= 561) ||
    (frame >= 721 && frame <= 871);

  if (isBroll) return null;

  const words = chunk.text.split(" ");
  let matchedKey: string | null = null;
  for (const w of words) {
    const k = findKeyword(w);
    if (k) {
      matchedKey = k;
      break;
    }
  }
  if (!matchedKey) return null;

  const style = KEYWORD_STYLES[matchedKey];
  const Icon = style.icon;
  if (!Icon) return null;

  const start = chunk.startFrame;

  const opacity = interpolate(
    frame,
    [start, start + 8, chunk.endFrame - 6, chunk.endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const iconScale = interpolate(
    frame,
    [start, start + 8],
    [0.85, 1],
    { easing: Easing.out(Easing.quad), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateY = interpolate(frame, [start, start + 8], [15, 0], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (opacity <= 0) return null;

  return (
    <div
      className="absolute flex items-center justify-center w-32 h-32 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl left-1/2 -translate-x-1/2"
      style={{
        bottom: "40%",
        opacity,
        transform: `translateY(${translateY}px) scale(${iconScale}) translateX(-50%)`,
        transformOrigin: "center center",
      }}
    >
      <Icon size={56} strokeWidth={1.8} color="#ffffff" />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export const MainVideo: React.FC = () => {
  const frame = useCurrentFrame();

  const currentSubtitle = subtitles.find(
    (sub) => frame >= sub.startFrame && frame <= sub.endFrame
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <CameraLayer />
      <BackgroundGraphics />

      {/* B-Roll Sequences — በእያንዳንዱ transition ጫፍ ላይ whip zoom+blur */}
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
      <Sequence from={721} durationInFrames={150}>
        <BrollTransition durationInFrames={150}>
          <Broll4 />
        </BrollTransition>
      </Sequence>

      {/* Icon Badge */}
      {currentSubtitle && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <KeywordIconBadge chunk={currentSubtitle} frame={frame} />
        </AbsoluteFill>
      )}

      {/* Custom Font Subtitle Container */}
      {currentSubtitle && (
        <div
          className="absolute w-full flex justify-center items-center px-6 gap-x-6 gap-y-3 flex-wrap max-w-[96%] left-[2%]"
          style={{ bottom: "22%", pointerEvents: "none", zIndex: 100 }}
        >
          {currentSubtitle.text.split(" ").map((word, i) => (
            <SubtitleWord
              key={`${currentSubtitle.startFrame}-${i}`}
              word={word}
              wordIndex={i}
              chunk={currentSubtitle}
              frame={frame}
            />
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};
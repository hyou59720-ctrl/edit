import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Video,
  Audio,
  staticFile,
  AbsoluteFill,
  spring,
  interpolate,
  Easing,
  Sequence,
} from "remotion";
import { subtitleData } from "./subtitles";

/* ------------------------------------------------------------------ */
/*  PREMIUM DESIGN TOKENS                                              */
/* ------------------------------------------------------------------ */
const INK = "#F5F5F7";
const CYAN = "#34E4EA";
const GOLD = "#FFC857";
const VIOLET = "#7C6FFF";
const GREEN = "#2EE59D";

const PARTICLES = Array.from({ length: 25 }).map((_, i) => ({
  x: (Math.sin(i * 14.3) * 0.5 + 0.5) * 100,
  y: (Math.cos(i * 8.12) * 0.5 + 0.5) * 100,
  size: 3 + ((i * 29) % 6),
  speed: 0.2 + ((i * 17) % 10) / 35,
  drift: (i % 2 === 0 ? 1 : -1) * (5 + (i % 5)),
}));

const PRINCIPLES = [
  { label: "Task", revealAt: 495, color: CYAN, icon: "target" },
  { label: "Context", revealAt: 512, color: VIOLET, icon: "layers" },
  { label: "References", revealAt: 527, color: GOLD, icon: "link" },
  { label: "Evaluate", revealAt: 542, color: GREEN, icon: "check" },
  { label: "Iterate", revealAt: 558, color: GOLD, icon: "refresh" },
] as const;

/* ---------- Oscar-Level Ultra-Clean SVG Icons ------ */
const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({
  name,
  size = 28,
  color = INK,
}) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: `${color}15`,
    stroke: color,
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: { filter: `drop-shadow(0 0 6px ${color}30)` },
  };

  switch (name) {
    case "google":
      return (
        <svg {...common} fill="none">
          <path
            stroke={color}
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            stroke={color}
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            stroke={color}
            d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
          />
          <path
            stroke={color}
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      );
    case "trophy":
      return (
        <svg {...common}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a4 4 0 0 0-4 4v5c0 2.2 1.8 4 4 4s4-1.8 4-4V6a4 4 0 0 0-4-4Z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "doc":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "brain":
      return (
        <svg {...common}>
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
          <path d="M12 6v12M8 10a4 4 0 0 1 8 0M9 14a3 3 0 0 1 6 0" />
        </svg>
      );
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" fill={color} />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case "link":
      return (
        <svg {...common}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...common}>
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
      );
    default:
      return null;
  }
};

const wordColor = (word: string): string => {
  const w = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  if (
    [
      "best",
      "hands",
      "down",
      "essential",
      "master",
      "20",
      "minutes",
      "packed",
      "rated",
    ].includes(w)
  )
    return GOLD;
  if (
    ["google", "ai", "training", "model", "system", "course", "guide"].includes(
      w,
    )
  )
    return CYAN;
  if (["saving", "complete", "thinks"].includes(w)) return GREEN;
  return INK;
};

const activeIn = (frame: number, start: number, end: number) =>
  frame >= start && frame < end;

export const SubtitledVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  /* ---------------- COMPLEX CAMERA MOVEMENT ---------------- */
  const baseScale = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    easing: Easing.quad,
  });
  const punchZoom = interpolate(
    frame,
    [104, 110, 155, 160, 300, 310, 345, 352],
    [0, 0.05, 0.05, 0, 0, 0.07, 0.07, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const camScale = baseScale + punchZoom;
  const camX = Math.sin(frame / 90) * 4;
  const camY = Math.cos(frame / 120) * 3;

  /* ---------------- SUBTITLE LOGIC ---------------- */
  const currentIndex = subtitleData.findIndex(
    (s) => frame >= s.startFrame && frame < s.endFrame,
  );
  const currentSubtitle = subtitleData[currentIndex];
  const localFrame = currentSubtitle ? frame - currentSubtitle.startFrame : 0;

  const entrance = currentSubtitle
    ? spring({
        frame: localFrame,
        fps,
        config: { damping: 12, stiffness: 180, mass: 0.3 },
      })
    : 0;
  const translateY = interpolate(entrance, [0, 1], [30, 0]);
  const blurPx = interpolate(entrance, [0, 1], [10, 0]);
  const scaleIn = interpolate(entrance, [0, 1], [0.88, 1]);

  const len = currentSubtitle?.text.length ?? 0;
  const fontSize = len > 15 ? 58 : len > 8 ? 74 : 88;

  /* ---------------- GRAPHIC ANIMATION & EXIT TIMINGS ---------------- */
  const googleChipOn =
    activeIn(frame, 14, 96) ||
    activeIn(frame, 234, 272) ||
    activeIn(frame, 412, 468);
  const chipEnter = spring({
    frame: frame - 14,
    fps,
    config: { damping: 14, stiffness: 130 },
  });
  const chipExit = interpolate(
    frame,
    [90, 96, 266, 272, 462, 468],
    [1, 0, 1, 0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const trophyOn = activeIn(frame, 104, 165);
  const trophyEnter = spring({
    frame: frame - 104,
    fps,
    config: { damping: 11, stiffness: 150 },
  });
  const trophyExit = interpolate(frame, [158, 165], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const timeOn = activeIn(frame, 160, 262);
  const timeEnter = spring({
    frame: frame - 160,
    fps,
    config: { damping: 13, stiffness: 140 },
  });
  const timeExit = interpolate(frame, [255, 262], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeOn = activeIn(frame, 300, 352);
  const badgeEnter = spring({
    frame: frame - 300,
    fps,
    config: { damping: 10, stiffness: 160 },
  });
  const badgeExit = interpolate(frame, [346, 352], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const brainOn = activeIn(frame, 350, 414);
  const brainEnter = spring({
    frame: frame - 350,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const brainExit = interpolate(frame, [402, 414], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stackVisible = frame >= 493;

  return (
    <AbsoluteFill className="bg-[#05060A] overflow-hidden select-none">
      {/* 
        [ለውጥ]፡- የቪዲዮ ፋይሉን ከላይ ለማድረግ በመጀመሪያ ኮዱ ላይ አስቀድመን እንከታለን።
        ይህም በ Timeline እይታ ላይ ቪዲዮውን በመጀመሪያው ረድፍ (በላይ) እንዲቀመጥ ያደርገዋል።
      */}
      {/* ---------- CINEMATIC CAMERA CONTAINER (ቪዲዮው ከላይ እንዲሆን) ---------- */}
      <AbsoluteFill
        style={{
          transform: `scale(${camScale}) translate(${camX}px, ${camY}px)`,
        }}
        className="z-0"
      >
        <Video
          src={staticFile("IMG_2250.MP4")}
          className="absolute inset-0 w-full h-full object-cover grayscale-[10%] contrast-[105%]"
        />
      </AbsoluteFill>
      {/* 
        [ለውጥ]፡- የድምፅ (Audio) ፋይሎችን ከቪዲዮው በኋላ በማስቀመጥ በደረጃ (Layer) ወደላይ፣
        ነገር ግን በ Timeline እይታ ላይ ከቪዲዮው በታች ዝቅ ብለው እንዲሰደሩ ተደርጓል።
      */}
      {/* ---------- SFX AUDIO ENGINE (ከቪዲዮ በታች እንዲሆኑ) ---------- */}
      {/* 1. ዋና ዋና ፖፕ እና ውሽ ኤለመንቶች */}
      <Sequence
        from={14}
        durationInFrames={12}
        style={{
          translate: "-291.3px 113.7px",
        }}
      >
        <Audio src={staticFile("audio/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={104} durationInFrames={18}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={160} durationInFrames={12}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={234} durationInFrames={12}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={300} durationInFrames={18}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={412} durationInFrames={12}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.5} />
      </Sequence>
      {/* 2. Principles (Task, Context...) የፖፕ ድምፆች */}
      {PRINCIPLES.map((p) => (
        <Sequence
          key={`sfx-${p.label}`}
          from={p.revealAt}
          durationInFrames={12}
        >
          <Audio src={staticFile("audio/pop.mp3")} volume={0.4} />
        </Sequence>
      ))}
      {/* ---------- የጀርባ ብርሃን እና ግራፊክስ ዲዛይኖች ---------- */}
      <AbsoluteFill className="pointer-events-none z-10">
        <div
          className="absolute -top-1/3 -left-1/3 w-[90%] h-[90%] rounded-full blur-[140px] opacity-[0.35]"
          style={{
            background: `radial-gradient(circle, ${VIOLET} 0%, transparent 70%)`,
            transform: `translate(${Math.sin(frame / 150) * 40}px, ${Math.cos(frame / 130) * 30}px)`,
          }}
        />
        <div
          className="absolute -bottom-1/3 -right-1/3 w-[80%] h-[80%] rounded-full blur-[140px] opacity-[0.30]"
          style={{
            background: `radial-gradient(circle, ${CYAN} 0%, transparent 70%)`,
            transform: `translate(${Math.cos(frame / 140) * 35}px, ${Math.sin(frame / 160) * 35}px)`,
          }}
        />
      </AbsoluteFill>
      {/* ---------- DUST PARTICLES ENGINE ---------- */}
      <AbsoluteFill className="pointer-events-none z-10">
        {PARTICLES.map((p, i) => {
          const y = (p.y - ((frame * p.speed) % 140) + 140) % 140;
          return (
            <div
              key={i}
              className="absolute rounded-full opacity-[0.25]"
              style={{
                left: `${p.x + Math.sin(frame / 50 + i) * p.drift * 0.4}%`,
                top: `${y}%`,
                width: p.size,
                height: p.size,
                background: i % 3 === 0 ? CYAN : i % 3 === 1 ? GOLD : GREEN,
                boxShadow: `0 0 12px ${i % 3 === 0 ? CYAN : i % 3 === 1 ? GOLD : GREEN}`,
              }}
            />
          );
        })}
      </AbsoluteFill>
      {/* ---------- HOLLYWOOD VIGNETTE & FILM GRAIN ---------- */}
      <AbsoluteFill className="pointer-events-none z-20 mix-blend-multiply bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
      <AbsoluteFill
        className="pointer-events-none z-20 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* ---------- UI COMPONENT: GOOGLE BRAND CHIP ---------- */}
      {googleChipOn && (
        <div
          className="absolute top-[7%] right-[6%] z-40 flex items-center gap-3 rounded-full px-6 py-3 border border-white/20 backdrop-blur-2xl bg-gradient-to-r from-white/10 to-white/5"
          style={{
            opacity: chipExit,
            transform: `scale(${interpolate(chipEnter, [0, 1], [0.75, 1])}) translateY(${interpolate(chipEnter, [0, 1], [-20, 0])}px)`,
            boxShadow: `0 20px 40px rgba(52,228,234,0.15), inset 0 1px 1px rgba(255,255,255,0.2)`,
          }}
        >
          <Icon name="google" size={24} color={CYAN} />
          <span className="text-white font-bold text-[14px] tracking-[0.2em] uppercase font-sans">
            Google
          </span>
        </div>
      )}
      {/* ---------- UI COMPONENT: TROPHY BADGE ---------- */}
      {trophyOn && (
        <div
          className="absolute top-[9%] left-[6%] z-40 flex items-center gap-3 rounded-2xl px-6 py-4 border border-white/20 backdrop-blur-2xl bg-gradient-to-b from-yellow-500/15 to-transparent"
          style={{
            opacity: trophyExit,
            transform: `scale(${interpolate(trophyEnter, [0, 1], [0.6, 1])}) rotate(${interpolate(trophyEnter, [0, 1], [-10, 0])}deg)`,
            boxShadow: `0 30px 60px rgba(255,200,87,0.2)`,
          }}
        >
          <Icon name="trophy" size={34} color={GOLD} />
          <span className="text-[14px] font-black tracking-widest text-[#FFC857]">
            #1 RATED
          </span>
        </div>
      )}
      {/* ---------- UI COMPONENT: DOUBLE METRIC CARDS ---------- */}
      {timeOn && (
        <div
          className="absolute bottom-[28%] left-[6%] z-40 flex flex-col gap-3"
          style={{
            opacity: timeExit,
            transform: `translateX(${interpolate(timeEnter, [0, 1], [-40, 0])}px)`,
          }}
        >
          <div className="flex items-center gap-3 rounded-xl px-5 py-3 border border-white/10 backdrop-blur-xl bg-black/40 shadow-xl">
            <Icon name="clock" size={24} color={CYAN} />
            <span className="text-white text-[15px] font-semibold font-sans tracking-wide">
              saving you time
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-xl px-5 py-3 border border-white/10 backdrop-blur-xl bg-black/40 shadow-xl">
            <Icon name="doc" size={24} color={GOLD} />
            <span className="text-white text-[15px] font-semibold font-sans tracking-wide">
              the complete guide
            </span>
          </div>
        </div>
      )}
      {/* ---------- UI COMPONENT: SPEED TIMING BADGE ---------- */}
      {badgeOn && (
        <div
          className="absolute top-[14%] left-1/2 z-40 -translate-x-1/2 rounded-full px-7 py-3 border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-orange-600/20 backdrop-blur-md"
          style={{
            opacity: badgeExit,
            transform: `translateX(-50%) scale(${interpolate(badgeEnter, [0, 1], [0.7, 1])})`,
            boxShadow: `0 0 40px rgba(255,200,87,0.4)`,
          }}
        >
          <span className="text-[16px] font-extrabold tracking-widest text-[#FFC857] font-sans">
            ⏱ UNDER 20 MINUTES
          </span>
        </div>
      )}
      {/* ---------- UI COMPONENT: BRAIN GLASS OVERLAY IMMERSIVE ---------- */}
      {brainOn && (
        <div
          className="absolute inset-x-0 bottom-[24%] z-40 flex justify-center"
          style={{ opacity: brainExit }}
        >
          <div
            className="flex items-center gap-6 rounded-3xl px-10 py-7 border border-white/20 backdrop-blur-3xl bg-slate-900/40"
            style={{
              opacity: interpolate(brainEnter, [0, 1], [0, 1]),
              transform: `scale(${interpolate(brainEnter, [0, 1], [0.8, 1])}) translateY(${interpolate(brainEnter, [0, 1], [30, 0])}px)`,
              boxShadow: `0 40px 80px rgba(124,111,255,0.3), inset 0 1px 2px rgba(255,255,255,0.3)`,
            }}
          >
            <div className="p-3 rounded-2xl bg-[#7C6FFF]/20 border border-[#7C6FFF]/40 animate-pulse">
              <Icon name="brain" size={48} color={VIOLET} />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-[19px] font-extrabold tracking-wide">
                SYSTEM LOGIC
              </span>
              <span className="text-slate-300 text-[15px] font-medium max-w-[240px] leading-relaxed">
                How the AI model actually structured thinking.
              </span>
            </div>
          </div>
        </div>
      )}
      {/* ---------- SIGNATURE PRODUCTION MOMENT: PRINCIPLES STACK ---------- */}
      {stackVisible && (
        <div className="absolute right-[6%] top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
          {PRINCIPLES.map((p, i) => {
            const revealed = frame >= p.revealAt;
            const local = frame - p.revealAt;
            const e = spring({
              frame: local,
              fps,
              config: { damping: 12, stiffness: 150 },
            });
            const isCurrent = currentSubtitle?.text
              .toLowerCase()
              .includes(p.label.toLowerCase());
            const pulse = isCurrent ? 1 + Math.sin(frame / 3) * 0.04 : 1;

            return (
              <div
                key={p.label}
                className="flex items-center gap-4 rounded-2xl px-6 py-4 border backdrop-blur-3xl transition-all duration-150"
                style={{
                  background: isCurrent
                    ? `${p.color}33`
                    : "rgba(10, 11, 18, 0.5)",
                  borderColor: isCurrent ? p.color : "rgba(255,255,255,0.12)",
                  opacity: revealed ? interpolate(e, [0, 1], [0, 1]) : 0,
                  transform: `scale(${(revealed ? interpolate(e, [0, 1], [0.7, 1]) : 0.7) * pulse}) translateX(${revealed ? interpolate(e, [0, 1], [50, 0]) : 50}px)`,
                  boxShadow: isCurrent
                    ? `0 0 40px ${p.color}66`
                    : "0 10px 30px rgba(0,0,0,0.2)",
                }}
              >
                <Icon name={p.icon} size={28} color={p.color} />
                <span className="text-white text-[16px] font-black tracking-widest font-sans uppercase">
                  {p.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {/* ---------- HORMOZI-STYLE KINETIC SUBTITLES WITH WORD HIGHLIGHTING ---------- */}
      {currentSubtitle && (
        <div className="absolute bottom-[14%] w-full flex justify-center px-10 z-50 pointer-events-none">
          <div
            style={{
              transform: `translateY(${translateY}px) scale(${scaleIn})`,
              filter: `blur(${blurPx}px)`,
              opacity: interpolate(localFrame, [0, 3], [0, 1], {
                extrapolateLeft: "clamp",
              }),
            }}
            className="flex flex-wrap justify-center content-center max-w-[90%] gap-x-3"
          >
            {currentSubtitle.text.split(" ").map((word, idx) => {
              const targetColor = wordColor(word);
              return (
                <span
                  key={idx}
                  style={{
                    color: targetColor,
                    fontSize: `${fontSize}px`,
                    textShadow:
                      targetColor !== INK
                        ? `0 0 35px ${targetColor}A0, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 0 12px 30px rgba(0,0,0,0.95)`
                        : `-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 0 12px 30px rgba(0,0,0,0.95)`,
                  }}
                  className="font-['Arial_Black',Impact,sans-serif] font-black uppercase text-center leading-[1.05] tracking-[-1px]"
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

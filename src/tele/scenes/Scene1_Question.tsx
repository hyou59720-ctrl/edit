import React, { useMemo } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
  Easing,
} from "remotion";
import PremiumTelebirrBackground from "./background";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface WordCue {
  text: string;
  frame: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  phase: number;
  drift: number;
}

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

const WORDS: WordCue[] = [
  { text: "በ2026", frame: 4 },
  { text: "አሁንም", frame: 43 },
  { text: "በጥሬ", frame: 58 },
  { text: "ገንዘብ", frame: 69 },
  { text: "እየተጠቀሙ", frame: 80 },
  { text: "ነው?", frame: 89 },
];

const TELEBIRR_GREEN = "#00B140";

// ---------------------------------------------------------------------------
// PARTICLES (deterministic, index-seeded)
// ---------------------------------------------------------------------------

const useParticles = (count: number): Particle[] => {
  return useMemo(() => {
    const arr: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const seed = i * 12.9898;
      const pseudo = (Math.sin(seed) * 43758.5453) % 1;
      const pseudo2 = (Math.cos(seed * 1.7) * 12543.123) % 1;
      arr.push({
        x: Math.abs(pseudo) * 100,
        y: Math.abs(pseudo2) * 100,
        size: 2 + Math.abs(Math.sin(i * 3.1)) * 4,
        speed: 0.15 + Math.abs(Math.sin(i * 7.3)) * 0.35,
        phase: i * 37.13,
        drift: Math.abs(Math.cos(i * 2.2)) * 30 + 10,
      });
    }
    return arr;
  }, [count]);
};

const FloatingParticles: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const particles = useParticles(26);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {particles.map((p, i) => {
        const yOffset = Math.sin(frame * p.speed * 0.05 + p.phase) * p.drift;
        const xOffset =
          Math.cos(frame * p.speed * 0.03 + p.phase) * (p.drift * 0.4);
        const twinkle = interpolate(
          Math.sin(frame * 0.08 + p.phase),
          [-1, 1],
          [0.15, 0.85],
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: TELEBIRR_GREEN,
              filter: "blur(0.5px)",
              boxShadow: `0 0 ${p.size * 3}px ${TELEBIRR_GREEN}`,
              transform: `translate(${xOffset}px, ${yOffset}px)`,
              opacity: twinkle,
            }}
          />
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// WORD REVEAL (cinematic typography)
// ---------------------------------------------------------------------------

const WordReveal: React.FC<{ cue: WordCue }> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - cue.frame;

  if (local < -1) return null;

  const entrance = spring({
    frame: local,
    fps,
    config: { damping: 18, stiffness: 130, mass: 0.9 },
  });

  const opacity = interpolate(local, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const blurAmount = interpolate(local, [0, 14], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const scale = interpolate(entrance, [0, 1], [0.72, 1]);

  const glow = interpolate(local, [0, 12, 40], [0, 26, 14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sweepPos = interpolate(local, [0, 26], [-60, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        filter: `blur(${blurAmount}px)`,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        fontFamily: '"Noto Sans Ethiopic", "Nyala", sans-serif',
        fontWeight: 800,
        fontSize: 92,
        letterSpacing: "-0.01em",
        lineHeight: 1.15,
        color: "#F5FFF8",
        textShadow: `0 0 ${glow}px rgba(0,177,64,0.85), 0 0 ${glow * 2}px rgba(0,177,64,0.35)`,
        backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) ${sweepPos}%, rgba(255,255,255,0) ${
          sweepPos + 25
        }%)`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        backgroundSize: "200% 100%",
        margin: "0 14px",
      }}
    >
      {cue.text}
    </span>
  );
};

// ---------------------------------------------------------------------------
// LEGACY / CASH VISUAL STORYTELLING (frames 45-95)
// ---------------------------------------------------------------------------

const LegacyMoneyVisuals: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const motionFrame = Math.min(frame, 95);

  const appear = spring({
    frame: motionFrame - 45,
    fps,
    config: { damping: 20, stiffness: 60, mass: 1.1 },
  });

  const groupOpacity = interpolate(
    motionFrame,
    [45, 60, 88, 100],
    [0, 0.9, 0.9, 0.35],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const walletRotation = interpolate(motionFrame, [45, 95], [-8, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  const walletFloat = Math.sin(motionFrame * 0.045) * 14;

  const coinRotation = interpolate(motionFrame, [45, 95], [0, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const coinFloat = Math.cos(motionFrame * 0.05) * 18;

  const cashFloat1 = Math.sin(motionFrame * 0.035 + 1.2) * 22;
  const cashFloat2 = Math.cos(motionFrame * 0.03 + 2.4) * 26;

  const cashOpacityDissolve = interpolate(motionFrame, [70, 95], [0.9, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const desaturate = interpolate(motionFrame, [45, 95], [20, 65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: groupOpacity,
        transform: `scale(${interpolate(appear, [0, 1], [0.9, 1])})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "38%",
          width: 340,
          height: 340,
          transform: `translate(-50%, -50%) translateY(${walletFloat}px) rotate(${walletRotation}deg)`,
          filter: `grayscale(${desaturate}%) drop-shadow(0 30px 60px rgba(0,0,0,0.55))`,
        }}
      >
        <Img
          src={staticFile("/icon/cash-wallet.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          durationInFrames={96}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: "20%",
          top: "62%",
          width: 190,
          height: 190,
          opacity: cashOpacityDissolve,
          transform: `translateY(${cashFloat1}px) rotate(-14deg)`,
          filter: `grayscale(${desaturate}%) drop-shadow(0 20px 40px rgba(0,0,0,0.5))`,
        }}
      >
        <Img
          src={staticFile("/icon/cash-birr.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: "16%",
          top: "68%",
          width: 160,
          height: 160,
          opacity: cashOpacityDissolve,
          transform: `translateY(${cashFloat2}px) rotate(11deg)`,
          filter: `grayscale(${desaturate}%) drop-shadow(0 20px 40px rgba(0,0,0,0.5))`,
        }}
      >
        <Img
          src={staticFile("/icon/coins.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: "68%",
          top: "30%",
          width: 130,
          height: 130,
          transform: `translateY(${coinFloat}px) rotate(${coinRotation}deg)`,
          filter: `grayscale(${desaturate}%) drop-shadow(0 16px 30px rgba(0,0,0,0.5))`,
        }}
      >
        <Img
          src={staticFile("/icon/old-payment.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: "28%",
          top: "22%",
          width: 90,
          height: 90,
          transform: `translateY(${-coinFloat}px) rotate(${-coinRotation * 0.7}deg)`,
          filter: `grayscale(${desaturate}%) drop-shadow(0 14px 26px rgba(0,0,0,0.5))`,
          opacity: 0.8,
        }}
      >
        <Img
          src={staticFile("/icon/question-circle.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// MAIN SCENE
// ---------------------------------------------------------------------------

const Scene1_Question: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const darknessOpacity = interpolate(frame, [0, 20], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const particlesOpacity = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const camDriftX = Math.sin(frame * 0.008) * 10;
  const camDriftY = Math.cos(frame * 0.006) * 8;

  const finalZoom = interpolate(frame, [95, 115], [1, 1.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const finalGlow = interpolate(frame, [95, 115], [0.35, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textGroupScale = interpolate(frame, [95, 115], [1, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <PremiumTelebirrBackground>
      {/* Extra ambient glow that intensifies toward the end */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${TELEBIRR_GREEN}55 0%, #003D1F33 40%, transparent 75%)`,
          opacity: finalGlow * 0.5,
          transform: `translate(${camDriftX}px, ${camDriftY}px) scale(${finalZoom})`,
        }}
      />

      <FloatingParticles opacity={particlesOpacity} />

      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${camDriftX}px, ${camDriftY}px) scale(${finalZoom})`,
        }}
      >
        <LegacyMoneyVisuals />

        <div className="absolute inset-0 flex items-center justify-center px-24">
          <div
            className="flex flex-wrap items-center justify-center text-center"
            style={{
              transform: `scale(${textGroupScale})`,
              maxWidth: width * 0.85,
            }}
          >
            {WORDS.map((cue, i) => (
              <WordReveal key={cue.text + i} cue={cue} />
            ))}
          </div>
        </div>
      </div>

      {/* Opening darkness veil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "#000", opacity: darknessOpacity }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </PremiumTelebirrBackground>
  );
};

export default Scene1_Question;

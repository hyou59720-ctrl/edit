import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import PremiumTelebirrBackground from './background';

// ---------------------------------------------------------------------------
// COLORS — exact match with Scene1 / Scene2 / Scene3 / Scene4
// ---------------------------------------------------------------------------

const GREEN = '#1B5E20';
const GREEN_LIGHT = '#6CBE45';
const GOLD = '#F9A825';
const GOLD_LIGHT = '#FFD873';
const WHITE = '#F5FFF8';

// ---------------------------------------------------------------------------
// SENTENCE REVEAL — cinematic typography language
// ---------------------------------------------------------------------------

const SentenceReveal: React.FC<{
  text: string;
  startFrame: number;
  holdUntil: number;
  fontSize: number;
  top: string;
  color?: string;
}> = ({ text, startFrame, holdUntil, fontSize, top, color = WHITE }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  if (local < -1) return null;

  const entrance = spring({
    frame: local,
    fps,
    config: { damping: 18, stiffness: 130, mass: 0.9 },
  });

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 12, holdUntil, holdUntil + 15],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const blurAmount = interpolate(local, [0, 16], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const scale = interpolate(entrance, [0, 1], [0.8, 1]);

  const glow = interpolate(local, [0, 15, 50], [0, 22, 12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sweepPos = interpolate(local, [0, 35], [-60, 160], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        display: 'flex',
        justifyContent: 'center',
        opacity,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          filter: blurAmount > 0.5 ? `blur(${blurAmount}px)` : 'none',
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          fontFamily: '"Noto Sans Ethiopic", "Nyala", sans-serif',
          fontWeight: 800,
          fontSize,
          letterSpacing: '-0.01em',
          color,
          textShadow: `0 0 ${glow}px rgba(249,168,37,0.7)`,
          backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) ${sweepPos}%, rgba(255,255,255,0) ${
            sweepPos + 25
          }%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          backgroundSize: '200% 100%',
          padding: '0 40px',
          textAlign: 'center',
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// SOFT LIGHT RAYS
// ---------------------------------------------------------------------------

const LightRays: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame * 0.02), [-1, 1], [0.85, 1]);

  return (
    <div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      style={{
        width: 1000,
        height: 1000,
        transform: `translate(-50%, -50%) scale(${pulse})`,
        opacity,
        background: `radial-gradient(circle, rgba(249,168,37,0.28) 0%, rgba(108,190,69,0.14) 40%, transparent 70%)`,
        borderRadius: '50%',
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// LENS FLARE
// ---------------------------------------------------------------------------

const LensFlare: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.02) * 14;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: '58%',
        top: '32%',
        transform: `translate(${drift}px, ${-drift * 0.6}px)`,
        opacity,
      }}
    >
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(249,168,37,0.35) 45%, transparent 75%)',
        }}
      />
      {[0.4, 0.2].map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: -150 * (i + 1),
            top: 22 * (i + 1),
            width: 90 * s,
            height: 90 * s,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(249,168,37,${0.22 * s}) 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// FLOATING GLASS CIRCLES
// ---------------------------------------------------------------------------

const FloatingCircles: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();

  const circles = React.useMemo(
    () => [
      { x: '14%', y: '22%', size: 70, color: GOLD_LIGHT, seed: 1.2 },
      { x: '82%', y: '18%', size: 50, color: GREEN_LIGHT, seed: 2.6 },
      { x: '18%', y: '74%', size: 60, color: GREEN_LIGHT, seed: 3.4 },
      { x: '80%', y: '70%', size: 44, color: GOLD_LIGHT, seed: 4.1 },
      { x: '50%', y: '10%', size: 36, color: GOLD, seed: 5.3 },
    ],
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {circles.map((c, i) => {
        const floatY = Math.sin(frame * 0.03 + c.seed) * 18;
        const floatX = Math.cos(frame * 0.02 + c.seed) * 12;
        const pulse = interpolate(Math.sin(frame * 0.04 + c.seed), [-1, 1], [0.5, 0.9]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: c.x,
              top: c.y,
              width: c.size,
              height: c.size,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${c.color}55`,
              boxShadow: `0 0 ${c.size * 0.4}px ${c.color}33`,
              transform: `translate(${floatX}px, ${floatY}px)`,
              opacity: pulse,
            }}
          />
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// PREMIUM PARTICLES
// ---------------------------------------------------------------------------

const PremiumParticles: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();

  const particles = React.useMemo(() => {
    const arr: { x: number; y: number; size: number; speed: number; phase: number; drift: number; color: string }[] = [];
    for (let i = 0; i < 12; i++) {
      const seed = i * 12.9898;
      const pseudo = (Math.sin(seed) * 43758.5453) % 1;
      const pseudo2 = (Math.cos(seed * 1.7) * 12543.123) % 1;
      arr.push({
        x: Math.abs(pseudo) * 100,
        y: Math.abs(pseudo2) * 100,
        size: 2 + Math.abs(Math.sin(i * 3.1)) * 4,
        speed: 0.12 + Math.abs(Math.sin(i * 7.3)) * 0.3,
        phase: i * 37.13,
        drift: Math.abs(Math.cos(i * 2.2)) * 26 + 8,
        color: i % 2 === 0 ? GREEN_LIGHT : GOLD_LIGHT,
      });
    }
    return arr;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {particles.map((p, i) => {
        const yOffset = Math.sin(frame * p.speed * 0.04 + p.phase) * p.drift;
        const xOffset = Math.cos(frame * p.speed * 0.02 + p.phase) * (p.drift * 0.4);
        const twinkle = interpolate(Math.sin(frame * 0.06 + p.phase), [-1, 1], [0.15, 0.85]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
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
// PHONE RECEDE — Extended for smoother exit animation
// ---------------------------------------------------------------------------
const RECEDE_START = 0;
const RECEDE_END = 45; // 🎯 ስልኩ ጠፍቶ የሚጨርስበትን ጊዜ ወደ 45 frame አሳድገነዋል

const PhoneRecede: React.FC = () => {
  const frame = useCurrentFrame();

  const floatY = Math.sin(frame / 32) * 14;
  const rotateY = Math.sin(frame / 70) * 6 + interpolate(frame, [RECEDE_START, RECEDE_END], [0, 18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rotateX = Math.cos(frame / 85) * 3;

  const scale = interpolate(frame, [RECEDE_START, RECEDE_END], [1, 0.55], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  const opacity = interpolate(frame, [RECEDE_START, RECEDE_END - 10, RECEDE_END], [1, 0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        width: 320,
        height: 560,
        transformStyle: 'preserve-3d',
        transform: `translateY(${floatY}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`,
        opacity,
      }}
    >
      <div
        className="absolute inset-0 rounded-[44px]"
        style={{
          background: 'linear-gradient(150deg, #5a5a5f, #1a1a1c 45%, #050505)',
          padding: 9,
          boxShadow: '0 36px 80px -18px rgba(0,0,0,0.7), inset 0 0 2px rgba(255,255,255,0.4)',
        }}
      >
        <div className="relative w-full h-full rounded-[36px] overflow-hidden" style={{ background: '#FAFDF8' }}>
          <div className="absolute inset-0 flex flex-col items-center px-6 pt-8">
            <div className="w-full flex items-center justify-between mb-4">
              <Img src={staticFile('icon/telebirr-logo.png')} className="h-7 object-contain" />
              <span
                className="font-black"
                style={{ color: '#0F5FCE', fontSize: 15, fontFamily: 'Noto Sans Ethiopic, sans-serif' }}
              >
                ቴሌብር
              </span>
            </div>
          </div>
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 40%, rgba(46,125,50,0.15) 0%, transparent 70%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// LOGO HERO — Extended timing for 150 frames total
// ---------------------------------------------------------------------------
const LOGO_START = 22; // ስልኩ ጥፋት ሲል ሎጎው መግባት ይጀምራል
const LOGO_SETTLE = 55;

const LogoHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - LOGO_START,
    fps,
    config: { damping: 16, stiffness: 70, mass: 1 },
  });

  const opacity = interpolate(frame, [LOGO_START, LOGO_START + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(entrance, [0, 1], [0.5, 1]);
  const settledFloat = frame > LOGO_SETTLE ? Math.sin((frame - LOGO_SETTLE) * 0.04) * 8 : 0;

  const blurAmount = interpolate(frame, [LOGO_START, LOGO_START + 22], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const glowIntensity = interpolate(frame, [LOGO_START, LOGO_SETTLE, 140], [10, 36, 56], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const finalGrow = interpolate(frame, [110, 140], [1, 1.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const sheenT = interpolate(frame, [LOGO_START + 10, LOGO_START + 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sheenPos = -30 + sheenT * 160;
  const sheenOpacity = interpolate(frame, [LOGO_START + 10, LOGO_START + 22, LOGO_START + 45], [0, 0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className="absolute left-1/2 top-[38%] flex items-center justify-center"
      style={{
        transform: `translate(-50%, -50%) translateY(${settledFloat}px) scale(${scale * finalGrow})`,
        opacity,
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: 380,
          height: 380,
          background: `radial-gradient(circle, rgba(249,168,37,${0.12 + glowIntensity / 300}) 0%, rgba(108,190,69,0.1) 45%, transparent 72%)`,
        }}
      />

      <div style={{ filter: blurAmount > 0.5 ? `blur(${blurAmount}px)` : 'none' }}>
        <Img
          src={staticFile('icon/telebirr-logo.png')}
          style={{
            width: 220,
            height: 220,
            objectFit: 'contain',
            filter: `drop-shadow(0 0 ${glowIntensity}px rgba(249,168,37,0.65))`,
          }}
        />
      </div>

      <div
        className="absolute pointer-events-none"
        style={{
          width: 220,
          height: 220,
          borderRadius: 20,
          background: `linear-gradient(115deg, transparent ${sheenPos - 15}%, rgba(255,255,255,0.35) ${sheenPos}%, transparent ${sheenPos + 15}%)`,
          opacity: sheenOpacity,
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// MAIN SCENE — 🎯 Expanded to 150 frames with extra smooth fade-outs
// ---------------------------------------------------------------------------

export const Scene5_Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const camZoom = interpolate(frame, [0, 150], [1.05, 0.94], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });
  const cameraDrift = Math.sin(frame / 120) * 8;

  const ambientGlow = interpolate(frame, [0, 40, 90, 150], [0.32, 0.5, 0.7, 0.9], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const raysOpacity = interpolate(frame, [10, 40, 150], [0, 0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const flareOpacity = interpolate(frame, [20, 50, 120], [0, 0.9, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const particlesOpacity = interpolate(frame, [0, 30, 150], [0.3, 0.7, 0.9], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const circlesOpacity = interpolate(frame, [15, 45], [0, 0.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 🎯 መታጠብያው (Wash out) ረጋ ብሎ እንዲጀምርና ለረጅም ጊዜ እንዲቆይ ተደርጓል
  const finalWashOpacity = interpolate(frame, [100, 130], [0, 0.55], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 🎯 ወደ አረንጓዴ እና ጥቁር መለወጫው (Fade) ከመጨረሻው 150 frame በፊት ባለው 35 frame ውስጥ በጣም ረጋ ብሎ እንዲገባ ተደርጓል
  const fadeGreen = interpolate(frame, [115, 140], [0, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeBlack = interpolate(frame, [138, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <PremiumTelebirrBackground>
      <AbsoluteFill
        className="flex items-center justify-center"
        style={{
          transform: `scale(${camZoom}) translateX(${cameraDrift}px)`,
          perspective: 1600,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 40%, rgba(108,190,69,0.35) 0%, rgba(6,23,10,0.2) 45%, transparent 75%)`,
            opacity: ambientGlow,
          }}
        />

        <LightRays opacity={raysOpacity} />
        <FloatingCircles opacity={circlesOpacity} />
        <PremiumParticles opacity={particlesOpacity} />

        <PhoneRecede />
        <LogoHero />
        <LensFlare opacity={flareOpacity} />

        {/* 🎯 ጽሑፎቹ ረዘም ላለ ጊዜ እንዲቆዩ (Hold) ተደርገዋል */}
        <SentenceReveal text="ቴሌብር" startFrame={55} holdUntil={105} fontSize={90} top="62%" color={WHITE} />
        <SentenceReveal
          text="ሕይወትን የሚያቀል ቀላል መንገድ።"
          startFrame={80}
          holdUntil={135}
          fontSize={44}
          top="72%"
          color={GOLD_LIGHT}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 45%, rgba(249,168,37,0.4) 0%, rgba(108,190,69,0.35) 45%, transparent 80%)`,
            opacity: finalWashOpacity,
          }}
        />
      </AbsoluteFill>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 45%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* 🎯 የፈዘዙት (Fade) የጀርባ ሽፋንዎች */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: GREEN, opacity: fadeGreen }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: '#000', opacity: fadeBlack }}
      />
    </PremiumTelebirrBackground>
  );
};

export default Scene5_Outro;

import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

// -----------------------------------------------------------------------------
// CONSTANTS & CONFIGURATION
// -----------------------------------------------------------------------------

const COLORS = {
  bgDeep: '#050508',
  bgMid: '#0a0a12',
  accentCyan: '#06b6d4',
  accentPurple: '#8b5cf6',
  accentPink: '#ec4899',
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassBg: 'rgba(255, 255, 255, 0.03)',
};

const TIMING = {
  introDuration: 90,
  contentDelay: 30,
  floatSpeed: 0.02,
  orbSpeed: 0.005,
};

// -----------------------------------------------------------------------------
// UTILITY: Generate Random Particles
// -----------------------------------------------------------------------------

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
}

const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.5 + 0.2,
    opacity: Math.random() * 0.6 + 0.2,
    delay: Math.random() * 200,
  }));
};

// -----------------------------------------------------------------------------
// COMPONENT: Floating Particle
// -----------------------------------------------------------------------------

const FloatingParticle: React.FC<{ particle: Particle; frame: number }> = ({
  particle,
  frame,
}) => {
  const yOffset = interpolate(
    frame + particle.delay,
    [0, 300],
    [0, -30],
    { extrapolateRight: 'wrap' }
  );

  const opacity = interpolate(
    frame,
    [particle.delay, particle.delay + 30, particle.delay + 200, particle.delay + 230],
    [0, particle.opacity, particle.opacity, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      className="absolute rounded-full"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
        backgroundColor: COLORS.accentCyan,
        opacity,
        transform: `translateY(${yOffset}px)`,
        boxShadow: `0 0 ${particle.size * 4}px ${COLORS.accentCyan}`,
        filter: 'blur(1px)',
      }}
    />
  );
};

// -----------------------------------------------------------------------------
// COMPONENT: Animated Gradient Mesh Background
// -----------------------------------------------------------------------------

const GradientMesh: React.FC<{ frame: number }> = ({ frame }) => {
  // Slow, continuous movement of the gradient center
  const angle = frame * 0.2;
  const x1 = 50 + Math.sin(angle * 0.01) * 20;
  const y1 = 50 + Math.cos(angle * 0.015) * 20;
  const x2 = 50 + Math.cos(angle * 0.012) * 30;
  const y2 = 50 + Math.sin(angle * 0.008) * 30;

  return (
    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(circle at ${x1}% ${y1}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at ${x2}% ${y2}%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.05) 0%, transparent 60%),
          linear-gradient(180deg, ${COLORS.bgDeep} 0%, ${COLORS.bgMid} 100%)
        `,
      }}
    />
  );
};

// -----------------------------------------------------------------------------
// COMPONENT: Aurora Light Streaks
// -----------------------------------------------------------------------------

const AuroraStreaks: React.FC<{ frame: number }> = ({ frame }) => {
  const streaks = [
    { color: COLORS.accentPurple, delay: 0, width: 600, height: 2, top: 30, angle: -15 },
    { color: COLORS.accentCyan, delay: 60, width: 800, height: 1, top: 60, angle: 10 },
    { color: COLORS.accentPink, delay: 120, width: 500, height: 3, top: 45, angle: -5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {streaks.map((streak, i) => {
        const progress = interpolate(
          frame - streak.delay,
          [0, 200],
          [-100, 200],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const opacity = interpolate(
          frame - streak.delay,
          [0, 40, 160, 200],
          [0, 0.3, 0.3, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${progress}%`,
              top: `${streak.top}%`,
              width: streak.width,
              height: streak.height,
              background: `linear-gradient(90deg, transparent, ${streak.color}, transparent)`,
              opacity,
              transform: `rotate(${streak.angle}deg)`,
              filter: 'blur(4px)',
            }}
          />
        );
      })}
    </div>
  );
};

// -----------------------------------------------------------------------------
// COMPONENT: Moving Background Orbs
// -----------------------------------------------------------------------------

const BackgroundOrbs: React.FC<{ frame: number }> = ({ frame }) => {
  const orbs = [
    { size: 400, color: COLORS.accentPurple, xBase: 20, yBase: 20, speed: 0.3 },
    { size: 300, color: COLORS.accentCyan, xBase: 80, yBase: 70, speed: 0.4 },
    { size: 250, color: COLORS.accentPink, xBase: 50, yBase: 80, speed: 0.2 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => {
        const x = orb.xBase + Math.sin(frame * TIMING.orbSpeed * orb.speed) * 10;
        const y = orb.yBase + Math.cos(frame * TIMING.orbSpeed * orb.speed) * 10;

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, ${orb.color}20 0%, transparent 70%)`,
              transform: 'translate(-50%, -50%)',
              filter: 'blur(60px)',
            }}
          />
        );
      })}
    </div>
  );
};

// -----------------------------------------------------------------------------
// COMPONENT: Glass Card
// -----------------------------------------------------------------------------

const GlassCard: React.FC<{
  children: React.ReactNode;
  frame: number;
  delay: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, frame, delay, className = '', style = {} }) => {
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.8 },
    from: 0.8,
    to: 1,
  });

  const opacity = interpolate(
    frame - delay,
    [0, 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const floatY = Math.sin(frame * TIMING.floatSpeed + delay) * 10;

  return (
    <div
      className={`relative ${className}`}
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${floatY}px)`,
        background: COLORS.glassBg,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${COLORS.glassBorder}`,
        borderRadius: '24px',
        boxShadow: `
          0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.05)
        `,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// -----------------------------------------------------------------------------
// COMPONENT: Main Hero Content
// -----------------------------------------------------------------------------

const HeroContent: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps, durationInFrames } = useVideoConfig();

  // Title Animation
  const titleY = spring({
    frame: frame - TIMING.contentDelay,
    fps,
    config: { damping: 12, stiffness: 80 },
    from: 60,
    to: 0,
  });

  const titleOpacity = interpolate(
    frame - TIMING.contentDelay,
    [0, 40],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Subtitle Animation
  const subtitleY = spring({
    frame: frame - TIMING.contentDelay - 15,
    fps,
    config: { damping: 12, stiffness: 80 },
    from: 40,
    to: 0,
  });

  const subtitleOpacity = interpolate(
    frame - TIMING.contentDelay - 15,
    [0, 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // CTA Button Animation
  const ctaScale = spring({
    frame: frame - TIMING.contentDelay - 40,
    fps,
    config: { damping: 10, stiffness: 120 },
    from: 0.5,
    to: 1,
  });

  const ctaOpacity = interpolate(
    frame - TIMING.contentDelay - 40,
    [0, 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Continuous subtle camera movement for text
  const cameraX = Math.sin(frame * 0.005) * 5;
  const cameraY = Math.cos(frame * 0.003) * 3;

  return (
    <div
      className="flex flex-col items-center justify-center text-center z-10 px-8"
      style={{
        transform: `translate(${cameraX}px, ${cameraY}px)`,
      }}
    >
      {/* Badge */}
      <div
        className="mb-8 px-4 py-1.5 rounded-full text-sm font-medium tracking-wider uppercase"
        style={{
          opacity: titleOpacity,
          background: 'rgba(6, 182, 212, 0.1)',
          border: `1px solid ${COLORS.accentCyan}30`,
          color: COLORS.accentCyan,
          letterSpacing: '0.2em',
        }}
      >
        Introducing Vision
      </div>

      {/* Main Title */}
      <h1
        className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6"
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          color: COLORS.textPrimary,
          textShadow: '0 0 80px rgba(255,255,255,0.1)',
          lineHeight: 1.1,
        }}
      >
        Beyond
        <br />
        <span style={{ color: COLORS.accentCyan }}>Reality</span>
      </h1>

      {/* Subtitle */}
      <p
        className="text-xl md:text-2xl max-w-2xl mb-12 leading-relaxed"
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          color: COLORS.textSecondary,
        }}
      >
        Experience the next generation of immersive technology.
        Designed for creators, built for the future.
      </p>

      {/* CTA Button */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
        }}
      >
        <button
          className="group relative px-10 py-4 rounded-full text-lg font-semibold overflow-hidden transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
            color: COLORS.textPrimary,
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.3)',
          }}
        >
          <span className="relative z-10">Explore Now</span>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            }}
          />
        </button>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// COMPONENT: Feature Cards
// -----------------------------------------------------------------------------

const FeatureCards: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();

  const cards = [
    {
      title: 'Neural Engine',
      desc: 'AI-powered processing at 50 trillion ops/sec.',
      delay: 60,
      color: COLORS.accentCyan,
    },
    {
      title: 'Quantum Display',
      desc: 'Ultra-retina with infinite contrast ratio.',
      delay: 90,
      color: COLORS.accentPurple,
    },
    {
      title: 'Spatial Audio',
      desc: 'Immersive 360° sound field mapping.',
      delay: 120,
      color: COLORS.accentPink,
    },
  ];

  return (
    <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-6 px-8 z-10">
      {cards.map((card, i) => {
        const xOffset = spring({
          frame: frame - card.delay,
          fps,
          config: { damping: 14, stiffness: 90 },
          from: (i - 1) * 100,
          to: 0,
        });

        return (
          <GlassCard
            key={i}
            frame={frame}
            delay={card.delay}
            className="w-72 p-6"
            style={{
              transform: `translateX(${xOffset}px)`,
            }}
          >
            <div
              className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center"
              style={{
                background: `${card.color}15`,
                border: `1px solid ${card.color}30`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: card.color,
                  boxShadow: `0 0 10px ${card.color}`,
                }}
              />
            </div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: COLORS.textPrimary }}
            >
              {card.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.textSecondary }}>
              {card.desc}
            </p>
          </GlassCard>
        );
      })}
    </div>
  );
};

// -----------------------------------------------------------------------------
// MAIN COMPOSITION: AppleCinematicHero
// -----------------------------------------------------------------------------

export const AppleCinematicHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Global camera movement (never static)
  const cameraZoom = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.05],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cameraRotate = Math.sin(frame * 0.002) * 0.5;

  const particles = useMemo(() => generateParticles(50), []);

  return (
    <AbsoluteFill
      className="flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: COLORS.bgDeep,
        transform: `scale(${cameraZoom}) rotate(${cameraRotate}deg)`,
        transformOrigin: 'center center',
      }}
    >
      {/* Background Layers */}
      <GradientMesh frame={frame} />
      <BackgroundOrbs frame={frame} />
      <AuroraStreaks frame={frame} />

      {/* Particle System */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <FloatingParticle key={p.id} particle={p} frame={frame} />
        ))}
      </div>

      {/* Main Content */}
      <HeroContent frame={frame} />

      {/* Feature Cards at Bottom */}
      <FeatureCards frame={frame} />

      {/* Vignette Overlay for Cinematic Feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, transparent 50%, rgba(5, 5, 8, 0.6) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

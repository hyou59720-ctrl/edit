import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Word = {
  text: string;
  start: number;
  end: number;
  size: number;
  weight: number;
  hero?: boolean;
};

const WORDS: Word[] = [
  { text: 'ችግሩ', start: 0, end: 12, size: 100, weight: 900 },
  { text: 'editing-አችሁ', start: 12, end: 28, size: 84, weight: 800 },
  { text: 'አይደለም።', start: 28, end: 40, size: 100, weight: 900 },
  { text: 'የመጀመሪያው', start: 40, end: 55, size: 72, weight: 700 },
  { text: 'ሶስት second', start: 55, end: 72, size: 150, weight: 900, hero: true },
  { text: 'ነው።', start: 72, end: 85, size: 96, weight: 800 },
];

const Sequence1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Global camera shake burst on the very first hit ("ችግሩ")
  const shakeEnvelope = interpolate(frame, [0, 4, 12], [1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shakeX = Math.sin(frame * 3.1) * 10 * shakeEnvelope;
  const shakeY = Math.cos(frame * 4.3) * 8 * shakeEnvelope;

  // Light burst flash on frame 0
  const flash = interpolate(frame, [0, 3, 10], [1, 0.4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Energy shift right when "አይደለም።" lands (frame 28)
  const energyShift = spring({
    frame: frame - 28,
    fps,
    config: { damping: 200, stiffness: 120 },
  });
  const bgHueShift = interpolate(energyShift, [0, 1], [220, 265]);

  // Dramatic pause before hero reveal (40–55 slight hold + build)
  const buildUp = interpolate(frame, [40, 55], [0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Hero push-in + pulse for "ሶስት second" (55–72)
  const heroLocal = frame - 55;
  const heroSpring = spring({
    frame: heroLocal,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.6 },
  });
  const heroPulse = 1 + Math.sin(frame * 0.35) * 0.02 * interpolate(heroLocal, [0, 17], [1, 0.4], { extrapolateRight: 'clamp' });
  const heroPushIn = interpolate(heroLocal, [0, 17], [1, 1.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Whip-pan + directional blur transition OUT into Sequence 2 (last ~10 frames)
  const t = interpolate(frame, [75, 85], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const transBlur = interpolate(t, [0, 1], [0, 45]);
  const transScale = interpolate(t, [0, 1], [1, 1.7]);
  const transX = interpolate(t, [0, 1], [0, -520]);
  const transOpacity = interpolate(t, [0.7, 1], [1, 0], { extrapolateLeft: 'clamp' });

  // Floating ambient shapes (parallax)
  const float1 = Math.sin(frame * 0.05) * 30;
  const float2 = Math.cos(frame * 0.04) * 40;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#05050a',
        overflow: 'hidden',
        transform: `translate(${shakeX + transX}px, ${shakeY}px) scale(${transScale})`,
        filter: `blur(${transBlur}px)`,
        opacity: transOpacity,
      }}
    >
      {/* Ambient gradient base */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 30% 20%, hsla(${bgHueShift}, 90%, 55%, 0.35), transparent 60%),
                       radial-gradient(circle at 75% 80%, rgba(147, 51, 234, 0.30), transparent 55%),
                       linear-gradient(180deg, #05050a 0%, #0a0a14 100%)`,
        }}
      />

      {/* Light rays */}
      <AbsoluteFill
        style={{
          background: 'conic-gradient(from 210deg at 50% -10%, transparent 0deg, rgba(59,130,246,0.18) 15deg, transparent 40deg)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Floating glow shapes for depth */}
      <div
        className="absolute rounded-full"
        style={{
          width: 420,
          height: 420,
          top: 200 + float1,
          left: -120,
          background: 'rgba(59,130,246,0.25)',
          filter: 'blur(90px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 360,
          height: 360,
          bottom: 260 + float2,
          right: -100,
          background: 'rgba(168,85,247,0.22)',
          filter: 'blur(90px)',
        }}
      />

      {/* Subtle noise / grain */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
          opacity: 0.5,
        }}
      />

      {/* Flash burst on impact */}
      <AbsoluteFill
        style={{
          backgroundColor: '#ffffff',
          opacity: flash * 0.5,
        }}
      />

      {/* Kinetic typography */}
      <AbsoluteFill className="flex items-center justify-center px-10">
        {WORDS.map((w) => {
          const local = frame - w.start;
          const dur = w.end - w.start;
          if (frame < w.start || frame >= w.end) return null;

          const entrance = spring({
            frame: local,
            fps,
            config: { damping: 14, stiffness: 200, mass: 0.5 },
          });

          const wordBlur = interpolate(local, [0, dur * 0.5], [18, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const slideBlurX = w.text.includes('editing')
            ? interpolate(local, [0, dur], [-60, 0], { extrapolateRight: 'clamp' })
            : 0;

          const isHero = !!w.hero;
          const scale = isHero
            ? heroSpring * heroPulse * heroPushIn * buildUp
            : entrance;

          return (
            <div
              key={w.text}
              className="absolute font-black text-center tracking-tight"
              style={{
                fontSize: w.size,
                fontWeight: w.weight,
                color: isHero ? '#e6f0ff' : '#ffffff',
                transform: `translateX(${slideBlurX}px) scale(${scale})`,
                filter: `blur(${wordBlur}px)`,
                textShadow: isHero
                  ? '0 0 40px rgba(96,165,250,0.9), 0 0 90px rgba(168,85,247,0.6)'
                  : '0 0 20px rgba(96,165,250,0.5)',
                opacity: interpolate(local, [0, 3], [0, 1], { extrapolateRight: 'clamp' }),
              }}
            >
              {w.text}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default Sequence1Hook;

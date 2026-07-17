import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// NOTE: frame is LOCAL to this sequence (0 = global frame 195).
// Wrap with <Sequence from={195} durationInFrames={120}> in the parent composition.

type Word = {
  text: string;
  start: number;
  end: number;
  size: number;
  weight: number;
  variant: 'pause' | 'timeline' | 'blocks' | 'remove' | 'settle';
};

const WORDS: Word[] = [
  { text: 'ነገር ግን', start: 0, end: 15, size: 92, weight: 800, variant: 'pause' },
  { text: 'ከመጀመሪያው ቃል', start: 15, end: 30, size: 70, weight: 700, variant: 'timeline' },
  { text: 'በፊት', start: 30, end: 45, size: 76, weight: 700, variant: 'timeline' },
  { text: 'ያለውን', start: 45, end: 60, size: 78, weight: 700, variant: 'timeline' },
  { text: 'አላስፈላጊ frame', start: 60, end: 80, size: 74, weight: 800, variant: 'blocks' },
  { text: 'remove', start: 80, end: 100, size: 130, weight: 900, variant: 'remove' },
  { text: 'አድርጋችሁ', start: 100, end: 120, size: 88, weight: 800, variant: 'settle' },
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 37) % 100,
  y: (i * 53) % 100,
  size: 2 + (i % 4),
  speed: 0.15 + (i % 5) * 0.03,
}));

const Sequence3SecretRule: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera: slow push + tiny handheld drift + parallax
  const cameraScale = interpolate(frame, [0, 120], [1, 1.14], { extrapolateRight: 'clamp' });
  const handX = Math.sin(frame * 0.09) * 4;
  const handY = Math.cos(frame * 0.07) * 3;

  // Pause moment on "ነገር ግን" (0-15): darken + spotlight + particles freeze
  const pauseDark = interpolate(frame, [0, 6, 15], [0, 0.55, 0.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const spotlight = interpolate(frame, [0, 8], [0, 0.9], { extrapolateRight: 'clamp' });
  const particlesFrozen = frame >= 2 && frame <= 15;

  // Timeline guide lines appear (15-60)
  const guideLines = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const timelineZoom = interpolate(frame, [15, 60], [1, 1.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Unnecessary frame blocks appear faded (60-80), highlighted first word visible
  const blocksAppear = interpolate(frame, [60, 72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const preRemoveWarn = interpolate(frame, [72, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Hero removal at "remove" (80-100): blocks blast away, flash, particle burst, collapse
  const removeLocal = frame - 80;
  const removeTrigger = spring({
    frame: removeLocal,
    fps,
    config: { damping: 10, stiffness: 260, mass: 0.5 },
  });
  const blockExplode = interpolate(removeLocal, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const removeFlash = interpolate(removeLocal, [0, 2, 10], [0, 0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const timelineCollapse = interpolate(removeLocal, [4, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Settle / success glow (100-120)
  const settleLocal = frame - 100;
  const settleGlow = interpolate(settleLocal, [0, 15], [0, 0.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const settleSettleScale = interpolate(settleLocal, [0, 20], [1.02, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Light Sweep -> Zoom Blur transition OUT into Sequence 4 (last 18 frames)
  const t = interpolate(frame, [102, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sweepX = interpolate(t, [0, 0.6], [-140, 140], { extrapolateRight: 'clamp' });
  const sweepOpacity = interpolate(t, [0, 0.3, 0.6], [0, 0.5, 0], { extrapolateRight: 'clamp' });
  const zoomBlur = interpolate(t, [0.4, 1], [0, 38], { extrapolateLeft: 'clamp' });
  const zoomScale = interpolate(t, [0.4, 1], [1, 1.3], { extrapolateLeft: 'clamp' });
  const outOpacity = interpolate(t, [0.75, 1], [1, 0], { extrapolateLeft: 'clamp' });

  const blockCount = 6;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07070c',
        overflow: 'hidden',
        transform: `translate(${handX}px, ${handY}px) scale(${cameraScale * timelineZoom * zoomScale * settleSettleScale})`,
        filter: `blur(${zoomBlur}px)`,
        opacity: outOpacity,
      }}
    >
      {/* Animated mesh gradient base */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 25% 20%, rgba(59,130,246,0.22), transparent 55%),
                       radial-gradient(circle at 78% 30%, rgba(168,85,247,0.20), transparent 55%),
                       radial-gradient(circle at 50% 85%, rgba(34,211,238,0.14), transparent 55%),
                       linear-gradient(180deg, #07070c 0%, #0b0b14 100%)`,
        }}
      />

      {/* Large blurred glowing circles */}
      <div
        className="absolute rounded-full"
        style={{
          width: 460,
          height: 460,
          top: -80 + Math.sin(frame * 0.02) * 20,
          left: -100,
          background: 'rgba(59,130,246,0.20)',
          filter: 'blur(110px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 380,
          height: 380,
          bottom: -60 + Math.cos(frame * 0.025) * 18,
          right: -90,
          background: 'rgba(168,85,247,0.18)',
          filter: 'blur(110px)',
        }}
      />

      {/* Floating particles (freeze briefly during "ነገር ግን" pause) */}
      {PARTICLES.map((p, i) => {
        const drift = particlesFrozen ? 0 : frame * p.speed;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${(p.y + drift) % 100}%`,
              width: p.size,
              height: p.size,
              background: 'rgba(255,255,255,0.35)',
              boxShadow: '0 0 6px rgba(255,255,255,0.4)',
            }}
          />
        );
      })}

      {/* Darken + spotlight for dramatic pause */}
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${pauseDark})` }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, rgba(255,255,255,${spotlight * 0.15}), transparent 45%)`,
        }}
      />

      {/* Light sweep transition */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(100deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)`,
          transform: `translateX(${sweepX}%)`,
          opacity: sweepOpacity,
          mixBlendMode: 'screen',
        }}
      />

      {/* Flash on removal */}
      <AbsoluteFill style={{ backgroundColor: '#ffffff', opacity: removeFlash }} />

      {/* Glassmorphism timeline panel */}
      {frame >= 15 && frame < 100 && (
        <div
          className="absolute rounded-2xl"
          style={{
            left: '8%',
            top: '62%',
            width: `${84 - timelineCollapse * 40}%`,
            height: 150,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(96,165,250,0.30)',
            backdropFilter: 'blur(14px)',
            opacity: interpolate(frame, [15, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * (1 - timelineCollapse * 0.3),
            boxShadow: '0 0 40px rgba(59,130,246,0.15)',
          }}
        >
          {/* Guide lines */}
          <div
            className="absolute"
            style={{
              left: '10%',
              top: 0,
              bottom: 0,
              width: 1,
              background: 'rgba(96,165,250,0.5)',
              opacity: guideLines,
            }}
          />
          <div
            className="absolute"
            style={{
              left: '90%',
              top: 0,
              bottom: 0,
              width: 1,
              background: 'rgba(96,165,250,0.5)',
              opacity: guideLines,
            }}
          />

          {/* Unnecessary frame blocks (faded gray) */}
          <div className="absolute flex" style={{ left: 20, top: 20, gap: 6 }}>
            {Array.from({ length: blockCount }).map((_, i) => {
              const localOpacity = 1 - blockExplode;
              const explodeX = blockExplode * (i - blockCount / 2) * 60;
              const explodeY = blockExplode * -50 * (1 + i * 0.1);
              const explodeRot = blockExplode * (i % 2 === 0 ? 40 : -40);
              return (
                <div
                  key={i}
                  style={{
                    width: 34,
                    height: 60,
                    borderRadius: 4,
                    background: `rgba(160,160,170,${0.35 * blocksAppear * localOpacity})`,
                    filter: `blur(${1.5 + preRemoveWarn * 1}px)`,
                    border: preRemoveWarn > 0 && i === blockCount - 1
                      ? '1px solid rgba(239,68,68,0.6)'
                      : '1px solid rgba(255,255,255,0.08)',
                    transform: `translate(${explodeX}px, ${explodeY}px) rotate(${explodeRot}deg) scale(${1 - blockExplode * 0.4})`,
                    opacity: localOpacity * blocksAppear,
                  }}
                />
              );
            })}
            {/* Highlighted first real word block */}
            <div
              style={{
                width: 40,
                height: 60,
                borderRadius: 4,
                background: 'rgba(59,130,246,0.55)',
                border: '1.5px solid rgba(96,165,250,0.9)',
                boxShadow: '0 0 18px rgba(59,130,246,0.6)',
                opacity: blocksAppear,
                transform: `translateX(${timelineCollapse * -180}px) scale(${1 + settleGlow * 0.05})`,
              }}
            />
          </div>

          {/* Particle burst on removal */}
          {removeLocal >= 0 &&
            Array.from({ length: 10 }).map((_, i) => {
              const angle = (i / 10) * Math.PI * 2;
              const dist = blockExplode * 90;
              return (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: '18%',
                    top: '40%',
                    width: 4,
                    height: 4,
                    background: 'rgba(96,165,250,0.9)',
                    transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`,
                    opacity: 1 - blockExplode,
                    boxShadow: '0 0 8px rgba(96,165,250,0.8)',
                  }}
                />
              );
            })}

          {/* Clean aligned success glow after settle */}
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at 20% 50%, rgba(34,211,238,${settleGlow}), transparent 60%)`,
            }}
          />
        </div>
      )}

      {/* Kinetic typography */}
      <AbsoluteFill className="flex items-center justify-center px-10">
        {WORDS.map((w) => {
          const local = frame - w.start;
          const dur = w.end - w.start;
          if (frame < w.start || frame >= w.end) return null;

          const entrance = spring({
            frame: local,
            fps,
            config: { damping: 14, stiffness: 210, mass: 0.5 },
          });
          const wordBlur = interpolate(local, [0, dur * 0.5], [16, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const rotate = interpolate(local, [0, dur * 0.4], [w.variant === 'timeline' ? -6 : 4, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const heroScale =
            w.variant === 'remove'
              ? entrance * (1 + removeTrigger * 0.25)
              : entrance;
          const color =
            w.variant === 'remove'
              ? '#93c5fd'
              : w.variant === 'settle'
              ? '#a5f3fc'
              : '#ffffff';
          const glow =
            w.variant === 'remove'
              ? '0 0 40px rgba(96,165,250,0.9), 0 0 90px rgba(255,255,255,0.5)'
              : w.variant === 'settle'
              ? '0 0 30px rgba(34,211,238,0.7)'
              : '0 0 18px rgba(96,165,250,0.4)';

          return (
            <div
              key={w.text}
              className="absolute font-black text-center tracking-tight"
              style={{
                fontSize: w.size,
                fontWeight: w.weight,
                color,
                transform: `scale(${heroScale}) rotate(${rotate}deg)`,
                filter: `blur(${wordBlur}px)`,
                textShadow: glow,
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

export default Sequence3SecretRule;

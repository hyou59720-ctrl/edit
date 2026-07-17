import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// NOTE: frame is LOCAL to this sequence (0 = start of Sequence 2 at global frame 85).
// Wrap with <Sequence from={85} durationInFrames={110}> in the parent composition.

type Word = {
  text: string;
  start: number;
  end: number;
  size: number;
  weight: number;
  emphasis?: boolean;
};

const WORDS: Word[] = [
  { text: 'አብዛኛዎቹ', start: 0, end: 20, size: 78, weight: 800 },
  { text: 'videos', start: 20, end: 35, size: 88, weight: 900, emphasis: true },
  { text: 'መልእክቱ', start: 35, end: 50, size: 76, weight: 700 },
  { text: 'ከመጀመሩ በፊት', start: 50, end: 65, size: 70, weight: 700 },
  { text: 'ተመልካቾቻቸውን', start: 65, end: 90, size: 90, weight: 900, emphasis: true },
  { text: 'ያጣሉ።', start: 90, end: 110, size: 110, weight: 900, emphasis: true },
];

const AUDIENCE_ICONS = [
  { x: 15, y: 22, delay: 8, fallAt: 68 },
  { x: 78, y: 18, delay: 14, fallAt: 74 },
  { x: 25, y: 68, delay: 20, fallAt: 80 },
  { x: 70, y: 72, delay: 5, fallAt: 66 },
  { x: 50, y: 30, delay: 26, fallAt: 86 },
  { x: 12, y: 50, delay: 18, fallAt: 78 },
];

const Sequence2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow forward camera push across the whole sequence
  const cameraScale = interpolate(frame, [0, 110], [1, 1.12], {
    extrapolateRight: 'clamp',
  });

  // Retention graph: continuously declining line
  const graphProgress = interpolate(frame, [0, 110], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const graphPoints = Array.from({ length: 12 }, (_, i) => {
    const px = (i / 11) * 100;
    const decay = Math.pow(i / 11, 1.4);
    const py = 20 + decay * 55 * Math.min(1, graphProgress * 1.3);
    return `${px},${py}`;
  }).join(' ');
  const graphReveal = interpolate(frame, [0, 90], [0, 100], {
    extrapolateRight: 'clamp',
  });

  // Engagement chart bars dropping
  const bars = [95, 80, 62, 45, 30, 18];

  // RGB split + directional blur transition OUT into Sequence 3 (last 15 frames)
  const t = interpolate(frame, [95, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rgbOffset = interpolate(t, [0, 1], [0, 22]);
  const transBlur = interpolate(t, [0, 1], [0, 40]);
  const transScale = interpolate(t, [0, 1], [1, 1.25]);
  const transOpacity = interpolate(t, [0.75, 1], [1, 0], { extrapolateLeft: 'clamp' });
  const buildGlow = interpolate(t, [0, 1], [0, 0.6]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#08060a',
        overflow: 'hidden',
        transform: `scale(${cameraScale * transScale})`,
        filter: `blur(${transBlur}px)`,
        opacity: transOpacity,
      }}
    >
      {/* Base gradient depth */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 20% 15%, rgba(239,68,68,0.20), transparent 55%),
                       radial-gradient(circle at 80% 85%, rgba(251,146,60,0.14), transparent 55%),
                       linear-gradient(180deg, #08060a 0%, #0c0810 100%)`,
        }}
      />

      {/* RGB split ghost layers near transition */}
      {t > 0 && (
        <>
          <AbsoluteFill
            style={{
              transform: `translateX(${-rgbOffset}px)`,
              mixBlendMode: 'screen',
              background: 'rgba(255,0,60,0.12)',
            }}
          />
          <AbsoluteFill
            style={{
              transform: `translateX(${rgbOffset}px)`,
              mixBlendMode: 'screen',
              background: 'rgba(0,180,255,0.12)',
            }}
          />
        </>
      )}

      {/* Energy build glow before Sequence 3 */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.9), transparent 60%)',
          opacity: buildGlow,
          mixBlendMode: 'screen',
        }}
      />

      {/* Noise texture */}
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />

      {/* Floating audience icons that fade/fall away */}
      {AUDIENCE_ICONS.map((icon, i) => {
        const appear = spring({
          frame: frame - icon.delay,
          fps,
          config: { damping: 16, stiffness: 150 },
        });
        const fallProgress = interpolate(
          frame,
          [icon.fallAt, icon.fallAt + 18],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const fadeOut = interpolate(fallProgress, [0, 1], [1, 0]);
        const dropY = interpolate(fallProgress, [0, 1], [0, 90]);
        const rotate = interpolate(fallProgress, [0, 1], [0, i % 2 === 0 ? 35 : -35]);

        return (
          <div
            key={i}
            className="absolute rounded-full flex items-center justify-center"
            style={{
              left: `${icon.x}%`,
              top: `${icon.y}%`,
              width: 54,
              height: 54,
              background: 'rgba(255,255,255,0.08)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(6px)',
              transform: `scale(${appear}) translateY(${dropY}px) rotate(${rotate}deg)`,
              opacity: appear * fadeOut,
              boxShadow: '0 0 20px rgba(239,68,68,0.25)',
            }}
          >
            <div
              className="rounded-full"
              style={{ width: 22, height: 22, background: 'rgba(255,255,255,0.6)' }}
            />
          </div>
        );
      })}

      {/* Retention graph card (declining line) */}
      <div
        className="absolute rounded-2xl"
        style={{
          left: '10%',
          top: '58%',
          width: '80%',
          height: 190,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(239,68,68,0.35)',
          backdropFilter: 'blur(10px)',
          opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          boxShadow: '0 0 40px rgba(239,68,68,0.15)',
        }}
      >
        <svg
          viewBox="0 0 100 75"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%' }}
        >
          <polyline
            points={graphPoints}
            fill="none"
            stroke="#ef4444"
            strokeWidth={2.2}
            strokeDasharray={100}
            strokeDashoffset={100 - graphReveal}
            style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.8))' }}
          />
        </svg>
        {/* Downward arrow accent */}
        <div
          className="absolute font-bold"
          style={{
            right: 14,
            top: 10,
            color: '#f97316',
            fontSize: 30,
            opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          ↓
        </div>
      </div>

      {/* Engagement bar chart, dropping bars, top-right */}
      <div
        className="absolute flex items-end"
        style={{ right: '8%', top: '10%', gap: 8, height: 130 }}
      >
        {bars.map((h, i) => {
          const localDelay = i * 6;
          const barH = interpolate(
            frame,
            [localDelay, localDelay + 20],
            [10, h],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          return (
            <div
              key={i}
              style={{
                width: 12,
                height: barH,
                background: i > 2 ? 'rgba(239,68,68,0.85)' : 'rgba(251,146,60,0.85)',
                borderRadius: 3,
                boxShadow: '0 0 10px rgba(239,68,68,0.4)',
              }}
            />
          );
        })}
      </div>

      {/* Kinetic typography */}
      <AbsoluteFill className="flex items-center justify-center px-10" style={{ top: '-8%' }}>
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
          const emphasisScale = w.emphasis
            ? 1 + Math.sin(local * 0.3) * 0.03
            : 1;

          return (
            <div
              key={w.text}
              className="absolute font-black text-center tracking-tight"
              style={{
                fontSize: w.size,
                fontWeight: w.weight,
                color: w.emphasis ? '#fecaca' : '#ffffff',
                transform: `scale(${entrance * emphasisScale})`,
                filter: `blur(${wordBlur}px)`,
                textShadow: w.emphasis
                  ? '0 0 30px rgba(239,68,68,0.8), 0 0 60px rgba(251,146,60,0.4)'
                  : '0 0 16px rgba(255,255,255,0.35)',
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

export default Sequence2Problem;

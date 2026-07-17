import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// NOTE: frame is LOCAL to this sequence (0 = global frame 490).
// Wrap with <Sequence from={490} durationInFrames={120}> in the parent composition.

type Word = {
  text: string;
  start: number;
  end: number;
  size: number;
  weight: number;
  hero?: boolean;
};

const WORDS: Word[] = [
  { text: 'እንደዚህ ያሉ', start: 0, end: 15, size: 76, weight: 800 },
  { text: 'ትንንሽ', start: 15, end: 32, size: 110, weight: 900, hero: true },
  { text: 'edits', start: 32, end: 50, size: 120, weight: 900, hero: true },
  { text: 'የ video-ውን', start: 50, end: 65, size: 74, weight: 700 },
  { text: 'የመመልከቻ ጊዜ', start: 65, end: 85, size: 88, weight: 900, hero: true },
  { text: 'በእጅጉ', start: 85, end: 105, size: 82, weight: 800 },
  { text: 'ሊጨምሩ ይችላሉ።', start: 105, end: 120, size: 80, weight: 800 },
];

const EDITOR_CARDS = [
  { label: 'Cut Clip', x: 14, y: 20, delay: 2 },
  { label: 'Move Transition', x: 62, y: 14, delay: 5 },
  { label: 'Adjust Caption', x: 18, y: 72, delay: 8 },
  { label: 'Add Motion', x: 60, y: 76, delay: 11 },
];

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 43) % 100,
  y: (i * 31) % 100,
  size: 2 + (i % 3),
  speed: 0.08 + (i % 4) * 0.03,
}));

const Sequence5SmallEdits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraScale = interpolate(frame, [0, 120], [1, 1.18], { extrapolateRight: 'clamp' });
  const handX = Math.sin(frame * 0.07) * 4;
  const handY = Math.cos(frame * 0.06) * 3;

  const section1Active = frame < 20;

  const section2Local = frame - 15;
  const splitReveal = spring({
    frame: section2Local,
    fps,
    config: { damping: 15, stiffness: 140, mass: 0.6 },
  });
  const morphProgress = interpolate(frame, [20, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const heroPulse = 1 + Math.sin(frame * 0.3) * 0.03;

  const section3Local = frame - 50;
  const graphGrowth = interpolate(frame, [50, 85], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const watchTimeNumber = Math.round(
    interpolate(frame, [50, 85], [42, 91], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const graphPoints = Array.from({ length: 12 }, (_, i) => {
    const px = (i / 11) * 100;
    const rise = Math.pow(i / 11, 0.8);
    const py = 85 - rise * 60 * Math.min(1, graphGrowth * 1.2);
    return `${px},${py}`;
  }).join(' ');
  const graphReveal = interpolate(frame, [50, 82], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const section4Local = frame - 85;
  const impactGlow = interpolate(frame, [85, 98], [0, 0.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const celebrationBurst = interpolate(section4Local, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const t = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const zoomOut = interpolate(t, [0, 1], [1, 0.7]);
  const collapseBlur = interpolate(t, [0, 1], [0, 30]);
  const sweepX = interpolate(t, [0, 0.6], [-140, 140], { extrapolateRight: 'clamp' });
  const sweepOpacity = interpolate(t, [0, 0.3, 0.6], [0, 0.5, 0], { extrapolateRight: 'clamp' });
  const collapseScale = interpolate(t, [0.4, 1], [1, 0.02], { extrapolateLeft: 'clamp' });
  const outOpacity = interpolate(t, [0.7, 1], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07070c',
        overflow: 'hidden',
        transform: `translate(${handX}px, ${handY}px) scale(${cameraScale * zoomOut})`,
        filter: `blur(${collapseBlur}px)`,
        opacity: outOpacity,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 22% 20%, rgba(59,130,246,0.20), transparent 55%),
                       radial-gradient(circle at 80% 75%, rgba(168,85,247,0.18), transparent 55%),
                       linear-gradient(180deg, #07070c 0%, #0b0b16 100%)`,
        }}
      />

      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 30%)',
        }}
      />

      {PARTICLES.map((p, i) => {
        const drift = frame * p.speed;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${(p.y + drift) % 100}%`,
              width: p.size,
              height: p.size,
              background: 'rgba(255,255,255,0.3)',
              boxShadow: '0 0 6px rgba(255,255,255,0.35)',
            }}
          />
        );
      })}

      {section1Active &&
        EDITOR_CARDS.map((c, i) => {
          const appear = spring({
            frame: frame - c.delay,
            fps,
            config: { damping: 14, stiffness: 180 },
          });
          return (
            <div
              key={i}
              className="absolute rounded-xl px-3 py-2"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(96,165,250,0.35)',
                backdropFilter: 'blur(10px)',
                transform: `scale(${appear}) translateY(${(1 - appear) * 20}px)`,
                opacity: appear,
                boxShadow: '0 0 24px rgba(59,130,246,0.15)',
              }}
            >
              <span className="text-white text-sm font-semibold">{c.label}</span>
            </div>
          );
        })}

      {frame >= 15 && frame < 55 && (
        <div
          className="absolute rounded-2xl overflow-hidden"
          style={{
            left: '10%',
            top: '30%',
            width: '80%',
            height: 220,
            transform: `scale(${splitReveal * heroPulse})`,
            opacity: splitReveal,
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 0 50px rgba(59,130,246,0.2)',
          }}
        >
          <div
            className="absolute inset-0 flex items-center px-6"
            style={{
              background: 'rgba(255,255,255,0.04)',
              opacity: 1 - morphProgress,
            }}
          >
            <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
          </div>

          <div
            className="absolute inset-0 flex flex-col justify-center px-6"
            style={{
              background: 'linear-gradient(90deg, rgba(59,130,246,0.12), rgba(168,85,247,0.12))',
              opacity: morphProgress,
            }}
          >
            <div className="flex" style={{ gap: 6 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded"
                  style={{
                    width: 26,
                    height: 34,
                    background: i % 2 === 0 ? 'rgba(59,130,246,0.6)' : 'rgba(168,85,247,0.6)',
                    boxShadow: '0 0 10px rgba(96,165,250,0.4)',
                    transform: `scaleY(${interpolate(morphProgress, [0, 1], [0.3, 1])})`,
                  }}
                />
              ))}
            </div>
            <div
              className="mt-3 h-1.5 w-2/3 rounded-full"
              style={{ background: 'rgba(34,211,238,0.7)', boxShadow: '0 0 10px rgba(34,211,238,0.6)' }}
            />
          </div>

          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(100deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)',
              transform: `translateX(${interpolate(morphProgress, [0, 1], [-120, 120])}%)`,
              mixBlendMode: 'screen',
            }}
          />
        </div>
      )}

      {frame >= 50 && frame < 90 && (
        <div
          className="absolute rounded-2xl px-6 py-5"
          style={{
            left: '10%',
            top: '30%',
            width: '80%',
            height: 260,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(34,211,238,0.3)',
            backdropFilter: 'blur(14px)',
            opacity: interpolate(section3Local, [0, 10], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            boxShadow: '0 0 40px rgba(34,211,238,0.15)',
          }}
        >
          <div className="flex items-baseline" style={{ gap: 10 }}>
            <span className="font-black" style={{ fontSize: 56, color: '#67e8f9', textShadow: '0 0 20px rgba(34,211,238,0.7)' }}>
              {watchTimeNumber}%
            </span>
            <span className="text-white text-sm opacity-70">watch-time</span>
          </div>
          <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{ width: '100%', height: 120, marginTop: 10 }}>
            <polyline
              points={graphPoints}
              fill="none"
              stroke="#22d3ee"
              strokeWidth={2.4}
              strokeDasharray={100}
              strokeDashoffset={100 - graphReveal}
              style={{ filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.8))' }}
            />
          </svg>
        </div>
      )}

      {frame >= 85 && (
        <>
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at 50% 45%, rgba(96,165,250,${impactGlow}), transparent 60%)`,
              mixBlendMode: 'screen',
            }}
          />
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const dist = celebrationBurst * 260;
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: '50%',
                  top: '45%',
                  width: 5,
                  height: 5,
                  background: i % 2 === 0 ? '#60a5fa' : '#c084fc',
                  transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`,
                  opacity: 1 - celebrationBurst,
                  boxShadow: '0 0 10px rgba(96,165,250,0.8)',
                }}
              />
            );
          })}
        </>
      )}

      <AbsoluteFill
        style={{
          transform: `scale(${collapseScale})`,
          transformOrigin: '50% 50%',
        }}
      >
        <AbsoluteFill
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.9), transparent 40%)',
            opacity: t > 0.4 ? 1 : 0,
            mixBlendMode: 'screen',
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: 'linear-gradient(100deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)',
          transform: `translateX(${sweepX}%)`,
          opacity: sweepOpacity,
          mixBlendMode: 'screen',
        }}
      />

      <AbsoluteFill className="flex items-center justify-center px-10" style={{ top: '32%' }}>
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
          const heroScale = w.hero ? entrance * (1 + Math.sin(local * 0.3) * 0.03) : entrance;

          return (
            <div
              key={w.text}
              className="absolute font-black text-center tracking-tight"
              style={{
                fontSize: w.size,
                fontWeight: w.weight,
                color: w.hero ? '#e0f2fe' : '#ffffff',
                transform: `scale(${heroScale})`,
                filter: `blur(${wordBlur}px)`,
                textShadow: w.hero
                  ? '0 0 34px rgba(96,165,250,0.9), 0 0 70px rgba(34,211,238,0.5)'
                  : '0 0 18px rgba(255,255,255,0.35)',
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

export default Sequence5SmallEdits;

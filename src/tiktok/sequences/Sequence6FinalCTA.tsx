import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// NOTE: frame is LOCAL to this sequence (0 = global frame 610).
// Wrap with <Sequence from={610} durationInFrames={116}> in the parent composition.

type Word = {
  text: string;
  start: number;
  end: number;
  size: number;
  weight: number;
  hero?: boolean;
};

const WORDS: Word[] = [
  { text: 'የ content-አችሁን', start: 0, end: 15, size: 68, weight: 700 },
  { text: 'performance', start: 15, end: 30, size: 92, weight: 900, hero: true },
  { text: 'የሚያግዙ', start: 30, end: 45, size: 74, weight: 700 },
  { text: 'pro editing', start: 45, end: 65, size: 140, weight: 900, hero: true },
  { text: 'tips ለማግኘት', start: 65, end: 80, size: 80, weight: 800 },
  { text: 'follow ማድረግ', start: 80, end: 100, size: 96, weight: 900, hero: true },
  { text: 'እንዳይረሳ።', start: 100, end: 116, size: 100, weight: 900 },
];

const METRICS = [
  { label: 'Score', from: 62, to: 94, x: 16, y: 16 },
  { label: 'Growth', from: 12, to: 48, x: 60, y: 16 },
];

const TIP_CARDS = [
  { label: 'Pacing', x: 14, y: 20, delay: 65 },
  { label: 'Captions', x: 58, y: 16, delay: 69 },
  { label: 'Transitions', x: 16, y: 66, delay: 73 },
  { label: 'Sound FX', x: 58, y: 70, delay: 77 },
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 37) % 100,
  y: (i * 53) % 100,
  size: 2 + (i % 4),
  speed: 0.07 + (i % 5) * 0.025,
}));

const Sequence6FinalCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const openT = interpolate(frame, [0, 14], [1, 0], { extrapolateRight: 'clamp' });
  const openBlur = interpolate(openT, [0, 1], [0, 22]);
  const openScale = interpolate(openT, [0, 1], [1, 1.2]);
  const openSweepX = interpolate(frame, [0, 12], [-140, 140], { extrapolateRight: 'clamp' });
  const openSweepOpacity = interpolate(frame, [0, 6, 12], [0, 0.5, 0], { extrapolateRight: 'clamp' });

  const cameraScale = interpolate(frame, [0, 116], [1, 1.14], { extrapolateRight: 'clamp' });
  const handX = Math.sin(frame * 0.06) * 4;
  const handY = Math.cos(frame * 0.05) * 3;

  const dashOpacity = interpolate(frame, [2, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dashFadeOut = interpolate(frame, [42, 52], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const heroLocal = frame - 45;
  const heroPush = spring({
    frame: heroLocal,
    fps,
    config: { damping: 12, stiffness: 190, mass: 0.6 },
  });
  const heroGlow = interpolate(heroLocal, [0, 14], [0, 0.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const heroBurst = interpolate(heroLocal, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const tipsActive = frame >= 63 && frame < 82;

  const followLocal = frame - 80;
  const followCardIn = spring({
    frame: followLocal,
    fps,
    config: { damping: 15, stiffness: 150 },
  });
  const followActivate = interpolate(followLocal, [8, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringExpand = interpolate(followLocal, [8, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const finalLocal = frame - 100;
  const finalSettle = spring({
    frame: finalLocal,
    fps,
    config: { damping: 20, stiffness: 90, mass: 0.8 },
  });
  const finalGlow = interpolate(finalLocal, [0, 16], [0, 0.55], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const finalCameraPush = interpolate(finalLocal, [0, 16], [1, 1.04], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#06060b',
        overflow: 'hidden',
        transform: `translate(${handX}px, ${handY}px) scale(${cameraScale * openScale * finalCameraPush})`,
        filter: `blur(${openBlur}px)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 25% 18%, rgba(59,130,246,0.20), transparent 55%),
                       radial-gradient(circle at 78% 82%, rgba(168,85,247,0.18), transparent 55%),
                       linear-gradient(180deg, #06060b 0%, #0a0a15 100%)`,
        }}
      />

      <AbsoluteFill
        style={{
          background: 'conic-gradient(from 200deg at 50% -10%, transparent 0deg, rgba(59,130,246,0.14) 15deg, transparent 40deg)',
          mixBlendMode: 'screen',
        }}
      />

      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
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

      <AbsoluteFill
        style={{
          background: 'linear-gradient(100deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)',
          transform: `translateX(${openSweepX}%)`,
          opacity: openSweepOpacity,
          mixBlendMode: 'screen',
        }}
      />

      {frame < 55 && (
        <div
          className="absolute rounded-2xl px-6 py-5 flex"
          style={{
            left: '8%',
            top: '58%',
            width: '84%',
            height: 170,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(96,165,250,0.3)',
            backdropFilter: 'blur(14px)',
            opacity: dashOpacity * dashFadeOut,
            boxShadow: '0 0 40px rgba(59,130,246,0.15)',
            gap: 24,
          }}
        >
          {METRICS.map((m, i) => {
            const val = Math.round(
              interpolate(frame, [8, 40], [m.from, m.to], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            );
            return (
              <div key={i} className="flex flex-col justify-center">
                <span className="text-xs text-white opacity-60">{m.label}</span>
                <span className="font-black" style={{ fontSize: 44, color: '#67e8f9', textShadow: '0 0 18px rgba(34,211,238,0.6)' }}>
                  {val}%
                </span>
              </div>
            );
          })}
        </div>
      )}

      {heroLocal >= -5 && heroLocal < 20 && (
        <>
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(96,165,250,${heroGlow}), transparent 60%)`,
              mixBlendMode: 'screen',
            }}
          />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const dist = heroBurst * 220;
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: '50%',
                  top: '48%',
                  width: 4,
                  height: 4,
                  background: i % 2 === 0 ? '#60a5fa' : '#c084fc',
                  transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`,
                  opacity: 1 - heroBurst,
                  boxShadow: '0 0 10px rgba(96,165,250,0.8)',
                }}
              />
            );
          })}
        </>
      )}

      {tipsActive &&
        TIP_CARDS.map((c, i) => {
          const appear = spring({
            frame: frame - c.delay,
            fps,
            config: { damping: 14, stiffness: 170 },
          });
          return (
            <div
              key={i}
              className="absolute rounded-xl px-3 py-2"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(168,85,247,0.35)',
                backdropFilter: 'blur(10px)',
                transform: `scale(${appear}) translateY(${(1 - appear) * 16}px)`,
                opacity: appear,
                boxShadow: '0 0 20px rgba(168,85,247,0.15)',
              }}
            >
              <span className="text-white text-sm font-semibold">{c.label}</span>
            </div>
          );
        })}

      {followLocal >= 0 && followLocal < 36 && (
        <div
          className="absolute flex flex-col items-center"
          style={{
            left: '50%',
            top: '55%',
            transform: `translate(-50%, -50%) scale(${followCardIn})`,
            opacity: followCardIn,
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: 160 + ringExpand * 140,
              height: 160 + ringExpand * 140,
              border: '2px solid rgba(96,165,250,0.5)',
              opacity: 1 - ringExpand,
              boxShadow: '0 0 40px rgba(96,165,250,0.4)',
            }}
          />
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: 130,
              height: 130,
              background: 'linear-gradient(135deg, rgba(59,130,246,0.35), rgba(168,85,247,0.35))',
              border: '1.5px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 30px rgba(96,165,250,0.4)',
            }}
          >
            <div className="rounded-full" style={{ width: 54, height: 54, background: 'rgba(255,255,255,0.5)' }} />
          </div>
          <div
            className="rounded-full flex items-center justify-center mt-4"
            style={{
              width: 46,
              height: 46,
              background: followActivate > 0.5 ? 'rgba(74,222,128,0.85)' : 'rgba(255,255,255,0.1)',
              border: '1.5px solid rgba(255,255,255,0.4)',
              transform: `scale(${1 + followActivate * 0.15})`,
              boxShadow: followActivate > 0.5 ? '0 0 24px rgba(74,222,128,0.7)' : 'none',
            }}
          >
            <span className="text-white font-black" style={{ fontSize: 22 }}>
              {followActivate > 0.5 ? '✓' : '+'}
            </span>
          </div>
        </div>
      )}

      {finalLocal >= 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${finalGlow}), transparent 55%)`,
            mixBlendMode: 'screen',
          }}
        />
      )}
      {finalLocal >= 0 &&
        Array.from({ length: 10 }).map((_, i) => {
          const angle = (i / 10) * Math.PI * 2;
          const dist = 140 + Math.sin(finalLocal * 0.05 + i) * 10;
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: '50%',
                top: '48%',
                width: 3,
                height: 3,
                background: 'rgba(255,255,255,0.6)',
                transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(${finalSettle})`,
                opacity: finalSettle * 0.7,
              }}
            />
          );
        })}

      <AbsoluteFill className="flex items-center justify-center px-10" style={{ top: '-6%' }}>
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
          const heroScale = w.hero
            ? entrance * (1 + heroPush * (w.text === 'pro editing' ? 0.1 : 0))
            : entrance;
          const finalScale = w.start === 100 ? entrance * finalSettle : heroScale;

          const color = w.hero ? '#e0f2fe' : '#ffffff';
          const glow = w.hero
            ? '0 0 34px rgba(96,165,250,0.9), 0 0 80px rgba(168,85,247,0.5)'
            : '0 0 18px rgba(255,255,255,0.35)';

          return (
            <div
              key={w.text}
              className="absolute font-black text-center tracking-tight"
              style={{
                fontSize: w.size,
                fontWeight: w.weight,
                color,
                transform: `scale(${finalScale})`,
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

export default Sequence6FinalCTA;

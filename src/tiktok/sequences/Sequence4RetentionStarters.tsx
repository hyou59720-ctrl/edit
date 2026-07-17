import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// NOTE: frame is LOCAL to this sequence (0 = global frame 315).
// Wrap with <Sequence from={315} durationInFrames={175}> in the parent composition.

type Word = {
  text: string;
  start: number;
  end: number;
  size: number;
  weight: number;
  section: 'movement' | 'emotion' | 'result' | 'story';
};

const WORDS: Word[] = [
  { text: 'በ movement፣', start: 0, end: 20, size: 82, weight: 900, section: 'movement' },
  { text: 'በ emotion', start: 20, end: 40, size: 80, weight: 800, section: 'emotion' },
  { text: 'ወይም', start: 40, end: 60, size: 70, weight: 700, section: 'emotion' },
  { text: 'በ final result', start: 60, end: 80, size: 74, weight: 900, section: 'result' },
  { text: 'ከጀመራችሁ፣', start: 80, end: 95, size: 78, weight: 800, section: 'result' },
  { text: 'ሰዎች', start: 95, end: 110, size: 84, weight: 800, section: 'story' },
  { text: 'እንዲቀጥሉ', start: 110, end: 130, size: 86, weight: 800, section: 'story' },
  { text: 'የሚያደርግ', start: 130, end: 145, size: 80, weight: 800, section: 'story' },
  { text: 'ምክንያት', start: 145, end: 160, size: 90, weight: 900, section: 'story' },
  { text: 'ትሰጧቸዋላችሁ።', start: 160, end: 175, size: 76, weight: 800, section: 'story' },
];

const SPEED_LINES = Array.from({ length: 10 }, (_, i) => ({
  y: (i * 11) % 100,
  delay: i * 1.5,
  len: 60 + (i % 4) * 30,
}));

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 41) % 100,
  y: (i * 29) % 100,
  size: 2 + (i % 3),
  speed: 0.1 + (i % 4) * 0.04,
}));

const VIEWER_ICONS = [
  { x: 20, y: 55, delay: 95 },
  { x: 35, y: 62, delay: 100 },
  { x: 50, y: 55, delay: 105 },
  { x: 65, y: 62, delay: 110 },
  { x: 80, y: 55, delay: 115 },
];

const Sequence4RetentionStarters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraScale = interpolate(frame, [0, 175], [1, 1.16], { extrapolateRight: 'clamp' });
  const handX = Math.sin(frame * 0.08) * 5;
  const handY = Math.cos(frame * 0.065) * 4;
  const handRotate = Math.sin(frame * 0.04) * 0.6;

  const movementEnergy = interpolate(frame, [0, 20, 35], [1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const speedShift = frame * 6;

  const emotionLocal = frame - 20;
  const emotionWarm = interpolate(frame, [20, 35, 60], [0, 0.7, 0.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const breathe = 1 + Math.sin(emotionLocal * 0.12) * 0.03;
  const heartPulse = 1 + Math.max(0, Math.sin(emotionLocal * 0.2)) * 0.06;

  const resultLocal = frame - 60;
  const resultReveal = spring({
    frame: resultLocal,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });
  const checkDraw = interpolate(frame, [65, 85], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const growthBars = [40, 60, 85, 100];

  const viewerProgress = interpolate(frame, [110, 160], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const magneticPull = interpolate(frame, [130, 148], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const focusRing = interpolate(frame, [145, 162], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const finalBalance = interpolate(frame, [160, 175], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const t = interpolate(frame, [155, 175], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const zoomPush = interpolate(t, [0, 1], [1, 1.35]);
  const dirBlur = interpolate(t, [0, 1], [0, 32]);
  const sweepX = interpolate(t, [0, 0.6], [-140, 140], { extrapolateRight: 'clamp' });
  const sweepOpacity = interpolate(t, [0, 0.3, 0.6], [0, 0.55, 0], { extrapolateRight: 'clamp' });
  const rgbOffset = interpolate(t, [0.3, 1], [0, 8], { extrapolateLeft: 'clamp' });
  const outOpacity = interpolate(t, [0.75, 1], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#06060b',
        overflow: 'hidden',
        transform: `translate(${handX}px, ${handY}px) rotate(${handRotate}deg) scale(${cameraScale * zoomPush})`,
        filter: `blur(${dirBlur}px)`,
        opacity: outOpacity,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 25% 20%, rgba(59,130,246,${0.22 + emotionWarm * 0.05}), transparent 55%),
                       radial-gradient(circle at 78% 30%, rgba(168,85,247,0.18), transparent 55%),
                       radial-gradient(circle at 50% 85%, rgba(34,211,238,${0.10 + resultReveal * 0.08}), transparent 55%),
                       linear-gradient(180deg, #06060b 0%, #0a0a14 100%)`,
        }}
      />

      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 55%, rgba(251,191,36,0.10), transparent 60%)',
          opacity: emotionWarm,
        }}
      />

      <div
        className="absolute rounded-full"
        style={{
          width: 460,
          height: 460,
          top: -70 + Math.sin(frame * 0.02) * 22,
          left: -110,
          background: 'rgba(59,130,246,0.20)',
          filter: 'blur(110px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          bottom: -80 + Math.cos(frame * 0.022) * 20,
          right: -100,
          background: 'rgba(168,85,247,0.18)',
          filter: 'blur(110px)',
        }}
      />

      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
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

      {movementEnergy > 0 &&
        SPEED_LINES.map((l, i) => {
          const x = ((speedShift + l.delay * 20) % 140) - 20;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${l.y}%`,
                left: `${x}%`,
                width: l.len,
                height: 2,
                background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.9), transparent)',
                opacity: movementEnergy * 0.8,
                filter: 'blur(1px)',
                transform: 'translateX(-50%)',
              }}
            />
          );
        })}

      {emotionLocal >= 0 && emotionLocal < 45 && (
        <div
          className="absolute rounded-full"
          style={{
            left: '50%',
            top: '50%',
            width: 260,
            height: 260,
            transform: `translate(-50%, -50%) scale(${heartPulse})`,
            background: 'radial-gradient(circle, rgba(251,191,36,0.20), transparent 70%)',
            opacity: emotionWarm,
          }}
        />
      )}

      {resultLocal >= 0 && resultLocal < 45 && (
        <div
          className="absolute rounded-2xl flex flex-col items-center justify-center"
          style={{
            left: '18%',
            top: '30%',
            width: '64%',
            height: 210,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(34,211,238,0.35)',
            backdropFilter: 'blur(14px)',
            transform: `scale(${resultReveal})`,
            opacity: resultReveal,
            boxShadow: '0 0 40px rgba(34,197,94,0.18)',
          }}
        >
          <svg width="70" height="70" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r="30" fill="none" stroke="rgba(34,197,94,0.5)" strokeWidth="3" />
            <polyline
              points="20,36 30,46 50,24"
              fill="none"
              stroke="#4ade80"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={60}
              strokeDashoffset={60 - checkDraw * 60}
              style={{ filter: 'drop-shadow(0 0 8px rgba(74,222,128,0.8))' }}
            />
          </svg>
          <div className="flex items-end mt-3" style={{ gap: 6, height: 40 }}>
            {growthBars.map((h, i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: interpolate(frame, [70 + i * 3, 85 + i * 3], [4, h * 0.4], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                  background: 'rgba(74,222,128,0.85)',
                  borderRadius: 2,
                  boxShadow: '0 0 8px rgba(74,222,128,0.5)',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {VIEWER_ICONS.map((icon, i) => {
        const appear = spring({
          frame: frame - icon.delay,
          fps,
          config: { damping: 15, stiffness: 150 },
        });
        const pullX = magneticPull * (50 - icon.x) * 0.5;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${icon.x + pullX}%`,
              top: `${icon.y}%`,
              width: 40,
              height: 40,
              background: 'rgba(255,255,255,0.08)',
              border: '1.5px solid rgba(96,165,250,0.5)',
              backdropFilter: 'blur(6px)',
              transform: `scale(${appear}) translateX(${viewerProgress * 60}px)`,
              opacity: appear,
              boxShadow: '0 0 16px rgba(59,130,246,0.35)',
            }}
          />
        );
      })}

      {viewerProgress > 0 && (
        <div
          className="absolute rounded-full"
          style={{
            left: '15%',
            top: '58%',
            width: `${viewerProgress * 70}%`,
            height: 3,
            background: 'linear-gradient(90deg, rgba(59,130,246,0.9), rgba(34,211,238,0.9))',
            boxShadow: '0 0 14px rgba(59,130,246,0.7)',
          }}
        />
      )}

      {focusRing > 0 && (
        <div
          className="absolute rounded-full"
          style={{
            left: '50%',
            top: '48%',
            width: 320 * focusRing,
            height: 320 * focusRing,
            transform: 'translate(-50%, -50%)',
            border: '2px solid rgba(168,85,247,0.5)',
            boxShadow: '0 0 60px rgba(168,85,247,0.35)',
            opacity: focusRing,
          }}
        />
      )}

      {finalBalance > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${finalBalance * 0.12}), transparent 60%)`,
          }}
        />
      )}

      <AbsoluteFill
        style={{
          background: 'linear-gradient(100deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)',
          transform: `translateX(${sweepX}%)`,
          opacity: sweepOpacity,
          mixBlendMode: 'screen',
        }}
      />

      {t > 0.3 && (
        <>
          <AbsoluteFill
            style={{
              transform: `translateX(${-rgbOffset}px)`,
              mixBlendMode: 'screen',
              background: 'rgba(255,0,60,0.08)',
            }}
          />
          <AbsoluteFill
            style={{
              transform: `translateX(${rgbOffset}px)`,
              mixBlendMode: 'screen',
              background: 'rgba(0,180,255,0.08)',
            }}
          />
        </>
      )}

      <AbsoluteFill className="flex items-center justify-center px-10">
        {WORDS.map((w) => {
          const local = frame - w.start;
          const dur = w.end - w.start;
          if (frame < w.start || frame >= w.end) return null;

          const entrance = spring({
            frame: local,
            fps,
            config: { damping: 14, stiffness: 220, mass: 0.5 },
          });

          const wordBlur = interpolate(local, [0, dur * 0.5], [16, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const momentumX =
            w.section === 'movement'
              ? interpolate(local, [0, dur], [-90, 0], { extrapolateRight: 'clamp' })
              : 0;

          const scale =
            w.section === 'emotion'
              ? entrance * breathe
              : w.section === 'result'
              ? entrance * (1 + resultReveal * 0.06)
              : entrance;

          const rotate = interpolate(local, [0, dur * 0.4], [w.section === 'movement' ? -8 : 3, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const color =
            w.section === 'result' ? '#bbf7d0' : w.section === 'emotion' ? '#fde68a' : '#ffffff';

          const glow =
            w.section === 'result'
              ? '0 0 30px rgba(74,222,128,0.7)'
              : w.section === 'emotion'
              ? '0 0 26px rgba(251,191,36,0.5)'
              : '0 0 22px rgba(96,165,250,0.5)';

          return (
            <div
              key={w.text}
              className="absolute font-black text-center tracking-tight"
              style={{
                fontSize: w.size,
                fontWeight: w.weight,
                color,
                transform: `translateX(${momentumX}px) scale(${scale}) rotate(${rotate}deg)`,
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

export default Sequence4RetentionStarters;

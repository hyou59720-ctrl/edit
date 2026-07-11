import React, { useMemo } from 'react';
import { AbsoluteFill, spring, interpolate, Easing, useCurrentFrame, random } from 'remotion';

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ---------- Background (ቀላል gradient + few glow orbs) ----------
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = (frame * 0.1) % 360;

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(circle at 30% 30%, rgba(56,189,248,0.12), transparent 55%),
          radial-gradient(circle at 75% 70%, rgba(168,85,247,0.1), transparent 55%),
          linear-gradient(${shift}deg, #020617, #0f172a 45%, #020617)
        `,
      }}
    />
  );
};

// ---------- Particles (ቀላል፣ 40 ብቻ) ----------
type ParticleDef = { x: number; y: number; size: number; speed: number; opacity: number };

const useParticleField = (count: number): ParticleDef[] =>
  useMemo(() => {
    const arr: ParticleDef[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: random(`px-${i}`) * 100,
        y: random(`py-${i}`) * 100,
        size: 1 + random(`ps-${i}`) * 2.5,
        speed: 0.15 + random(`pv-${i}`) * 0.4,
        opacity: 0.15 + random(`po-${i}`) * 0.4,
      });
    }
    return arr;
  }, [count]);

export const Particles: React.FC<{ count?: number }> = ({ count = 40 }) => {
  const frame = useCurrentFrame();
  const particles = useParticleField(count);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {particles.map((p, i) => {
        const y = (p.y - frame * p.speed * 0.15) % 110;
        const yWrapped = y < -10 ? y + 120 : y;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${yWrapped}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: `rgba(180,220,255,${p.opacity})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Camera (parallax zoom/pan) ----------
interface CameraProps {
  children: React.ReactNode;
  zoomFrom?: number;
  zoomTo?: number;
  panXFrom?: number;
  panXTo?: number;
  panYFrom?: number;
  panYTo?: number;
  durationInFrames: number;
}

export const Camera: React.FC<CameraProps> = ({
  children,
  zoomFrom = 1,
  zoomTo = 1.05,
  panXFrom = 0,
  panXTo = 0,
  panYFrom = 0,
  panYTo = 0,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });

  const scale = interpolate(t, [0, 1], [zoomFrom, zoomTo]);
  const panX = interpolate(t, [0, 1], [panXFrom, panXTo]);
  const panY = interpolate(t, [0, 1], [panYFrom, panYTo]);

  return (
    <AbsoluteFill style={{ transform: `scale(${scale}) translate(${panX}px, ${panY}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

// ---------- Scene fade transition (blur ተነስቷል፣ opacity+scale ብቻ) ----------
export const SceneTransition: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  transitionFrames?: number;
}> = ({ children, durationInFrames, transitionFrames = 15 }) => {
  const frame = useCurrentFrame();

  const opacityIn = interpolate(frame, [0, transitionFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacityOut = interpolate(
    frame,
    [durationInFrames - transitionFrames, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const opacity = Math.min(opacityIn, opacityOut);

  const scaleIn = interpolate(frame, [0, transitionFrames], [1.03, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return <AbsoluteFill style={{ opacity, transform: `scale(${scaleIn})` }}>{children}</AbsoluteFill>;
};

// ---------- Glass Panel ----------
export const GlassPanel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 24,
      boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------- Progress Ring ----------
export const ProgressRing: React.FC<{ progress: number; size?: number; color?: string; label?: string }> = ({
  progress,
  size = 110,
  color = '#38bdf8',
  label,
}) => {
  const r = size / 2 - 8;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * clamp01(progress);

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={6} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <span style={{ color: 'white', fontSize: 22, fontWeight: 700 }}>{Math.round(clamp01(progress) * 100)}%</span>
        {label && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 1 }}>{label}</span>}
      </div>
    </div>
  );
};

// ---------- Mini Bar Chart ----------
export const MiniBarChart: React.FC<{ frame: number; startFrame: number; fps: number }> = ({ frame, startFrame, fps }) => {
  const bars = [0.4, 0.75, 0.55, 0.9, 0.65, 0.8];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
      {bars.map((h, i) => {
        const s = spring({ frame: frame - startFrame - i * 3, fps, config: { damping: 12, mass: 0.4 } });
        return (
          <div
            key={i}
            style={{
              width: 8,
              height: Math.max(2, h * 60 * clamp01(s)),
              borderRadius: 3,
              background: 'linear-gradient(to top, #38bdf8, #818cf8)',
            }}
          />
        );
      })}
    </div>
  );
};
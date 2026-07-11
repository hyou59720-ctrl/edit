import { AbsoluteFill } from 'remotion';
import React from 'react';

const GREEN = '#6CBE45';
const GREEN_LIGHT = '#cdf1bb';
const GREEN_MID = '#6CBE45';
const GOLD = '#F9A825';

interface BackgroundProps {
  children?: React.ReactNode;
  /** 1 = fully visible background, 0 = fully dimmed (used during scene exit transitions) */
  bgExitOpacity?: number;
}

const GlassOrb: React.FC<{ x: string; y: string; size: number; color: string; blur: number; opacity: number }> = ({
  x, y, size, color, blur, opacity,
}) => {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: color,
        filter: `blur(${blur}px)`,
        opacity,
      }}
    />
  );
};

export const PremiumTelebirrBackground: React.FC<BackgroundProps> = ({
  children,
  bgExitOpacity = 1,
}) => {
  const dimOpacity = 1 - bgExitOpacity;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 20%, ${GREEN_MID} 0%, ${GREEN} 45%, #6CBE45 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Cinematic Glass Orbs (የማይንቀሳቀሱ የብርሃን ክበቦች) */}
      <GlassOrb x="8%" y="10%" size={420} color={GREEN_LIGHT} blur={130} opacity={0.28} />
      <GlassOrb x="70%" y="6%" size={340} color={GOLD} blur={120} opacity={0.22} />
      <GlassOrb x="-6%" y="65%" size={380} color={GOLD} blur={130} opacity={0.18} />
      <GlassOrb x="72%" y="70%" size={460} color={GREEN_LIGHT} blur={140} opacity={0.24} />

      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(6,23,10,0.55) 100%)' }}
      />

      {/* Floating Sparkles/Particles (የማይንቀሳቀሱ ነጥቦች) */}
      {Array.from({ length: 22 }).map((_, i) => {
        const seedX = (i * 137) % 100;
        const seedY = (i * 71) % 100;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${seedX}%`,
              top: `${seedY}%`,
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              opacity: 0.2,
            }}
          />
        );
      })}

      {/* 3D Glass Cards on Background (የማይንቀሳቀሱ የጀርባ ካርዶች) */}
      <div
        className="absolute rounded-3xl"
        style={{
          left: '8%',
          top: '14%',
          width: 150,
          height: 96,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          transform: 'rotate(-8deg)',
        }}
      />
      <div
        className="absolute rounded-3xl"
        style={{
          right: '9%',
          bottom: '16%',
          width: 130,
          height: 82,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          transform: 'rotate(7deg)',
        }}
      />

      {/* Main Content Render */}
      {children}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)' }}
      />

      {/* Exit dim overlay — fades the whole background to black as bgExitOpacity → 0 */}
      {dimOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: '#000', opacity: dimOpacity * 0.7 }}
        />
      )}
    </AbsoluteFill>
  );
};

export default PremiumTelebirrBackground;
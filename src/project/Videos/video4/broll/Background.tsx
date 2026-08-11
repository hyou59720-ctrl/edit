import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';

const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // --------------------------------------------------
  // BACKGROUND MOTION
  // --------------------------------------------------
  const glowScale = interpolate(frame, [0, 60, 115], [0.85, 1.15, 1], {
    easing: Easing.inOut(Easing.ease),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const glowOpacity = interpolate(frame, [0, 20, 100, 115], [0, 0.9, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Rotating conic sweep (slow, cinematic)
  const rotation = interpolate(frame, [0, 300], [0, 360], {
    extrapolateRight: 'extend',
  });

  // Floating particles drift
  const drift1 = interpolate(frame, [0, 150], [0, -60], {
    extrapolateRight: 'extend',
    easing: Easing.inOut(Easing.ease),
  });
  const drift2 = interpolate(frame, [0, 180], [0, 50], {
    extrapolateRight: 'extend',
    easing: Easing.inOut(Easing.ease),
  });

  // Subtle pulsing grid opacity
  const gridPulse = interpolate(
    frame % 90,
    [0, 45, 90],
    [0.05, 0.12, 0.05],
    { easing: Easing.inOut(Easing.ease) }
  );

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, #000000 0%, #050b18 30%, #0a1a33 55%, #0d2447 75%, #0b1a33 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Rotating blue conic glow behind everything */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1400px',
          height: '1400px',
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          background:
            'conic-gradient(from 0deg, rgba(59,130,246,0.0) 0%, rgba(37,99,235,0.15) 25%, rgba(59,130,246,0.0) 50%, rgba(96,165,250,0.12) 75%, rgba(59,130,246,0.0) 100%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Main soft blue light - pulsing */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          width: '900px',
          height: '900px',
          transform: `translate(-50%, -50%) scale(${glowScale})`,
          background:
            'radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(37,99,235,0.15) 35%, transparent 70%)',
          opacity: glowOpacity,
          filter: 'blur(50px)',
        }}
      />

      {/* Top secondary light */}
      <div
        style={{
          position: 'absolute',
          top: `${-10 + drift1 * 0.05}%`,
          left: '50%',
          width: '700px',
          height: '700px',
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(circle, rgba(96,165,250,0.25), transparent 68%)',
          filter: 'blur(65px)',
        }}
      />

      {/* Bottom black vignette light */}
      <div
        style={{
          position: 'absolute',
          bottom: `${-15 + drift2 * 0.05}%`,
          left: '50%',
          width: '800px',
          height: '800px',
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(circle, rgba(0,0,0,0.55), transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Floating particle 1 */}
      <div
        style={{
          position: 'absolute',
          top: `20%`,
          left: `15%`,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#ffffff',
          opacity: 0.6,
          transform: `translateY(${drift1}px)`,
          boxShadow: '0 0 20px 4px rgba(255,255,255,0.5)',
        }}
      />

      {/* Floating particle 2 */}
      <div
        style={{
          position: 'absolute',
          top: `65%`,
          left: `78%`,
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: '#60a5fa',
          opacity: 0.8,
          transform: `translateY(${drift2}px)`,
          boxShadow: '0 0 18px 5px rgba(96,165,250,0.6)',
        }}
      />

      {/* Floating particle 3 */}
      <div
        style={{
          position: 'absolute',
          top: `40%`,
          left: `85%`,
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: '#ffffff',
          opacity: 0.5,
          transform: `translateY(${drift1 * -0.6}px)`,
          boxShadow: '0 0 14px 3px rgba(255,255,255,0.4)',
        }}
      />

      {/* Fine grid overlay for texture / "pro edit" feel */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: gridPulse,
        }}
      />

      {/* Top-to-bottom black fade for text safety */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 20%, transparent 75%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

export default Background;
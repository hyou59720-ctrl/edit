import React from 'react';
import { AbsoluteFill, spring, interpolate, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, SceneTransition } from './Helpers';

const DURATION = 112;

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 16, stiffness: 90, mass: 0.6 } });
  const titleY = interpolate(titleSpring, [0, 1], [50, 0]);
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const subOpacity = interpolate(frame, [18, 38], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subY = interpolate(frame, [18, 38], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const lineWidth = interpolate(frame, [10, 40], [0, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneTransition durationInFrames={DURATION}>
      <Camera durationInFrames={DURATION} zoomFrom={1.08} zoomTo={1} panYFrom={15} panYTo={0}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: lineWidth,
              height: 2,
              background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)',
              marginBottom: 28,
            }}
          />
          <h1
            style={{
              color: 'white',
              fontSize: 108,
              fontWeight: 800,
              letterSpacing: -4,
              margin: 0,
              transform: `translateY(${titleY}px)`,
              opacity: titleOpacity,
              textShadow: '0 0 40px rgba(56,189,248,0.35)',
            }}
          >
            NEXT GEN
          </h1>
          <p
            style={{
              color: '#7dd3fc',
              fontSize: 26,
              marginTop: 18,
              letterSpacing: 6,
              textTransform: 'uppercase',
              opacity: subOpacity,
              transform: `translateY(${subY}px)`,
            }}
          >
            Elevated Digital Experiences
          </p>
        </AbsoluteFill>
      </Camera>
    </SceneTransition>
  );
};
import React from 'react';
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, SceneTransition } from './Helpers';

const DURATION = 114;

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btnSpring = spring({ frame, fps, config: { damping: 12, stiffness: 140, mass: 0.5 } });
  const btnScale = interpolate(btnSpring, [0, 1], [0.6, 1]);

  return (
    <SceneTransition durationInFrames={DURATION}>
      <Camera durationInFrames={DURATION} zoomFrom={1} zoomTo={1.08}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              background: 'white',
              color: '#020617',
              padding: '26px 64px',
              borderRadius: 999,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 1,
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              transform: `scale(${btnScale})`,
            }}
          >
            Get Started
          </div>
        </AbsoluteFill>
      </Camera>
    </SceneTransition>
  );
};
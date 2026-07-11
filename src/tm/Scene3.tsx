import React from 'react';
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, SceneTransition } from './Helpers';

const DURATION = 112;

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = spring({ frame, fps, config: { damping: 16 } });

  const ring1Rotate = frame * 0.5;
  const ring2Rotate = -frame * 0.8;

  const textOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <SceneTransition durationInFrames={DURATION}>
      <Camera durationInFrames={DURATION} zoomFrom={0.95} zoomTo={1}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              position: 'relative',
              width: 420,
              height: 420,
              transform: `scale(${interpolate(intro, [0, 1], [0.7, 1])})`,
              opacity: intro,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid rgba(56,189,248,0.35)',
                transform: `rotate(${ring1Rotate}deg)`,
                borderTopColor: '#38bdf8',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 60,
                borderRadius: '50%',
                border: '2px dashed rgba(168,85,247,0.4)',
                transform: `rotate(${ring2Rotate}deg)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: 44,
                  fontWeight: 300,
                  letterSpacing: 4,
                  margin: 0,
                  opacity: textOpacity,
                  textTransform: 'uppercase',
                }}
              >
                Innovation
              </h3>
              <div style={{ width: 60, height: 1, background: 'rgba(255,255,255,0.3)', margin: '14px 0', opacity: textOpacity }} />
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, letterSpacing: 2, opacity: textOpacity }}>
                ENGINEERED FOR SCALE
              </p>
            </div>
          </div>
        </AbsoluteFill>
      </Camera>
    </SceneTransition>
  );
};
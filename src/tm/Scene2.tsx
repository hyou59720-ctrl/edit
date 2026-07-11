import React from 'react';
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, SceneTransition, GlassPanel, ProgressRing, MiniBarChart } from './Helpers';

const DURATION = 112;

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const panelSpring = spring({ frame, fps, config: { damping: 18, mass: 0.7 } });
  const panelY = interpolate(panelSpring, [0, 1], [70, 0]);
  const panelOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const ring1 = interpolate(frame, [15, 55], [0, 0.82], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ring2 = interpolate(frame, [20, 60], [0, 0.64], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneTransition durationInFrames={DURATION}>
      <Camera durationInFrames={DURATION} zoomFrom={1} zoomTo={1.03} panXFrom={-8} panXTo={8}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: 60 }}>
          <GlassPanel style={{ width: 980, padding: 48, transform: `translateY(${panelY}px)`, opacity: panelOpacity }}>
            <h2 style={{ color: 'white', fontSize: 42, fontWeight: 700, margin: '0 0 32px 0', letterSpacing: -1 }}>
              Real-Time Insights
            </h2>
            <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
              <ProgressRing progress={ring1} color="#38bdf8" label="UPTIME" />
              <ProgressRing progress={ring2} color="#a855f7" label="SPEED" />
              <div style={{ flex: 1 }}>
                <MiniBarChart frame={frame} startFrame={20} fps={fps} />
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 12, letterSpacing: 2 }}>
                  WEEKLY PERFORMANCE
                </p>
              </div>
            </div>
          </GlassPanel>
        </AbsoluteFill>
      </Camera>
    </SceneTransition>
  );
};
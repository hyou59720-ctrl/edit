import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';

import Sequence1Hook from './sequences/Sequence1Hook';
import Sequence2Problem from './sequences/Sequence2Problem';
import Sequence3SecretRule from './sequences/Sequence3SecretRule';
import Sequence4RetentionStarters from './sequences/Sequence4RetentionStarters';
import Sequence5SmallEdits from './sequences/Sequence5SmallEdits';
import Sequence6FinalCTA from './sequences/Sequence6FinalCTA';

// Master composition — 25fps, 1080x1920, total 726 frames (~29.04s)
// Each child sequence receives LOCAL frames (0 = its own start),
// which is exactly how <Sequence> already works in Remotion.

export const TiktokSynchronizedVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Audio Source — spans the entire video */}
      <Audio src={staticFile('edit.mp3')} />

      {/* SEQUENCE 1 — THE HOOK (0–85) */}
      <Sequence from={0} durationInFrames={85}>
        <Sequence1Hook />
      </Sequence>

      {/* SEQUENCE 2 — THE PROBLEM (85–195) */}
      <Sequence from={85} durationInFrames={110}>
        <Sequence2Problem />
      </Sequence>

      {/* SEQUENCE 3 — THE SECRET RULE (195–315) */}
      <Sequence from={195} durationInFrames={120}>
        <Sequence3SecretRule />
      </Sequence>

      {/* SEQUENCE 4 — RETENTION STARTERS (315–490) */}
      <Sequence from={315} durationInFrames={175}>
        <Sequence4RetentionStarters />
      </Sequence>

      {/* SEQUENCE 5 — SMALL EDITS, BIG IMPACT (490–610) */}
      <Sequence from={490} durationInFrames={120}>
        <Sequence5SmallEdits />
      </Sequence>

      {/* SEQUENCE 6 — FINAL CTA (610–726) */}
      <Sequence from={610} durationInFrames={116}>
        <Sequence6FinalCTA />
      </Sequence>
    </AbsoluteFill>
  );
};

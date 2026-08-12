import React from 'react';
import {
  AbsoluteFill,
  Video,
  staticFile,
  useCurrentFrame,
  interpolate,
} from 'remotion';

const mainContainerStyle: React.CSSProperties = {
  backgroundColor: '#000000', // 🌟 ጥቁር ጀርባ
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
};

const PdfCoverAnimationBroll: React.FC = () => {
  const frame = useCurrentFrame();

  // 🌟 አጠቃላይ ለስላሳ መግቢያ እና መውጫ (Fade In & Fade Out)
  const opacity = interpolate(frame, [0, 15, 45, 56], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ ...mainContainerStyle, opacity }}>
      
      {/* 🌟 1. ያዘጋጀኸው የ AI PDF ቪዲዮ (pdf.mp4) */}
      <Video
        src={staticFile('pdf.mp4')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain', // 🌟 ቪዲዮው ሳይበላሽ ሙሉ በሙሉ እንዲታይ
        }}
        muted
      />

      {/* 🌟 2. ከላይ እና ከታች ለስላሳ ጥቁር የጥላ ሽፋን (Top & Bottom Fade Overlay) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, transparent 20%, transparent 80%, rgba(0, 0, 0, 0.85) 100%)',
          pointerEvents: 'none',
        }}
      />

    </AbsoluteFill>
  );
};

export default PdfCoverAnimationBroll;

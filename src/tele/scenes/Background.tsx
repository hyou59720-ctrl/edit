import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import React from 'react';

const PremiumTelebirrBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();

  const blob1X = interpolate(frame, [0, 300], [0, 50]);
  const blob1Y = interpolate(frame % 200, [0, 200], [-20, 20]);
  const blob2X = interpolate(frame % 250, [0, 250], [30, -30]);
  const blob2Y = interpolate(frame, [0, 300], [0, -35]);
  const gridDrift = interpolate(frame, [0, 600], [0, -60]);

  return (
    <AbsoluteFill className="bg-gradient-to-b from-white via-[#F7FBF5] to-[#EFF7EC] overflow-hidden">
      {/* ስስ አረንጓዴ blur blob - ከላይ ቀኝ */}
      <div
        className="absolute w-[550px] h-[550px] rounded-full bg-[#6CBE45] blur-[140px] opacity-[0.18]"
        style={{ top: `-20%`, right: `-15%`, transform: `translate(${blob1X}px, ${blob1Y}px)` }}
      />

      {/* ስስ ብጫ blur blob - ከታች ግራ */}
      <div
        className="absolute w-[480px] h-[480px] rounded-full bg-[#FDB813] blur-[130px] opacity-[0.15]"
        style={{ bottom: `-15%`, left: `-15%`, transform: `translate(${blob2X}px, ${blob2Y}px)` }}
      />

      {/* ጥቁር አረንጓዴ ትንሽ accent blob - መሃል ላይኛው */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full bg-[#2E7D32] blur-[120px] opacity-[0.08]"
        style={{ top: '30%', left: '65%' }}
      />

      {/* ስስ dot-grid - ዘመናዊ digital/fintech ስሜት */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, #2E7D32 1.5px, transparent 1.5px)',
          backgroundSize: '36px 36px',
          transform: `translateY(${gridDrift}px)`,
        }}
      />

      {/* ስስ diagonal ብርሃን ray */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-[#6CBE45]/[0.03] to-white/0" />

      {/* ከላይ/ከታች ስስ ጥላ ለ depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] via-transparent to-black/[0.04]" />

      {/* ስር ደማቅ አረንጓዴ underline strip - telebirr የታወቀ signature */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-[#2E7D32] via-[#6CBE45] to-[#FDB813]" />

      {children && <AbsoluteFill className="flex items-center justify-center px-8">{children}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

export default PremiumTelebirrBackground;
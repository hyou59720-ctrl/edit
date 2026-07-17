import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";

export const TitleWord: React.FC<{
  word: string;
  delay: number;
  rotate?: number;
  underline?: boolean;
}> = ({ word, delay, rotate = -2, underline = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });

  const translateY = (1 - entry) * 60;
  const opacity = Math.min(1, Math.max(0, entry));
  const wiggle = Math.sin(frame / 50 + delay) * 0.6;

  return (
    <div
      className="relative inline-block px-6 py-2 bg-[#f8f3e6] mx-1"
      style={{
        opacity,
        transform: `translateY(${translateY}px) rotate(${rotate + wiggle}deg)`,
        boxShadow: "0 8px 16px rgba(30,20,5,0.25)",
        clipPath:
          "polygon(2% 8%, 20% 0%, 45% 4%, 70% 0%, 98% 6%, 100% 40%, 96% 70%, 100% 96%, 75% 100%, 50% 96%, 22% 100%, 0% 92%, 4% 55%)",
      }}
    >
      <span
        className="font-serif font-black text-black tracking-tight"
        style={{ fontSize: 64, lineHeight: 1 }}
      >
        {word}
      </span>
      {underline && (
        <div
          className="absolute left-2 right-2 h-3 bg-[#e8b23d] -z-10"
          style={{ bottom: 6, transform: "rotate(-1deg)" }}
        />
      )}
    </div>
  );
};

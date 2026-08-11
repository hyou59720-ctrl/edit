import React from "react";
import { AbsoluteFill } from "remotion"; 

export const Glow = ({
  children,
  intensity = 20,
  fullScreen = false,
  color = "rgba(255,255,255,0.9)", // 1. የከለር ምርጫ ተጨምሯል (ምንም ካልተሰጠ ነጭ ይሆናል)
}: {
  children: React.ReactNode;
  intensity?: number;
  fullScreen?: boolean;
  color?: string; // 2. ታይፕ (Type) ተጨምሯል
}) => {
  // 3. እዚህ ጋር ነጭ የነበረውን ወደ ${color} ቀይረነዋል
  const glowFilter = `drop-shadow(0 0 ${intensity}px ${color})`;

  if (fullScreen) {
    return (
      <AbsoluteFill
        style={{
          filter: glowFilter,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  return (
    <div
      style={{
        display: "inline-block",
        filter: glowFilter,
      }}
    >
      {children}
    </div>
  );
};

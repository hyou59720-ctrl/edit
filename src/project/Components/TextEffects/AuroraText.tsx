"use client";

import React from "react";
import type { TextEffectProps } from "./types";

export default function AuroraText({
  children,
  colors = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#3b82f6",
  ],
  speed = 6,
  direction = 135,
  backgroundSize = 300,
  intensity = 0.4,
  blur = 20,
}: TextEffectProps) {
  const gradientColors = colors.join(", ");

  return (
    <>
      <style>{`
        @keyframes aurora-gradient {
          0% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }

          100% {
            background-position: 0% 50%;
          }
        }

        .aurora-text-effect *,
        .aurora-text-effect *::before,
        .aurora-text-effect *::after {

          background-image: linear-gradient(${direction}deg, ${gradientColors}) !important;
          background-size: ${backgroundSize}% ${backgroundSize}% !important;

          -webkit-background-clip: text !important;
          background-clip: text !important;

          -webkit-text-fill-color: transparent !important;
          color: transparent !important;

          animation: aurora-gradient ${speed}s ease infinite !important;

          filter: drop-shadow(
            0 0 ${blur}px rgba(139,92,246,${intensity})
          ) !important;
        }
      `}</style>

      <div className="aurora-text-effect">
        {children}
      </div>
    </>
  );
}
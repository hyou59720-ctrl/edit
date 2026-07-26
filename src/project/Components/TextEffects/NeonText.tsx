"use client";

import React from "react";
// import type { TextEffectProps } from "./types";

export interface TextEffectProps {
  children: React.ReactNode;
  colors?: string[];
  glowBlur?: number;
  glowIntensity?: number;
  strokeWidth?: number;
  animationSpeed?: number;
}

export default function NeonText({
  children,
  colors = ["#0ea5e9", "#0284c7", "#ffffff"],
  glowBlur = 10,
  glowIntensity = 1,
  strokeWidth = 0, // <--- እዚህ ጋር ከ 1 ወደ 0 ተቀይሯል
  animationSpeed = 3,
}: TextEffectProps) {
  const [
    mainColor = "#0ea5e9",
    outerGlowColor = "#0284c7",
    strokeColor = "#ffffff",
  ] = colors ?? [];

  // 1. ስሌቶችን ከ CSS አውጥተን እዚህ እናሰላለን (Lag እንዳያመጣ)
  const b1 = glowBlur * 0.2;
  const b2 = glowBlur * 1 * glowIntensity;
  const b3 = glowBlur * 3 * glowIntensity;
  const b4 = glowBlur * 6 * glowIntensity;

  const animationRule =
    animationSpeed > 0
      ? `animation: neon-flicker ${animationSpeed}s infinite alternate;`
      : "";

  return (
    <>
      <style>{`
        @keyframes neon-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow:
              0 0 ${b1}px #fff,
              0 0 ${b2}px ${mainColor},
              0 0 ${b3}px ${mainColor},
              0 0 ${b4}px ${outerGlowColor};
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
          }
          20%, 24%, 55% {
            /* Dimmed state (ቀላል ሻዶ ብቻ) */
            text-shadow: 
              0 0 ${b1}px ${mainColor}; 
            color: ${outerGlowColor} !important;
            -webkit-text-fill-color: ${outerGlowColor} !important;
          }
        }

        .neon-text-effect,
        .neon-text-effect * {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          -webkit-text-stroke: ${strokeWidth}px ${strokeColor};
          
          text-shadow:
            0 0 ${b1}px #fff,
            0 0 ${b2}px ${mainColor},
            0 0 ${b3}px ${mainColor},
            0 0 ${b4}px ${outerGlowColor};
            
          ${animationRule}
          
          /* 2. Performance መጨመሪያ */
          will-change: text-shadow, color; 
        }
      `}</style>

      <div className="neon-text-effect">
        {children}
      </div>
    </>
  );
}

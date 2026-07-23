"use client";

import React from "react";
import type { TextEffectProps } from "./types";

export default function FireText({
  children,
  colors = ["#ffcc00", "#ff5500", "#ff0000"], // Yellow, Orange, Red
  glowBlur = 10,
  glowIntensity = 1,
  strokeWidth = 1,
  animationSpeed = 0.5,
}: TextEffectProps) {
  const [
    mainColor = "#ffcc00",   // የቴክስቱ ዋና ብሩህ ከለር (ቢጫ/ብርቱካናማ)
    shadowColor = "#ff3300", // የእሳቱ የውጪ ጥላ ከለር
    strokeColor = "#330000", // የጠርዝ ከለር
  ] = colors ?? [];

  const animationRule =
    animationSpeed > 0
      ? `animation: fire-glow ${animationSpeed}s ease-in-out infinite alternate;`
      : "";

  return (
    <>
      <style>{`
        @keyframes fire-glow {
          0% {
            text-shadow:
              0 0 5px ${mainColor},
              0 0 10px ${shadowColor},
              0 0 15px #ff0000;
          }
          100% {
            text-shadow:
              0 0 10px ${mainColor},
              0 0 20px ${shadowColor},
              0 0 30px #ff0000;
          }
        }

        .fire-text-effect,
        .fire-text-effect * {
          display: inline-flex !important;
          white-space: nowrap !important;
          align-items: center;
          
          color: ${mainColor} !important;
          -webkit-text-fill-color: ${mainColor} !important;
          -webkit-text-stroke: ${strokeWidth}px ${strokeColor} !important;
          
          text-shadow:
            0 0 5px ${mainColor},
            0 0 10px ${shadowColor},
            0 0 20px #ff0000;
            
          ${animationRule}
          will-change: text-shadow;
        }
      `}</style>

      <div className="fire-text-effect">
        {children}
      </div>
    </>
  );
}

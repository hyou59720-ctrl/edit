"use client";

import React from "react";
import type { TextEffectProps } from "./types";

export default function RetroVintageText({
  children,
  colors = ["#227b85", "#113f44", "#ffffff"],
}: TextEffectProps) {
  const [
    mainColor = "#227b85",     // የቴክስቱ ዋና ቱርኩዋዝ/ሰማያዊ ከለር
    shadowColor = "#113f44",   // የጥላው ጠቆር ያለ ከለር
    strokeColor = "#ffffff",   // የውስጥ/ውጪ መስመር ከለር
  ] = colors ?? [];

  return (
    <>
      <style>{`
        .retro-vintage-text-effect,
        .retro-vintage-text-effect * {
          color: ${mainColor} !important;
          -webkit-text-fill-color: ${mainColor} !important;
          -webkit-text-stroke: 1px ${strokeColor};
          
          /* የሬትሮ ክላሲክ 3D የግራ-ታች ጥላ ስታይል */
          text-shadow:
            1px 1px 0 ${shadowColor},
            2px 2px 0 ${shadowColor},
            3px 3px 0 ${shadowColor},
            4px 4px 0 ${shadowColor},
            5px 5px 0 ${shadowColor},
            6px 6px 0 ${shadowColor},
            7px 7px 0 ${shadowColor},
            8px 8px 10px rgba(0, 0, 0, 0.4);
        }
      `}</style>

      <div className="retro-vintage-text-effect">
        {children}
      </div>
    </>
  );
}


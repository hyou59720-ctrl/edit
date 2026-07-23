"use client";

import React from "react";
import type { TextEffectProps } from "./types";

export default function FourColorText({
  children,
  colors = [
    "#ff007f", // 1. ደማቅ ሮዝ
    "#ffaa00", // 2. ብርቱካናማ
    "#00ffaa", // 3. አረንጓዴ
    "#00aaff", // 4. ሰማያዊ
  ],
}: TextEffectProps) {
  const [
    color1 = "#ff007f",
    color2 = "#ffaa00",
    color3 = "#00ffaa",
    color4 = "#00aaff",
  ] = colors ?? [];

  return (
    <>
      <style>{`
        .four-color-text-effect {
          display: inline-flex !important;
          white-space: nowrap !important;
          align-items: center;
        }

        .four-color-text-effect * {
          display: inline-block !important;
          font-weight: 800 !important;

          /* 4ቱን ቀለማት ከግራ ወደ ቀኝ ማዋሃድ */
          background: linear-gradient(
            90deg,
            ${color1} 0%,
            ${color2} 33%,
            ${color3} 66%,
            ${color4} 100%
          ) !important;
          background-size: 100% 100% !important;
          
          -webkit-background-clip: text !important;
          background-clip: text !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;

          /* የውስጥ መስመሮች (Artifacts) እንዳይመጡ stroke ተነስቷል */
          -webkit-text-stroke: 0px transparent !important;

          /* ቴክስቱ ከቪዲዮው ላይ ጎልቶ እንዲታይ የሚያደርግ ንፁህ ጥላ */
          filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.7)) !important;
        }
      `}</style>

      <div className="four-color-text-effect">
        {children}
      </div>
    </>
  );
}

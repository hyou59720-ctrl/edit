"use client";

import React from "react";
import type { TextEffectProps } from "./types";

export default function TwoColorText({
  children,
  colors = [
    "#ffaa00", // 1. የላይኛው ከለር (Top Color) - ምሳሌ: ነጭ
    "#593b00", // 2. የታችኛው ከለር (Bottom Color) - ምሳሌ: ብርቱካናማ/ቢጫ
  ],
}: TextEffectProps) {
  const [
    color1 = "#000000", // ከላይ
    color2 = "#ffaa00", // ከታች
  ] = colors ?? [];

  return (
    <>
      <style>{`
        .two-color-text-effect {
          display: inline-flex !important;
          white-space: nowrap !important;
          align-items: center;
        }

        .two-color-text-effect * {
          display: inline-block !important;
          font-weight: 800 !important;

          /* 2ቱን ቀለማት ከላይ ወደ ታች (180deg) ማዋሃድ */
          background: linear-gradient(
            180deg,
            ${color1} 0%,
            ${color1} 40%,
            ${color2} 60%,
            ${color2} 100%
          ) !important;
          background-size: 100% 100% !important;
          
          /* ከለሩን ወደ ቴክስቱ ውስጥ ብቻ ማስገባት */
          -webkit-background-clip: text !important;
          background-clip: text !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;

          /* ፊደላቱ እንዳይቆራረጡ እና ንፁህ እንዲሆኑ stroke ተነስቷል */
          -webkit-text-stroke: 0px transparent !important;

          /* ቴክስቱ በደንብ ጎልቶ እንዲታይ ጥቁር ጥላ */
          filter: drop-shadow(2px 3px 6px rgba(0, 0, 0, 0.7)) !important;
        }
      `}</style>

      <div className="two-color-text-effect">
        {children}
      </div>
    </>
  );
}

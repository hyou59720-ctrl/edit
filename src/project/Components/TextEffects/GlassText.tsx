"use client";

import React from "react";
import type { TextEffectProps } from "./types";

export default function GlassText({
  children,
  colors = [
    "#ffffff", // ቀላል highlight
    "#c7d3dc", // መካከለኛ ግራጫ-ሰማያዊ
    "#7c8a94", // ጥቁር ግራጫ (ጥልቀት)
    "#ffffff", // ዝቅተኛ highlight
  ],
  strokeWidth = 1.5,
}: TextEffectProps) {
  const [
    c1 = "#ffffff",
    c2 = "#c7d3dc",
    c3 = "#7c8a94",
    c4 = "#ffffff",
  ] = colors ?? [];

  return (
    <>
      <style>{`
        .glass-text-effect {
          display: inline-flex !important;
          white-space: nowrap !important;
          align-items: center;
          
          /* ቴክስቱን ከግራ ጠርዝ ገፋ አድርጎ ወደ መሃል እንዲገባ ያደርገዋል */
          margin-left: 40px !important; 
        }

        .glass-text-effect * {
          display: inline-block !important;
          font-weight: 800 !important;

          /* የመስታወት/ብረት ገጽታ የሚሰጥ gradient fill */
          background: linear-gradient(
            180deg,
            ${c1} 0%,
            ${c2} 20%,
            ${c3} 45%,
            ${c2} 55%,
            #ffffff 65%,
            ${c3} 80%,
            ${c4} 100%
          ) !important;
          background-size: 100% 100% !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;

          /* ግልጽ የመስታወት ጠርዝ (edge) */
          -webkit-text-stroke: ${strokeWidth}px rgba(255,255,255,0.6) !important;

          /* ጥልቀትና ነጸብራቅ የሚሰጥ ብዙ layer shadow */
          filter:
            drop-shadow(0 1px 0 rgba(255,255,255,0.9))
            drop-shadow(0 -1px 1px rgba(0,0,0,0.4))
            drop-shadow(2px 6px 10px rgba(0,0,0,0.35))
            drop-shadow(0 0 18px rgba(255,255,255,0.25));
        }
      `}</style>

      <div className="glass-text-effect">
        {children}
      </div>
    </>
  );
}

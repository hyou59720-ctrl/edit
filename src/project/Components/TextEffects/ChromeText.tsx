"use client";

import React from "react";

export interface TextEffectProps {
  children: React.ReactNode;
  colors?: string[];
  strokeWidth?: number;
  animationSpeed?: number;
}

export default function ChromeText({
  children,
  colors = ["#ffffff", "#333333", "#b0b0b0", "#000000"], 
  strokeWidth = 1,
  animationSpeed = 4, 
}: TextEffectProps) {
  const [
    topColor = "#ffffff",       
    midColor = "#333333",       
    bottomColor = "#b0b0b0",    
  ] = colors ?? [];

  const animationRule =
    animationSpeed > 0
      ? `animation: chrome-shine ${animationSpeed}s linear infinite alternate;`
      : "";

  return (
    <>
      <style>{`
        @keyframes chrome-shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        .chrome-text-effect {
          display: inline-flex !important;
          white-space: nowrap !important;
          align-items: center;
        }

        .chrome-text-effect *:not(:has(*)) {
          display: inline-block !important;

          /* የክሮም (Chrome/Metal) ከለር ግራዲየንት */
          background-image: linear-gradient(
            -75deg,
            ${topColor} 0%,
            ${bottomColor} 30%,
            ${midColor} 48%,
            ${topColor} 50%,
            ${midColor} 52%,
            ${bottomColor} 70%,
            ${topColor} 100%
          ) !important;
          
          background-size: 200% auto !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          color: transparent !important;
          
          /* የመቆራረጥ ችግር እንዳይኖር stroke 0px ነው */
          -webkit-text-stroke: 0px transparent !important;

          /* ቴክስቱ በጥቁር እንዳይሸፈን እና ከቪዲዮው ላይ ጎልቶ እንዲታይ drop-shadow አድርገነዋል */
          filter: drop-shadow(1px 2px 4px rgba(0, 0, 0, 0.8)) !important;
          
          ${animationRule}
        }
      `}</style>

      <div className="chrome-text-effect">
        {children}
      </div>
    </>
  );
}

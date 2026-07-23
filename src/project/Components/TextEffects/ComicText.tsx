"use client";

import React from "react";
import type { TextEffectProps } from "./types";

export default function ComicText({
  children,
  colors = ["#facc15", "#ef4444", "#000000"],
}: TextEffectProps) {
  const [
    mainColor = "#facc15",
    shadowColor = "#ef4444",
    strokeColor = "#000000",
  ] = colors ?? [];

  return (
    <>
      <style>{`
        .comic-text-effect,
        .comic-text-effect * {
          color: ${mainColor} !important;
          -webkit-text-fill-color: ${mainColor} !important;
          -webkit-text-stroke: 2px ${strokeColor};
          text-shadow:
            3px 3px 0 ${strokeColor},
            6px 6px 0 ${shadowColor};
        }
      `}</style>

      <div className="comic-text-effect">
        {children}
      </div>
    </>
  );
}
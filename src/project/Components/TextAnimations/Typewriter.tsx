"use client";

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { TextAnimationProps } from "./types";

export default function Typewriter({
  text,
  startFrame = 0,
  endFrame = 60,
  fontSize = 48,
}: TextAnimationProps) {
  const frame = useCurrentFrame();

  const localFrame = Math.max(0, frame - startFrame);
  const duration = Math.max(1, endFrame - startFrame);

  const visibleCharacters = Math.floor(
    interpolate(
      localFrame,
      [0, duration],
      [0, text.length],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    )
  );

  return (
    <div className="absolute bottom-16 left-0 w-full flex justify-center px-4 pointer-events-none">
      <div
        className="max-w-[90%] text-center flex flex-wrap justify-center"
        style={{
          fontFamily: "'Courier New', monospace",
        }}
      >
        {text
          .slice(0, visibleCharacters)
          .split("")
          .map((char, index) => (
            <span
              key={index}
              className="inline-block whitespace-pre text-white font-bold"
              style={{
                fontSize: `${fontSize}px`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}

        <span
          style={{
            fontSize: `${fontSize}px`,
            color: "#60a5fa",
            opacity: localFrame % 15 < 7 ? 1 : 0,
            marginLeft: "0.2rem",
            fontWeight: "bold",
          }}
        >
          ▌
        </span>
      </div>
    </div>
  );
}
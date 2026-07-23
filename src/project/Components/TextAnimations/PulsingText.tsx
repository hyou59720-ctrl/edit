"use client";

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { TextAnimationProps } from "./types";

export default function PulsingText({
  text,
  speed = 24,
  stagger = 2,
  fontSize = 48,
}: TextAnimationProps) {
  const frame = useCurrentFrame();

  return (
    <div className="absolute bottom-16 left-0 w-full flex justify-center px-4 pointer-events-none">
      <div className="flex flex-wrap justify-center max-w-[90%]">
        {text.split("").map((char, i) => {
          const delay = i * stagger;

          const progress =
            ((frame - delay) % speed) / speed;

          const scale = interpolate(
            progress,
            [0, 0.5, 1],
            [1, 1.15, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const glow = interpolate(
            progress,
            [0, 0.5, 1],
            [0.15, 0.8, 0.15],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          return (
            <span
              key={i}
              className="inline-block text-white font-extrabold whitespace-pre"
              style={{
                fontSize,
                transform: `scale(${scale})`,
                textShadow: `0 0 ${glow * 25}px rgba(255,255,255,${glow})`,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}
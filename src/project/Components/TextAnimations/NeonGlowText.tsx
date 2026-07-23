"use client";

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { TextAnimationProps } from "./types";

export default function NeonGlowText({
  text,
  speed = 15,
  stagger = 2,
  fontSize = 48, // 1. fontSize ን እዚ ጋር ተቀብለናል (ነባሪው 48 ነው)
}: TextAnimationProps) {
  const frame = useCurrentFrame();

  return (
    <div className="w-full flex justify-center px-4 pointer-events-none">
      <div className="flex flex-wrap justify-center max-w-[90%]">
        {text.split("").map((char, i) => {
          const delay = i * (stagger ?? 2);

          const entrance = interpolate(
            frame - delay,
            [0, speed ?? 15],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const glow = interpolate(
            Math.sin((frame - delay) / 10),
            [-1, 1],
            [0.3, 1]
          );

          return (
            <span
              key={i}
              // 2. text-3xl, text-4xl የሚሉት የ Tailwind ክላሶች ተወግደዋል!
              className="inline-block text-white font-extrabold whitespace-pre"
              style={{
                fontSize: `${fontSize}px`, // 3. በ pixels የለካው መጠን እዚ ጋር ይተገበራል!
                opacity: entrance,
                textShadow: `
                  0 0 ${glow * 25}px rgba(0,255,255,${glow}),
                  0 0 ${glow * 50}px rgba(0,255,255,${glow * 0.5})
                `,
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

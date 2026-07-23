"use client";

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { TextAnimationProps } from "./types";

export default function FadeText({
  text,
  speed = 15,
  stagger = 2,
  fontSize = 48,
}: TextAnimationProps) {
  const frame = useCurrentFrame();

  return (
    <div className="absolute bottom-16 left-0 w-full flex justify-center px-4 pointer-events-none">
      <div className="flex flex-wrap justify-center max-w-[90%]">
        {text.split("").map((char, i) => {
          const delay = i * stagger;

          const opacity = interpolate(
            frame - delay,
            [0, speed],
            [0, 1],
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
                fontSize: `${fontSize}px`,
                opacity,
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
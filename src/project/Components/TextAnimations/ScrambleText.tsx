"use client";

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { TextAnimationProps } from "./types";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function seededChar(seed: number) {
  const x = Math.sin(seed) * 10000;
  const rand = x - Math.floor(x);
  return CHARS[Math.floor(rand * CHARS.length)];
}

export default function ScrambleText({
  text,
  speed = 0.6,
  stagger = 1,
  fontSize = 48,
  startFrame = 0,
  endFrame = 60,
}: TextAnimationProps) {
  const frame = useCurrentFrame();

  const duration = Math.max(endFrame - startFrame, 20);
  const resolveEnd = duration * speed;

  return (
    <div className="absolute bottom-16 left-0 w-full flex justify-center px-4 pointer-events-none">
      <div className="flex flex-wrap justify-center max-w-[90%]">
        {text.split("").map((char, i) => {
          const delay = i * stagger;

          const localFrame = frame - startFrame - delay;

          const resolveProgress = interpolate(
            localFrame,
            [0, resolveEnd],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const opacity = interpolate(
            localFrame,
            [0, 5],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          const displayChar =
            resolveProgress >= 1 || char === " "
              ? char
              : seededChar(localFrame * 0.5 + i * 17);

          return (
            <span
              key={i}
              className="inline-block text-white font-extrabold whitespace-pre"
              style={{
                fontSize: `${fontSize}px`,
                opacity,
              }}
            >
              {displayChar}
            </span>
          );
        })}
      </div>
    </div>
  );
}
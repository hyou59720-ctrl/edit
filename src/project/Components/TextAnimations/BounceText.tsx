"use client";

import React from "react";
import {
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

import type { TextAnimationProps } from "./types";

export default function BounceText({
  text,
  speed = 8,
  stagger = 3,
  fontSize = 48,
}: TextAnimationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute bottom-16 left-0 w-full flex justify-center px-4 pointer-events-none">
      <div className="flex flex-wrap justify-center max-w-[90%]">
        {text.split("").map((char, i) => {
          const delay = i * stagger;

          const bounce = spring({
            frame: frame - delay,
            fps,
            config: {
              damping: speed,
              stiffness: 150,
              mass: 0.6,
            },
          });

          const translateY = interpolate(
            bounce,
            [0, 1],
            [-30, 0]
          );

          const opacity = interpolate(
            frame - delay,
            [0, 6],
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
                transform: `translateY(${translateY}px)`,
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
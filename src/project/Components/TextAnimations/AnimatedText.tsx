"use client";

import React from "react";
import {
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TextAnimationProps } from "./types";

export default function AnimatedText({
  text,
  speed = 15,
  stagger = 3,
  fontSize = 48,
}: TextAnimationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
      <div className="flex flex-wrap justify-center max-w-[90%]">
        {text.split("").map((char, i) => {
          const delay = i * stagger;

          const progress = spring({
            frame: (frame - delay) * (30 / speed),
            fps,
            config: {
              damping: 12,
              stiffness: 180,
              mass: 0.5,
            },
          });

          const translateY = (1 - progress) * -60;
          const rotate = (1 - progress) * -180;

          return (
            <span
              key={i}
              className="inline-block text-white font-extrabold whitespace-pre"
              style={{
                fontSize: `${fontSize}px`,
                opacity: progress,
                transform: `translateY(${translateY}px) rotate(${rotate}deg)`,
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
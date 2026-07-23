"use client";

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { TextAnimationProps } from "./types";

export default function SlideUpBlurText({
  text,
  speed = 20,
  fontSize = 60,
}: TextAnimationProps) {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [0, speed],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const translateY = interpolate(
    progress,
    [0, 1],
    [100, 0]
  );

  const blur = interpolate(
    progress,
    [0, 1],
    [20, 0]
  );

  const opacity = progress;

  return (
    <div className="absolute bottom-16 left-0 w-full flex justify-center px-4 pointer-events-none">
      <div
        className="font-extrabold text-white text-center whitespace-pre-wrap"
        style={{
          fontSize,
          opacity,
          filter: `blur(${blur}px)`,
          transform: `translateY(${translateY}px)`,
          willChange: "transform, opacity, filter",
          maxWidth: "90%",
        }}
      >
        {text}
      </div>
    </div>
  );
}
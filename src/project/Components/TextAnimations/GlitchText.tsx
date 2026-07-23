"use client";

import React from "react";
import { useCurrentFrame } from "remotion";
import type { TextAnimationProps } from "./types";

export default function GlitchText({
  text,
  speed = 10,
  fontSize = 48,
}: TextAnimationProps) {
  const frame = useCurrentFrame();

  const glitchIntensity = Math.sin(frame / speed) * 8;
  const rgbOffset = Math.sin(frame / (speed / 2)) * 4;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        width: "100%",
        textAlign: "center",
        fontSize: `${fontSize}px`,
        fontWeight: 800,
        fontFamily: "monospace",
      }}
    >
      {/* Cyan Layer */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          color: "#00FFFF",
          transform: `translate(${rgbOffset}px, ${glitchIntensity}px)`,
          mixBlendMode: "screen",
          opacity: 0.8,
        }}
      >
        {text}
      </div>

      {/* Magenta Layer */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          color: "#FF00FF",
          transform: `translate(${-rgbOffset}px, ${-glitchIntensity}px)`,
          mixBlendMode: "screen",
          opacity: 0.8,
        }}
      >
        {text}
      </div>

      {/* Main Text */}
      <div
        style={{
          position: "relative",
          color: "#FFFFFF",
          opacity: 0.95,
        }}
      >
        {text}
      </div>
    </div>
  );
}
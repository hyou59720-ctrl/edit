"use client";

import React from "react";
import { loadFont } from "@remotion/google-fonts/CormorantGaramond";
import { Circle } from "@remotion/rough-notation";
import {
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

import type { TextAnimationProps } from "./types";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

export default function CircleMarker({
  text,
  speed = 43,
  fontSize = 48,
}: TextAnimationProps) {
  const frame = useCurrentFrame();

  return (
    <div
      className="absolute bottom-16 left-0 w-full flex justify-center items-center px-4 pointer-events-none"
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: 700,
        lineHeight: 1.2,
        color: "#ffffff",
        fontFamily,
        textAlign: "center",
      }}
    >
      <Circle
        name="Circle annotation"
        progress={interpolate(frame, [0, speed], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: [Easing.bezier(0.42, 0, 0.58, 1)],
          posterize: 4,
        })}
        seed={interpolate(frame, [0, speed * 2], [1, 90], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          posterize: 4,
        })}
        roughness={1.8}
        strokeWidth={8}
        color="#2563eb"
        padding={{
          left: 16,
          right: 16,
          top: 10,
          bottom: 10,
        }}
        box="inside"
      >
        <span>{text}</span>
      </Circle>
    </div>
  );
}
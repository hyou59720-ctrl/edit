"use client";

import React from "react";
import { loadFont } from "@remotion/google-fonts/CormorantGaramond";
import { Highlight as RoughHighlight } from "@remotion/rough-notation";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";

import type { TextAnimationProps } from "./types";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

const containerStyle: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "transparent",
};

export default function Highlight({
  text,
  speed = 25,
  fontSize = 48,
}: TextAnimationProps) {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={containerStyle}>
      <Interactive.Div
        style={{
          fontSize,
          fontWeight: 700,
          lineHeight: 1.2,
          color: "#ffffff",
          fontFamily,
          width: 1000,
          textAlign: "center",
        }}
      >
        <RoughHighlight
          name="Highlight annotation"
          progress={interpolate(frame, [0, speed], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: [
              Easing.spring({
                damping: 200,
                mass: 1,
                stiffness: 100,
                allowTail: true,
                durationRestThreshold: 0.02,
                overshootClamping: false,
              }),
            ],
          })}
          color="rgba(255,236,79,0.65)"
          maxRandomnessOffset={10}
          roughness={2.3}
          bowing={0}
          padding={{
            left: 16,
            right: 16,
            top: 8,
            bottom: 8,
          }}
        >
          {text}
        </RoughHighlight>
      </Interactive.Div>
    </AbsoluteFill>
  );
}
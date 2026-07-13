import React from "react";
import { interpolate } from "remotion";
import { VisualProps } from "../types";

/* STEP — a staircase with a ball hopping up each step */
export const StepVisual: React.FC<VisualProps> = ({ frame, start }) => {
  const t = Math.max(0, frame - start);
  const steps = [0, 1, 2, 3];
  const activeStep = Math.min(3, Math.floor(t / 8));
  const stepProgress = interpolate(t % 8, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ballX = 30 + activeStep * 40 + stepProgress * 40;
  const ballY = 150 - activeStep * 30 - stepProgress * 30;

  return (
    <svg width={220} height={200} viewBox="0 0 220 200" style={{ overflow: "visible" }}>
      {steps.map((i) => (
        <rect key={i} x={10 + i * 40} y={160 - i * 30} width="40" height="20" rx="3" fill="rgba(244,63,94,0.85)" />
      ))}
      <circle cx={ballX} cy={ballY - 15} r="10" fill="#fb7185" />
    </svg>
  );
};

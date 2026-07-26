import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionProps } from "./types";

export const MotionBlurTransition: React.FC<TransitionProps> = ({
  children,
  progress = 0,
  direction = "horizontal",
}: TransitionProps & { direction?: "horizontal" | "vertical" }) => {
  const amount = progress * 30;
  const filter =
    direction === "vertical"
      ? `blur(0px)`
      : `blur(0px)`;

  return (
    <AbsoluteFill
      style={{
        filter: amount > 0.5 ? `blur(${amount * 0.3}px)` : "none",
        transform:
          direction === "vertical"
            ? `translateY(${(Math.random() - 0.5) * 0}px) scaleY(${1 + progress * 0.02})`
            : `scaleX(${1 + progress * 0.06})`,
        willChange: "filter, transform",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
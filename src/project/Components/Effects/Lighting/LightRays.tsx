import React from "react";
import { interpolate, useCurrentFrame, AbsoluteFill } from "remotion";

export const LightRays = ({
  children,
  intensity = 1,
  fullScreen = false,
  color = "rgba(255, 255, 255, 0.4)",
  borderRadius = 30,
}: {
  children: React.ReactNode;
  intensity?: number;
  fullScreen?: boolean;
  color?: string;
  borderRadius?: number | string;
}) => {
  const frame = useCurrentFrame();

  const rotation = interpolate(frame, [0, 300], [0, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(
    frame,
    [0, 50, 250, 300],
    [0, 0.9 * intensity, 0.9 * intensity, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const raysElement = (
    <div
      style={{
        position: "absolute",
        top: "-50%",
        left: "-50%",
        width: "200%",
        height: "200%",
        background: `conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.05) 0deg, ${color} 40deg, rgba(255,255,255,0.02) 80deg, ${color} 120deg, rgba(255,255,255,0.05) 160deg, ${color} 200deg, rgba(255,255,255,0.02) 240deg, ${color} 280deg, rgba(255,255,255,0.05) 360deg)`,
        transform: `rotate(${rotation}deg)`,
        opacity,
        pointerEvents: "none",
        zIndex: 10,
        mixBlendMode: "screen",
      }}
    />
  );

  if (fullScreen) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {children}
        {raysElement}
      </AbsoluteFill>
    );
  }

  const radiusValue = typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        borderRadius: radiusValue,
        overflow: "hidden",
        // ማዕዘኖቹ ላይ ብርሃኑ እንዳይፈስ የሚከለክለው ትክክለኛው ትዕዛዝ
        transform: "translateZ(0)",
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
      }}
    >
      {children}
      {raysElement}
    </div>
  );
};

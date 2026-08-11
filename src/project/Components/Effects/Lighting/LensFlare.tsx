import React from "react";
import { interpolate, useCurrentFrame, AbsoluteFill } from "remotion"; // AbsoluteFill ተጨምሯል

export const LensFlare = ({
  children,
  intensity = 1,
  fullScreen = false,
}: {
  children: React.ReactNode;
  intensity?: number;
  fullScreen?: boolean;
}) => {
  const frame = useCurrentFrame();

  const x = interpolate(frame, [0, 150, 300], [-25, 50, 125], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(
    frame,
    [0, 40, 150, 260, 300],
    [0, 0.8 * intensity, 0.5 * intensity, 0.8 * intensity, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // የብርሃኑን ዲዛይን (Elements) በአንድ ቦታ እናስቀምጠዋለን (ኮዱ እንዳይደጋገም)
  const lightElements = (
    <>
      {/* Lens flare */}
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          top: "50%",
          width: 180,
          height: 180,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.25) 25%, rgba(255,255,255,0) 70%)",
          opacity,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Light streak */}
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          top: "50%",
          width: 500,
          height: 2,
          transform: "translate(-50%, -50%)",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
          opacity: opacity * 0.7,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
    </>
  );

  // 1. ሙሉ ስክሪን (fullScreen) ከሆነ: የ Remotion AbsoluteFillን እንጠቀማለን
  if (fullScreen) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {children}
        {lightElements}
      </AbsoluteFill>
    );
  }

  // 2. ለሳጥን (Box) ብቻ ከሆነ: መደበኛ inline-block divን እንጠቀማለን
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
        borderRadius: 30,
      }}
    >
      {children}
      {lightElements}
    </div>
  );
};

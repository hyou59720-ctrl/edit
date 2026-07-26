import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionProps } from "./types";

export const RGBSplitTransition: React.FC<TransitionProps> = ({ children, progress = 0 }) => {
  const offset = progress * 18;

  return (
    <AbsoluteFill>
      {children}

      {progress > 0.01 && (
        <>
          <AbsoluteFill
            style={{
              mixBlendMode: "screen",
              opacity: progress,
              transform: `translateX(${-offset}px)`,
              filter: "url(#redOnly)",
              pointerEvents: "none",
            }}
          >
            {children}
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              mixBlendMode: "screen",
              opacity: progress,
              transform: `translateX(${offset}px)`,
              filter: "url(#blueOnly)",
              pointerEvents: "none",
            }}
          >
            {children}
          </AbsoluteFill>

          <svg width="0" height="0" style={{ position: "absolute" }}>
            <filter id="redOnly">
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
            </filter>
            <filter id="blueOnly">
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
            </filter>
          </svg>
        </>
      )}
    </AbsoluteFill>
  );
};
import React from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import { TransitionProps } from "./types";

interface FilmBurnTransitionProps extends TransitionProps {
  videoSrc?: "filmBurn" | "filmBurn2";
}

const burn1 = require("./Video/film burn transition 1.mp4");
const burn2 = require("./Video/film burn transition 2.mp4");

export const FilmBurnTransition: React.FC<FilmBurnTransitionProps> = ({
  children,
  progress = 0,
  videoSrc = "filmBurn",
}) => {
  const src = videoSrc === "filmBurn2" ? burn2 : burn1;

  return (
    <AbsoluteFill>
      {children}

      {progress > 0 && (
        <AbsoluteFill
          style={{
            opacity: progress,
            pointerEvents: "none",
            mixBlendMode: "screen",
          }}
        >
          <OffthreadVideo
            src={src}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            volume={1}    
            pauseWhenBuffering
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
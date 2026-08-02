import React from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import { TransitionProps } from "./types";

interface FilmBurnTransitionProps extends TransitionProps {
  videoSrc?: "filmBurn" | "filmBurn2";
}

const burn1 = require("./Video/filmBurn 1.mp4");
const burn2 = require("./Video/filmBurn 2.mp4");
const burn3 = require("./Video/filmBurn 3.mp4");
const burn4 = require("./Video/filmBurn 4.mp4");
const burn5 = require("./Video/filmBurn 5.mp4");
const burn6 = require("./Video/filmBurn 6.mp4");
const burn7 = require("./Video/filmBurn 7.mp4");
const burn8 = require("./Video/filmBurn 8.mp4");
const burn9 = require("./Video/filmBurn 9.mp4");
const burn10 = require("./Video/filmBurn 10.mp4");


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
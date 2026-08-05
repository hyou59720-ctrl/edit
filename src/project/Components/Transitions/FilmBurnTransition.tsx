import React from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import { TransitionProps } from "./types";

interface FilmBurnTransitionProps extends TransitionProps {
  videoSrc?: 
    | "filmBurn" 
    | "filmBurn1" 
    | "filmBurn2" 
    | "filmBurn3" 
    | "filmBurn4" 
    | "filmBurn5" 
    | "filmBurn6" 
    | "filmBurn7" 
    | "filmBurn8" 
    | "filmBurn9" 
    | "filmBurn10";
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

const videoMap: Record<string, string> = {
  filmBurn: burn1,
  filmBurn1: burn1,
  filmBurn2: burn2,
  filmBurn3: burn3,
  filmBurn4: burn4,
  filmBurn5: burn5,
  filmBurn6: burn6,
  filmBurn7: burn7,
  filmBurn8: burn8,
  filmBurn9: burn9,
  filmBurn10: burn10,
};

export const FilmBurnTransition: React.FC<FilmBurnTransitionProps> = ({
  children,
  progress = 0,
  videoSrc = "filmBurn1",
}) => {
  // የተመረጠውን ቪዲዮ ይፈልጋል፤ ካልተገኘ ደግሞ በራሱ (default) burn1 ን ይጠቀማል
  const src = videoMap[videoSrc] || burn1;

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

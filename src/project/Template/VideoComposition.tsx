import React from "react";
import { AbsoluteFill, Video, Sequence } from "remotion";
import { Subtitle } from "./Subtitle";
import { TransitionRenderer } from "./TransitionRenderer";
import { videoData } from "../Videos/video1/data";

export const VideoComposition: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Main A-Roll */}
      <Video
        src={videoData.mainVideo}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* B-Roll Sequences */}
      {videoData.brolls.map((broll, index) => (
        <Sequence
          key={index}
          from={broll.startFrame}
          durationInFrames={broll.endFrame - broll.startFrame}
        >
          <TransitionRenderer
            transition={broll.transition}
            duration={broll.transitionDuration ?? 16}
            maxBlur={broll.transitionBlur ?? 28}
          >
            <AbsoluteFill>
              <broll.component />
            </AbsoluteFill>
          </TransitionRenderer>
        </Sequence>
      ))}

      {/* Subtitle */}
      <Subtitle items={videoData.subtitles} />
    </AbsoluteFill>
  );
};

import React, { useMemo } from "react";
import { AbsoluteFill, OffthreadVideo, Sequence } from "remotion";
import { Subtitle } from "./Subtitle";
import {
  GlobalTransition,
  GlobalTransitionConfig,
} from "../Components/Transitions/GlobalTransition";
import { videoData } from "../Videos/video1/data";

export const VideoComposition: React.FC = () => {
  const transitions: GlobalTransitionConfig[] = useMemo(
    () =>
      videoData.brolls
        .filter((b) => b.transitionType) // transitionType ያለው ብቻ
        .map((b) => ({
          frame: b.startFrame,
          type: b.transitionType,
          videoSrc: b.transitionVideoSrc, // 👈 አዲስ - filmBurn/filmBurn2 መምረጫ
        })),
    [],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <GlobalTransition transitions={transitions}>
        <OffthreadVideo
          src={videoData.mainVideo}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          pauseWhenBuffering
          // 👈 ዳታው ላይ የጨመርነውን volume እዚህ ጋር ይጠቀማል
          volume={videoData.mainVideoVolume ?? 1}
        />

        {videoData.brolls.map((broll, index) => (
          <Sequence
            key={index}
            from={broll.startFrame}
            durationInFrames={broll.endFrame - broll.startFrame}
          >
            <AbsoluteFill>
              <broll.component />
            </AbsoluteFill>
          </Sequence>
        ))}
      </GlobalTransition>
      <Subtitle items={videoData.subtitles} />
    </AbsoluteFill>
  );
};

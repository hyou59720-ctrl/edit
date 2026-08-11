import React, { useMemo } from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, Audio } from "remotion";
import { Subtitle } from "./Subtitle";
import { EffectRenderer } from "../Components/Effects/EffectRenderer";
import { GlobalTransition } from "../Components/Transitions/GlobalTransition";
import { UiRenderer } from "../Components/UI/UiRenderer"; // UiRendererን ጠራነው

export const VideoComposition = ({ videoData }: any) => {
  const transitions = useMemo(
    () =>
      videoData.brolls
        .filter((b: any) => b.transitionType)
        .map((b: any) => ({
          frame: b.startFrame,
          type: b.transitionType,
          videoSrc: b.transitionVideoSrc,
        })),
    [videoData],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }} from={-26}>
      {videoData.audio && (
        <Sequence from={0}>
          <Audio src={videoData.audio} volume={1} />
        </Sequence>
      )}
      <GlobalTransition transitions={transitions}>
        {/* እዚህ ጋር videoData.showVideo !== false መሆኑ ተስተካክሏል */}
        {videoData.mainVideo && videoData.showVideo !== false && (
          <OffthreadVideo
            src={videoData.mainVideo}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            volume={videoData.mainVideoVolume ?? 1}
          />
        )}

        {videoData.brolls.map((broll: any, index: number) => (
          <Sequence
            key={index}
            from={broll.startFrame}
            durationInFrames={broll.endFrame - broll.startFrame}
          >
            <EffectRenderer
              effect={broll.effect}
              fullScreen={true}
              color={broll.color}
              intensity={broll.intensity}
              maxBlur={broll.maxBlur}
            >
              {broll.uiType ? (
                <AbsoluteFill
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    ...broll.style,
                  }}
                >
                  <UiRenderer type={broll.uiType} {...broll.uiProps} />
                </AbsoluteFill>
              ) : broll.component ? (
                <broll.component />
              ) : null}
            </EffectRenderer>
          </Sequence>
        ))}
      </GlobalTransition>
      <Subtitle items={videoData.subtitles} />
    </AbsoluteFill>
  );
};

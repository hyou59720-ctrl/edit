import React, { useMemo } from "react";
import { Easing, useCurrentFrame } from "remotion";
import { BlurTransition } from "./BlurTransition";
import { FlashTransition } from "./FlashTransition";
import { ZoomTransition } from "./ZoomTransition";
import { FilmBurnTransition } from "./FilmBurnTransition";

export interface GlobalTransitionConfig {
  frame: number;
  type?: "blur" | "flash" | "zoom" | "filmBurn";
  videoSrc?: "filmBurn" | "filmBurn2";
}

const EASE = Easing.bezier(0.25, 1, 0.5, 1);
const DURATION = 16;
const FILM_BURN_DURATION = 50;

function getProgress(frame: number, transitionFrame: number, duration: number): number {
  const half = duration / 2;
  const start = transitionFrame - half;
  const end = transitionFrame + half;

  if (frame <= start || frame >= end) return 0;

  const raw =
    frame <= transitionFrame
      ? (frame - start) / half
      : 1 - (frame - transitionFrame) / half;

  return EASE(Math.min(1, Math.max(0, raw)));
}

export const GlobalTransition: React.FC<{
  children: React.ReactNode;
  transitions: GlobalTransitionConfig[];
}> = ({ children, transitions }) => {
  const frame = useCurrentFrame();

  const { blurP, flashP, zoomP, filmBurnP, filmBurnSrc } = useMemo(() => {
    let blurP = 0, flashP = 0, zoomP = 0, filmBurnP = 0;
    let filmBurnSrc: "filmBurn" | "filmBurn2" = "filmBurn";

    for (const t of transitions) {
      const type = t.type ?? "blur";
      const duration = type === "filmBurn" ? FILM_BURN_DURATION : DURATION;
      const p = getProgress(frame, t.frame, duration);

      if (type === "blur" && p > blurP) blurP = p;
      else if (type === "flash" && p > flashP) flashP = p;
      else if (type === "zoom" && p > zoomP) zoomP = p;
      else if (type === "filmBurn" && p > filmBurnP) {
        filmBurnP = p;
        filmBurnSrc = t.videoSrc ?? "filmBurn";
      }
    }

    return { blurP, flashP, zoomP, filmBurnP, filmBurnSrc };
  }, [frame, transitions]);

  return (
    <FilmBurnTransition progress={filmBurnP} videoSrc={filmBurnSrc}>
      <ZoomTransition progress={zoomP}>
        <BlurTransition progress={blurP}>
          <FlashTransition progress={flashP}>
            {children}
          </FlashTransition>
        </BlurTransition>
      </ZoomTransition>
    </FilmBurnTransition>
  );
};
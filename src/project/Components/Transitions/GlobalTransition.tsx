import React, { useMemo } from "react";
import { Easing, useCurrentFrame } from "remotion";
import { BlurTransition } from "./BlurTransition";
import { FlashTransition } from "./FlashTransition";
import { ZoomTransition } from "./ZoomTransition";
import { FilmBurnTransition } from "./FilmBurnTransition";
import { LightLeakTransition } from "./LightLeakTransition";
import { WhipPanTransition } from "./WhipPanTransition";
import { MotionBlurTransition } from "./MotionBlurTransition";
import { ZoomBlurTransition } from "./ZoomBlurTransition";
import { LumaFadeTransition } from "./LumaFadeTransition";
import { GlitchTransitionFx } from "./GlitchTransitionFx";
import { RGBSplitTransition } from "./RGBSplitTransition";
import { InkSpreadTransition } from "./InkSpreadTransition";
import { LiquidWarpTransition } from "./LiquidWarpTransition";

export type TransitionType =
  | "blur"
  | "flash"
  | "zoom"
  | "filmBurn"
  | "lightLeak"
  | "whipPan"
  | "motionBlur"
  | "zoomBlur"
  | "lumaFade"
  | "glitch"
  | "rgbSplit"
  | "inkSpread"
  | "liquidWarp";

// 👇 የ Film Burn አይነቶችን በአንድ ላይ ሰብስበን አዲስ Type ፈጠርን
export type FilmBurnSrcType = 
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

export interface GlobalTransitionConfig {
  frame: number;
  type?: TransitionType;
  videoSrc?: FilmBurnSrcType; // 👇 እዚህ ላይ አዲሱን Type ተጠቀምን
}

const EASE = Easing.bezier(0.25, 1, 0.5, 1);
const DURATION = 20;
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

const ZERO = {
  blurP: 0,
  flashP: 0,
  zoomP: 0,
  filmBurnP: 0,
  filmBurnSrc: "filmBurn1" as FilmBurnSrcType, // 👇 እዚህ ላይም ማስተካከያ አድርገናል
  lightLeakP: 0,
  whipPanP: 0,
  motionBlurP: 0,
  zoomBlurP: 0,
  lumaFadeP: 0,
  glitchP: 0,
  rgbSplitP: 0,
  inkSpreadP: 0,
  liquidWarpP: 0,
};

export const GlobalTransition: React.FC<{
  children: React.ReactNode;
  transitions: GlobalTransitionConfig[];
}> = ({ children, transitions }) => {
  const frame = useCurrentFrame();

  const p = useMemo(() => {
    const result = { ...ZERO };

    for (const t of transitions) {
      const type = t.type ?? "blur";
      const duration = type === "filmBurn" ? FILM_BURN_DURATION : DURATION;
      const progress = getProgress(frame, t.frame, duration);

      if (type === "blur" && progress > result.blurP) result.blurP = progress;
      else if (type === "flash" && progress > result.flashP) result.flashP = progress;
      else if (type === "zoom" && progress > result.zoomP) result.zoomP = progress;
      else if (type === "filmBurn" && progress > result.filmBurnP) {
        result.filmBurnP = progress;
        result.filmBurnSrc = t.videoSrc ?? "filmBurn1"; // 👇 ካልተመረጠ default filmBurn1 ይሆናል
      } else if (type === "lightLeak" && progress > result.lightLeakP) result.lightLeakP = progress;
      else if (type === "whipPan" && progress > result.whipPanP) result.whipPanP = progress;
      else if (type === "motionBlur" && progress > result.motionBlurP) result.motionBlurP = progress;
      else if (type === "zoomBlur" && progress > result.zoomBlurP) result.zoomBlurP = progress;
      else if (type === "lumaFade" && progress > result.lumaFadeP) result.lumaFadeP = progress;
      else if (type === "glitch" && progress > result.glitchP) result.glitchP = progress;
      else if (type === "rgbSplit" && progress > result.rgbSplitP) result.rgbSplitP = progress;
      else if (type === "inkSpread" && progress > result.inkSpreadP) result.inkSpreadP = progress;
      else if (type === "liquidWarp" && progress > result.liquidWarpP) result.liquidWarpP = progress;
    }

    return result;
  }, [frame, transitions]);

  // 👇 ሁሉም component ዎች ሁልጊዜ mounted ናቸው - tree ፈፅሞ አይቀየርም → reload የለም
  return (
    <FilmBurnTransition progress={p.filmBurnP} videoSrc={p.filmBurnSrc}>
      <LightLeakTransition progress={p.lightLeakP}>
        <WhipPanTransition progress={p.whipPanP}>
          <MotionBlurTransition progress={p.motionBlurP}>
            <ZoomBlurTransition progress={p.zoomBlurP}>
              <LumaFadeTransition progress={p.lumaFadeP}>
                <GlitchTransitionFx progress={p.glitchP}>
                  <RGBSplitTransition progress={p.rgbSplitP}>
                    <InkSpreadTransition progress={p.inkSpreadP}>
                      <LiquidWarpTransition progress={p.liquidWarpP}>
                        <ZoomTransition progress={p.zoomP}>
                          <BlurTransition progress={p.blurP}>
                            <FlashTransition progress={p.flashP}>
                              {children}
                            </FlashTransition>
                          </BlurTransition>
                        </ZoomTransition>
                      </LiquidWarpTransition>
                    </InkSpreadTransition>
                  </RGBSplitTransition>
                </GlitchTransitionFx>
              </LumaFadeTransition>
            </ZoomBlurTransition>
          </MotionBlurTransition>
        </WhipPanTransition>
      </LightLeakTransition>
    </FilmBurnTransition>
  );
};

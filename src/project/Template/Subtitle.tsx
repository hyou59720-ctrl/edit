import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { TextAnimationProps } from "../Components/TextAnimations/types";
import { TextAnimationRenderer } from "./TextAnimationRenderer";
import { TextEffectRenderer } from "../Components/TextEffects/TextEffectRenderer";

interface SubtitleItem {
  text: string;
  startFrame: number;
  endFrame: number;

  animation?: string;
  effect?: "AuroraText" | "ComicText";

  speed?: number;
  stagger?: number;
  fontSize?: number;
  colors?: string[];
}

interface SubtitleProps {
  items: SubtitleItem[];
}

export const Subtitle: React.FC<SubtitleProps> = ({ items }) => {
  const frame = useCurrentFrame();

  const currentSubtitle = items.find(
    (item) =>
      frame >= item.startFrame &&
      frame <= item.endFrame
  );

  if (!currentSubtitle) return null;

  const props: TextAnimationProps = {
    text: currentSubtitle.text,
    speed: currentSubtitle.speed ?? 15,
    stagger: currentSubtitle.stagger ?? 2,
    startFrame: currentSubtitle.startFrame,
    endFrame: currentSubtitle.endFrame,
    fontSize: currentSubtitle.fontSize ?? 48,
  };

  const animatedText = (
    <TextAnimationRenderer
      animation={currentSubtitle.animation}
      {...props}
    />
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 380,
      }}
    >
      {currentSubtitle.effect ? (
        <TextEffectRenderer
          effect={currentSubtitle.effect}
          colors={currentSubtitle.colors}
        >
          {animatedText}
        </TextEffectRenderer>
      ) : (
        animatedText
      )}
    </AbsoluteFill>
  );
};
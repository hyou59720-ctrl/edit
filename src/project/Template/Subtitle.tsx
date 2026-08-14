import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { TextAnimationProps } from "../Components/TextAnimations/types";
import { TextAnimationRenderer } from "./TextAnimationRenderer";
import { TextEffectRenderer } from "../Components/TextEffects/TextEffectRenderer";
// 🌟 አዲሱን FontRenderer ጠራነው (መንገዱን እንዳለህበት ፎልደር አስተካክለው)
import { FontRenderer } from "../Components/TextFonts/FontRendere";

interface SubtitleItem {
  text: string;
  startFrame: number;
  endFrame: number;

  animation?: string;
  effect?: "AuroraText" | "ComicText" | "ChromeText";

  speed?: number;
  stagger?: number;
  fontSize?: number;
  colors?: string[];
  
  bottomOffset?: number; 
  fontFamilyName?: string; // 👈 ፎንቱን ከ ዳታው ላይ ለመቀበል
}

interface SubtitleProps {
  items: SubtitleItem[];
}

export const Subtitle: React.FC<SubtitleProps> = ({ items }) => {
  const frame = useCurrentFrame();

  const activeSubtitles = items.filter(
    (item) => frame >= item.startFrame && frame <= item.endFrame
  );

  if (activeSubtitles.length === 0) return null;

  return (
    <AbsoluteFill>
      {activeSubtitles.map((currentSubtitle, index) => {

        const props: TextAnimationProps = {
          text: currentSubtitle.text,
          speed: currentSubtitle.speed ?? 15,
          stagger: currentSubtitle.stagger ?? 2,
          startFrame: currentSubtitle.startFrame,
          endFrame: currentSubtitle.endFrame,
          fontSize: currentSubtitle.fontSize ?? 46, 
        };

        const textContent = currentSubtitle.animation ? (
          <TextAnimationRenderer
            animation={currentSubtitle.animation}
            {...props}
          />
        ) : (
          <div
            style={{
              fontSize: props.fontSize,
              fontWeight: 900,
              color: "white",
              textAlign: "center",
              textShadow: "0px 4px 15px rgba(0,0,0,0.8)", 
            }}
          >
            {currentSubtitle.text}
          </div>
        );

        const finalContent = currentSubtitle.effect ? (
          <TextEffectRenderer
            effect={currentSubtitle.effect}
            colors={currentSubtitle.colors}
          >
            {textContent}
          </TextEffectRenderer>
        ) : (
          textContent
        );

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              bottom: currentSubtitle.bottomOffset ?? 150, 
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* 🌟 እዚህ ጋር Google Fontም ይሁን Local Font፣ FontRenderer ራሱ ለይቶ ያመጣዋል */}
            <FontRenderer fontName={currentSubtitle.fontFamilyName}>
              <div
                style={{
                  fontWeight: 900, 
                  textTransform: "uppercase", 
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {finalContent}
              </div>
            </FontRenderer>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

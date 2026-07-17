import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  staticFile,
  Sequence,
  interpolate,
  Easing,
} from "remotion";
import React, { useMemo } from "react";
import { subtitleData } from "./subtitles";
import { Broll1 } from "./broll/broll1";
import { Broll2 } from "./broll/broll2";
import { Broll3 } from "./broll/broll3";
import { Broll4 } from "./broll/broll4";
import { ColorGrade } from "./colorGrade/ColorGrade";
import { FontStyles } from "./Fonts";
import { StyledSubtitleText } from "./Text"; 
import { TelegramGlassReveal } from "./telegram";
import { SoundEffects } from "./sound";
import { Transition, TransitionConfig } from "./Transition";

export const RofiVideo = () => {
  const frame = useCurrentFrame();

  // 👈 እዚህ ጋር የነበሩት ሁለት የ B-Roll መገናኛ ትራንዚሽኖች ሙሉ በሙሉ ወጥተዋል!
  const transitionConfigs: TransitionConfig[] = useMemo(() => [
    { type: "zoomPunch", frame: 71, duration: 12, intensity: 1.3 },   // 1. ከ A-Roll ወደ B-Roll 1 ሲገባ
    { type: "impact", frame: 320, duration: 14 },                     // 2. ከ B-Roll 3 ተመልሶ ወደ A-Roll ሲገባ
    { type: "zoomPunch", frame: 380, duration: 12, intensity: 1.4 },  // 3. ከ A-Roll ወደ B-Roll 4 ሲገባ
    { type: "flash", frame: 454, duration: 10 }                       // 4. ከ B-Roll 4 ተመልሶ ወደ A-Roll ሲገባ
  ], []);

  // የ B-Roll ሁኔታዎች (አቀማመጣቸው አልተቀየረም፣ ያለምንም መቆራረጥ አንዱ ካለቀ በኋላ ሌላው ይቀጥላል)
  const isBRoll1Active = frame >= 71 && frame < 185;
  const isBRoll2Active = frame >= 185 && frame < 234;
  const isBRoll3Active = frame >= 233 && frame < 320; 
  const isBRoll4Active = frame >= 380 && frame < 454;

  const isAnyBRollActive =
    isBRoll1Active || isBRoll2Active || isBRoll3Active || isBRoll4Active;

  // ሰብታይትል ማግኘት
  const currentSubtitle = subtitleData.find(
    (sub) => frame >= sub.startFrame && frame < sub.endFrame,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <FontStyles />
      
      {/* የትራንዚሽን ኢንጂን */}
      <Transition transitions={transitionConfigs} quality="final">
        
        {/* ሀ. ዋናው ተናጋሪ ቪዲዮ (A-Roll) */}
        <Sequence
          from={0}
          durationInFrames={512}
          style={{
            scale: interpolate(frame, [17, 54, 285], [1, 1.3, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: [
                Easing.spring({
                  damping: 200,
                  mass: 1,
                  stiffness: 100,
                  allowTail: true,
                  durationRestThreshold: 0.02,
                  overshootClamping: false,
                }),
                Easing.linear,
              ],
            }),
          }}
        >
          <ColorGrade active={!isAnyBRollActive}>
            <Video
              src={staticFile("rofi_copy.mp4")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </ColorGrade>
        </Sequence>

        {/* ለ. B-Roll Sequences (ያለ ምንም የትራንዚሽን መቆራረጥ ተከታትለው ይገባሉ) */}
        <Sequence from={71} durationInFrames={114}>
          <AbsoluteFill style={{ backgroundColor: "black" }}>
            <Broll1 />
          </AbsoluteFill>
        </Sequence>
        
        <Sequence from={185} durationInFrames={49}>
          <AbsoluteFill style={{ backgroundColor: "black" }}>
            <Broll2 />
          </AbsoluteFill>
        </Sequence>
        
        <Sequence from={233} durationInFrames={87}>
          <AbsoluteFill style={{ backgroundColor: "black" }}>
            <Broll3 />
          </AbsoluteFill>
        </Sequence>
        
        <Sequence from={380} durationInFrames={74}>
          <AbsoluteFill style={{ backgroundColor: "black" }}>
            <Broll4 />
          </AbsoluteFill>
        </Sequence>

      </Transition>

      {/* ሐ. የቴሌግራም አኒሜሽን */}
      <Sequence
        from={444}
        durationInFrames={68}
        style={{
          transform: "translateY(200px)", 
        }}
      >
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <TelegramGlassReveal />
        </AbsoluteFill>
      </Sequence>

      {/* መ. ሰብታይትል */}
      {currentSubtitle && (
        <div
          style={{
            position: "absolute",
            bottom: 420, 
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
            padding: "0 40px",
          }}
        >
          <StyledSubtitleText  
            text={currentSubtitle.text}  
            startFrame={currentSubtitle.startFrame}  
          />
        </div>
      )}

      {/* ሠ. የድምፅ ተፅዕኖዎች */}
      <SoundEffects /> 

    </AbsoluteFill>
  );
};

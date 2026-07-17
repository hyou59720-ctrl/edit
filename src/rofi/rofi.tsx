import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  staticFile,
  Sequence,
  interpolate,
  Easing,
} from "remotion";
import React from "react";
import { subtitleData } from "./subtitles";
import { Broll1 } from "./broll/broll1";
import { Broll2 } from "./broll/broll2";
import { Broll3 } from "./broll/broll3";
import { Broll4 } from "./broll/broll4";
import { ColorGrade } from "./colorGrade/ColorGrade";
import { FontStyles } from "./Fonts";
import { StyledSubtitleText } from "./Text"; // 👈 አዲሱን የጽሑፍ ኮምፖነንት እዚህ ጋር አስገብተነዋል
import { TelegramGlassReveal } from "./telegram";
export const RofiVideo = () => {
  const frame = useCurrentFrame();

  // የአሁኑን ሰብታይትል ማግኘት
  const currentSubtitle = subtitleData.find(
    (sub) => frame >= sub.startFrame && frame < sub.endFrame,
  );

  const isBRoll1Active = frame >= 71 && frame < 185;
  const isBRoll2Active = frame >= 185 && frame < 234;
  const isBRoll3Active = frame >= 236 && frame < 300;
  const isBRoll4Active = frame >= 380 && frame < 454;

  const isAnyBRollActive =
    isBRoll1Active || isBRoll2Active || isBRoll3Active || isBRoll4Active;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <FontStyles />
      {/* ሀ. ዋናው ተናጋሪ ቪዲዮ */}
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
            src={staticFile("rofi.mp4")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </ColorGrade>
      </Sequence>
      {/* ለ. B-Roll Sequences */}
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
      <Sequence
        from={444}
        durationInFrames={68}
        style={{
          translate: "-5.8px 417.7px",
        }}
      >
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <TelegramGlassReveal />
        </AbsoluteFill>
      </Sequence>
      {/* ሐ. ሰብታይትል — TikTok Safe Zone */}
      {currentSubtitle && (
        <div
          style={{
            position: "absolute",
            bottom: 420, // ቲክቶክ ሴፍ ዞን
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
            padding: "0 40px",
          }}
        >
          {/* 👈 አዲሱን የጽሑፍ አኒሜሽን እዚህ ጋር ጠርተነዋል */}
          <StyledSubtitleText
            text={currentSubtitle.text}
            startFrame={currentSubtitle.startFrame}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

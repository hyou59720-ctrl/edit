import React from "react";
import { interpolate, useVideoConfig } from "remotion";
import { Subtitle } from "./Subtitles";
import { findKeyword } from "./keywordStyles";
import { KEYWORD_VISUALS } from "./visuals";

export const KeywordConceptVisual: React.FC<{ chunk: Subtitle; frame: number }> = ({
  chunk,
  frame,
}) => {
  const { width } = useVideoConfig();

  const isBroll =
    (frame >= 91 && frame <= 185) ||
    (frame >= 271 && frame <= 365) ||
    (frame >= 451 && frame <= 561) ||
    (frame >= 721 && frame <= 871);

  if (isBroll) return null;

  const words = chunk.text.split(" ");
  let matchedKey: string | null = null;
  for (const w of words) {
    const k = findKeyword(w);
    if (k) {
      matchedKey = k;
      break;
    }
  }
  if (!matchedKey) return null;

  const Visual = KEYWORD_VISUALS[matchedKey];
  if (!Visual) return null;

  const opacity = interpolate(
    frame,
    [chunk.startFrame, chunk.startFrame + 10, chunk.endFrame - 8, chunk.endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (opacity <= 0) return null;

  const baseWidth = 320;
  const targetWidth = width * 0.5;
  const scale = targetWidth / baseWidth;

  return (
    <div
      className="absolute left-1/2"
      style={{
        // Anchored from the bottom, just above the caption text
        // (captions sit at bottom: 22%), instead of near the top/face.
        bottom: "34%",
        opacity,
        transform: `translateX(-50%) scale(${scale})`,
        transformOrigin: "center bottom",
        filter: "drop-shadow(0px 8px 24px rgba(0,0,0,0.55))",
      }}
    >
      <Visual frame={frame} start={chunk.startFrame} end={chunk.endFrame} />
    </div>
  );
};

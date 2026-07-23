import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

/**
 * BROLL 5 — MONEY
 * Subtitle covered: "$100k a video, now we're spending probably..."
 * Duration: 54 frames (~1.8s @ 30fps)
 *
 * Concept: a small "2 YEARS AGO / $100K" bar appears first, then a
 * much taller bar rises up next to it (open-ended, trailing off with
 * "..." since the line cuts off), visualizing budget growth. Dollar
 * figure counts up on the old bar before the new one dwarfs it.
 */

export const MoneyBroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerOpacity = interpolate(frame, [0, 8, 45, 54], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Old bar (small, $100k) rises first
  const oldBarP = spring({
    frame: frame - 4,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 16,
    config: { damping: 14, mass: 0.5 },
  });
  const oldBarHeight = interpolate(oldBarP, [0, 1], [0, 140]);

  // Counting number on old bar
  const countP = spring({
    frame: frame - 6,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 18,
    config: { damping: 20 },
  });
  const displayCount = Math.round(interpolate(countP, [0, 1], [0, 100]));

  // New bar (tall, open-ended) rises after, overshoots frame top
  const newBarP = spring({
    frame: frame - 22,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 22,
    config: { damping: 13, mass: 0.6 },
  });
  const newBarHeight = interpolate(newBarP, [0, 1], [0, 340]);

  const newLabelOpacity = interpolate(frame, [34, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ellipsis pulse on the new bar, since the line trails off "probably..."
  const dotPulse = (offset: number) =>
    0.3 + 0.7 * Math.max(0, Math.sin((frame - offset) * 0.35));

  return (
    <AbsoluteFill className="bg-[#08080C] flex items-center justify-center overflow-hidden">
      <AbsoluteFill
        className="opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        className="relative flex items-end gap-16"
        style={{ opacity: containerOpacity, height: 420 }}
      >
        {/* Old bar */}
        <div className="flex flex-col items-center">
          <span
            className="font-black text-white mb-3"
            style={{ fontSize: 40 }}
          >
            ${displayCount}K
          </span>
          <div
            className="w-24 rounded-t-md bg-[#3A3A44] border border-white/10"
            style={{ height: oldBarHeight }}
          />
          <p className="text-[#8A8A96] font-semibold text-xs tracking-[0.25em] uppercase mt-4 text-center leading-relaxed">
            2 years
            <br />
            ago
          </p>
        </div>

        {/* New bar, tall + open-ended */}
        <div className="flex flex-col items-center">
          <span
            className="font-black text-[#FFD60A] mb-3 flex items-center gap-1"
            style={{ fontSize: 40, opacity: newLabelOpacity }}
          >
            NOW
          </span>
          <div className="relative">
            <div
              className="w-24 rounded-t-md bg-[#FFD60A]"
              style={{
                height: newBarHeight,
                boxShadow: "0 0 30px rgba(255,214,10,0.5)",
              }}
            />
            {/* jagged/open top edge to signal "uncapped / trailing off" */}
            <div
              className="absolute left-0 right-0 flex justify-center gap-1"
              style={{
                bottom: newBarHeight + 10,
                opacity: newLabelOpacity,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-[#FFD60A]"
                  style={{ opacity: dotPulse(i * 4) }}
                />
              ))}
            </div>
          </div>
          <p
            className="text-[#8A8A96] font-semibold text-xs tracking-[0.25em] uppercase mt-4 text-center leading-relaxed"
            style={{ opacity: newLabelOpacity }}
          >
            per
            <br />
            video
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default MoneyBroll;
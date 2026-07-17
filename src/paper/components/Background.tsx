import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

// Warm off-white paper background with grain, wrinkles, vignette, dust
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // slow drifting grain offset
  const grainX = interpolate(frame, [0, 250], [0, 40]);
  const grainY = interpolate(frame, [0, 250], [0, -25]);

  return (
    <AbsoluteFill className="bg-[#f2ead9]">
      {/* base paper gradient */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 90% at 30% 20%, #f7f0df 0%, #ede3cd 45%, #e4d8bd 100%)",
        }}
      />

      {/* subtle wrinkles */}
      <AbsoluteFill
        className="opacity-30 mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(120,100,70,0.05) 0px, rgba(120,100,70,0.05) 2px, transparent 2px, transparent 60px), repeating-linear-gradient(25deg, rgba(120,100,70,0.04) 0px, rgba(120,100,70,0.04) 1px, transparent 1px, transparent 90px)",
        }}
      />

      {/* animated paper grain (film grain via layered radial dots) */}
      <AbsoluteFill
        className="opacity-[0.12] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(60,45,25,0.9) 1px, transparent 0)",
          backgroundSize: "3px 3px",
          transform: `translate(${grainX}px, ${grainY}px)`,
        }}
      />

      {/* dust particles */}
      <DustParticles frame={frame} />

      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(40,30,15,0.18) 100%)",
        }}
      />

      {/* grid corner accent (bottom-left, matches reference) */}
      <div
        className="absolute bottom-0 left-0 w-64 h-64 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(80,60,30,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(80,60,30,0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "linear-gradient(to top right, black 0%, transparent 70%)",
        }}
      />
    </AbsoluteFill>
  );
};

const DustParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const particles = Array.from({ length: 28 }, (_, i) => i);
  return (
    <>
      {particles.map((i) => {
        const seed = i * 137.5;
        const baseX = (seed % 100) * 10.8;
        const baseY = ((seed * 1.7) % 100) * 19.2;
        const drift = Math.sin(frame / 40 + i) * 8;
        const opacity = 0.15 + 0.15 * Math.sin(frame / 30 + i * 2);
        return (
          <div
            key={i}
            className="absolute rounded-full bg-[#6b5738]"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              left: baseX + drift,
              top: baseY,
              opacity,
            }}
          />
        );
      })}
    </>
  );
};

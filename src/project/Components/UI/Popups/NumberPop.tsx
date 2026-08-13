// src/project/Components/UI/Popups/NumberPop.tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const NumberPop = ({
  items = ["10", "20", "50"],
  suffix = "?",
  color = "#8B5CF6",
  scale: customScale = 1,
  staggerFrames = 8,
  durationInFrames,
}: {
  items?: string[];
  suffix?: string;
  color?: string;
  scale?: number;
  staggerFrames?: number;
  durationInFrames?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hexToRgb = (hex: string) => {
    const m = hex.replace("#", "");
    const bigint = parseInt(
      m.length === 3 ? m.split("").map((c) => c + c).join("") : m,
      16
    );
    return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
  };
  const rgb = hexToRgb(color);

  const EXIT_DURATION = 12;
  const exitStart = durationInFrames ? durationInFrames - EXIT_DURATION : Infinity;
  const containerExitOpacity = durationInFrames
    ? interpolate(frame, [exitStart, durationInFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <div
      style={{
        opacity: containerExitOpacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
        transform: `scale(${customScale})`,
      }}
    >
      {items.map((item, i) => {
        const itemStart = i * staggerFrames;
        const localFrame = frame - itemStart;

        // 🌟 Explosive pop-in — overshoot bounce
        const itemScale = spring({
          frame: localFrame,
          fps,
          config: { damping: 8, mass: 0.6, stiffness: 260 },
        });

        const itemOpacity = interpolate(localFrame, [0, 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const flipRotate = interpolate(localFrame, [0, 14], [180, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // 🌟 Shake burst ልክ ሲገባ (impact feel)
        const shakeX =
          localFrame > 0 && localFrame < 10
            ? Math.sin(localFrame * 3) * (10 - localFrame) * 1.2
            : 0;

        const idleFloat =
          localFrame > 18 ? Math.sin((localFrame - 18) / 9 + i) * 8 : 0;
        const idleRotate =
          localFrame > 18 ? Math.sin((localFrame - 18) / 12 + i) * 3 : 0;

        // 🌟 ኃይለኛ pulsing glow
        const pulse = Math.sin(frame / 5 + i * 1.5) * 20 + 45;

        // 🌟 Fast spinning gradient ring
        const ringRotate = (frame * 6 + i * 60) % 360;

        // 🌟 Shockwave ring — ልክ ሲገባ የሚስፋፋ ቀለበት
        const shockScale = interpolate(localFrame, [0, 18], [0.3, 2.2], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const shockOpacity = interpolate(localFrame, [0, 18], [0.8, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // ✨ Sparkle particles (4 ለ card)
        const sparkleCount = 4;
        const sparkles = Array.from({ length: sparkleCount }).map((_, s) => {
          const angle = (s / sparkleCount) * Math.PI * 2 + frame / 20 + i;
          const dist = 85 + Math.sin(frame / 8 + s) * 12;
          const sx = Math.cos(angle) * dist;
          const sy = Math.sin(angle) * dist;
          const sOpacity = interpolate(localFrame, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return { sx, sy, sOpacity, key: s };
        });

        return (
          <div
            key={i}
            style={{
              position: "relative",
              opacity: itemOpacity,
              transform: `translateX(${shakeX}px) scale(${itemScale}) perspective(600px) rotateY(${flipRotate}deg) translateY(${idleFloat}px) rotate(${idleRotate}deg)`,
            }}
          >
            {/* 💥 Shockwave ring */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `3px solid ${color}`,
                opacity: shockOpacity,
                transform: `scale(${shockScale})`,
                pointerEvents: "none",
              }}
            />

            {/* ✨ Sparkles */}
            {sparkles.map((s) => (
              <div
                key={s.key}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  opacity: s.sOpacity,
                  transform: `translate(${s.sx}px, ${s.sy}px)`,
                  boxShadow: `0 0 10px 3px rgba(${rgb}, 0.9)`,
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* Rotating gradient ring behind card */}
            <div
              style={{
                position: "absolute",
                inset: -5,
                borderRadius: "30px",
                background: `conic-gradient(from ${ringRotate}deg, ${color}, #ffffff, ${color}, transparent, ${color})`,
                filter: "blur(2px)",
                zIndex: 0,
              }}
            />

            {/* 🃏 ራሱ Card — ትልቅ */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "170px",
                height: "190px",
                padding: "0 30px",
                borderRadius: "28px",
                background: `linear-gradient(160deg, rgba(${rgb},0.35) 0%, rgba(8,8,18,0.92) 100%)`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `2.5px solid rgba(${rgb}, 0.75)`,
                boxShadow: `0 25px 50px rgba(0,0,0,0.65), 0 0 ${pulse}px rgba(${rgb}, 0.6), inset 0 2px 0 rgba(255,255,255,0.18)`,
              }}
            >
              <span
                style={{
                  fontSize: "104px",
                  fontWeight: 900,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  background: `linear-gradient(180deg, #ffffff 0%, #ffffff 30%, ${color} 100%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  textShadow: `0 0 35px rgba(${rgb}, 0.95), 0 0 70px rgba(${rgb}, 0.6)`,
                  lineHeight: 1,
                }}
              >
                {item}
              </span>
            </div>
          </div>
        );
      })}

      {suffix && (
        <span
          style={{
            fontSize: "120px",
            fontWeight: 900,
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: color,
            opacity: interpolate(
              frame,
              [
                items.length * staggerFrames,
                items.length * staggerFrames + 10,
              ],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
            transform: `scale(${spring({
              frame: frame - items.length * staggerFrames,
              fps,
              config: { damping: 7, mass: 0.5, stiffness: 260 },
            })}) rotate(${Math.sin(frame / 6) * 8}deg)`,
            textShadow: `0 0 30px rgba(${rgb}, 0.95), 0 0 60px rgba(${rgb}, 0.5)`,
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
};
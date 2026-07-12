import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Eye, BookOpen, Search, Lightbulb, PenLine, Copy, Workflow, CheckCircle2 } from "lucide-react";

/**
 * Broll4 — Frames 721–870 (local 0–149)
 * Topic: INSPIRE then MODEL
 * Story: split screen comparison (left = Inspire actions, right = Model actions)
 * with staggered rows, animated connecting arrows, checklist completion,
 * then panels resolve into bold centered "INSPIRE ↓ MODEL" typography,
 * then fade back to A-roll.
 */

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

const leftItems = [
  { label: "Watching", icon: Eye },
  { label: "Learning", icon: BookOpen },
  { label: "Research", icon: Search },
  { label: "Studying", icon: Lightbulb },
];

const rightItems = [
  { label: "Taking Notes", icon: PenLine },
  { label: "Copying Systems", icon: Copy },
  { label: "Building Workflow", icon: Workflow },
  { label: "Executing", icon: CheckCircle2 },
];

export const Broll4: React.FC = () => {
  const frame = useCurrentFrame();

  /* ---------------- Master timing ---------------- */
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [136, 150], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
  });
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  /* ---------------- Split-screen panels (visible 10-118) ---------------- */
  const panelsOpacity = interpolate(frame, [10, 18, 112, 122], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panelsSlide = interpolate(frame, [112, 124], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dividerScale = interpolate(frame, [4, 14], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headerY = interpolate(frame, [10, 20], [-16, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerOpacity = interpolate(frame, [10, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* arrows connecting the two sides */
  const arrowDraw = clamp(interpolate(frame, [70, 92], [0, 1]));
  const arrowOpacity = interpolate(frame, [68, 74, 108, 116], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ---------------- Final centered typography (126-150) ---------------- */
  const typoOpacity = interpolate(frame, [126, 134], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const typoScale = interpolate(frame, [126, 136], [0.9, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowDownOpacity = interpolate(frame, [132, 138], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const modelOpacity = interpolate(frame, [138, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity, pointerEvents: "none" }}>
      {/* background */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, #131a26 0%, #0a0d13 60%, #030405 100%)",
        }}
      />

      {/* ================= SPLIT SCREEN PANELS ================= */}
      <AbsoluteFill
        style={{
          opacity: panelsOpacity,
          transform: `scale(${1 - panelsSlide * 0.06})`,
        }}
      >
        {/* left panel tint */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "50%",
            height: "100%",
            background: "linear-gradient(135deg, rgba(90,140,255,0.10), transparent)",
            transform: `translateX(${-panelsSlide * 60}px)`,
          }}
        />
        {/* right panel tint */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "50%",
            height: "100%",
            background: "linear-gradient(225deg, rgba(90,140,255,0.10), transparent)",
            transform: `translateX(${panelsSlide * 60}px)`,
          }}
        />

        {/* center divider with glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            width: 2,
            height: "80%",
            backgroundColor: "#5A8CFF",
            boxShadow: "0 0 16px rgba(90,140,255,0.8)",
            transform: `translateX(-50%) scaleY(${dividerScale})`,
            transformOrigin: "top",
          }}
        />

        {/* headers */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "25%",
            transform: `translate(-50%, ${headerY}px)`,
            opacity: headerOpacity,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 900,
            fontSize: 38,
            color: "#5A8CFF",
            letterSpacing: 2,
          }}
        >
          INSPIRE
        </div>
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "75%",
            transform: `translate(-50%, ${headerY}px)`,
            opacity: headerOpacity,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 900,
            fontSize: 38,
            color: "#5A8CFF",
            letterSpacing: 2,
          }}
        >
          MODEL
        </div>

        {/* left column rows */}
        <div
          style={{
            position: "absolute",
            top: "22%",
            left: "8%",
            width: "34%",
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          {leftItems.map((item, i) => {
            const local = frame - 24 - i * 10;
            const pop = clamp(interpolate(local, [0, 12], [0, 1]));
            const tick = clamp(interpolate(frame - 96 - i * 4, [0, 10], [0, 1]));
            const Icon = tick > 0.5 ? CheckCircle2 : item.icon;
            return (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: pop,
                  transform: `translateX(${(1 - pop) * -24}px)`,
                }}
              >
                <Icon size={22} color={tick > 0.5 ? "#3ED598" : "#8fa8e8"} strokeWidth={1.75} />
                <span style={{ fontFamily: "system-ui, sans-serif", fontWeight: 700, fontSize: 22, color: "#ffffff" }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* right column rows */}
        <div
          style={{
            position: "absolute",
            top: "22%",
            right: "8%",
            width: "34%",
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          {rightItems.map((item, i) => {
            const local = frame - 30 - i * 10;
            const pop = clamp(interpolate(local, [0, 12], [0, 1]));
            const tick = clamp(interpolate(frame - 100 - i * 4, [0, 10], [0, 1]));
            const Icon = tick > 0.5 ? CheckCircle2 : item.icon;
            return (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: pop,
                  transform: `translateX(${(1 - pop) * 24}px)`,
                }}
              >
                <Icon size={22} color={tick > 0.5 ? "#3ED598" : "#8fa8e8"} strokeWidth={1.75} />
                <span style={{ fontFamily: "system-ui, sans-serif", fontWeight: 700, fontSize: 22, color: "#ffffff" }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* connecting arrows */}
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0, opacity: arrowOpacity }}
        >
          {[0, 1].map((i) => {
            const y = 240 + i * 90;
            const pathLength = 180;
            return (
              <path
                key={i}
                d={`M 42% ${y} C 48% ${y}, 52% ${y}, 58% ${y}`}
                fill="none"
                stroke="#5A8CFF"
                strokeWidth={2.5}
                strokeLinecap="round"
                markerEnd="url(#arrowhead)"
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength * (1 - arrowDraw)}
              />
            );
          })}
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#5A8CFF" />
            </marker>
          </defs>
        </svg>
      </AbsoluteFill>

      {/* ================= FINAL CENTERED TYPOGRAPHY ================= */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            transform: `scale(${typoScale})`,
          }}
        >
          <div
            style={{
              opacity: typoOpacity,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 900,
              fontSize: 84,
              color: "#5A8CFF",
              letterSpacing: 2,
            }}
          >
            INSPIRE
          </div>
          <div
            style={{
              opacity: arrowDownOpacity,
              fontSize: 46,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            ↓
          </div>
          <div
            style={{
              opacity: modelOpacity,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 900,
              fontSize: 84,
              color: "#5A8CFF",
              letterSpacing: 2,
            }}
          >
            MODEL
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

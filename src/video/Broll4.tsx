import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Eye, BookOpen, Search, Lightbulb, PenLine, Copy, Workflow, CheckCircle2 } from "lucide-react";

/**
 * Broll4 — Frames 721–920 (local 0–199)
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

  /* ---------------- Master timing (Scaled to 200 frames) ---------------- */
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [180, 200], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
  });
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  /* ---------------- Split-screen panels (visible 15-155) ---------------- */
  const panelsOpacity = interpolate(frame, [15, 25, 145, 158], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panelsSlide = interpolate(frame, [145, 162], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dividerScale = interpolate(frame, [5, 20], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headerY = interpolate(frame, [15, 30], [-16, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* arrows connecting the two sides */
  const arrowDraw = clamp(interpolate(frame, [90, 120], [0, 1]));
  const arrowOpacity = interpolate(frame, [88, 98, 140, 152], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ---------------- Final centered typography (165-200) ---------------- */
  const typoOpacity = interpolate(frame, [165, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const typoScale = interpolate(frame, [165, 178], [0.9, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowDownOpacity = interpolate(frame, [172, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const modelOpacity = interpolate(frame, [180, 190], [0, 1], {
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
            width: 3,
            height: "80%",
            backgroundColor: "#5A8CFF",
            boxShadow: "0 0 24px rgba(90,140,255,0.9)",
            transform: `translateX(-50%) scaleY(${dividerScale})`,
            transformOrigin: "top",
          }}
        />

        {/* headers (Increased font size from 38 to 48 for TikTok) */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "25%",
            transform: `translate(-50%, ${headerY}px)`,
            opacity: headerOpacity,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 900,
            fontSize: 48,
            color: "#5A8CFF",
            letterSpacing: 2,
            textShadow: "0px 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          INSPIRE
        </div>
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "75%",
            transform: `translate(-50%, ${headerY}px)`,
            opacity: headerOpacity,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 900,
            fontSize: 48,
            color: "#5A8CFF",
            letterSpacing: 2,
            textShadow: "0px 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          MODEL
        </div>

        {/* left column rows (Increased width & gap, increased label size to 28, icons to 32) */}
        <div
          style={{
            position: "absolute",
            top: "24%",
            left: "6%",
            width: "38%",
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          {leftItems.map((item, i) => {
            const local = frame - 32 - i * 14;
            const pop = clamp(interpolate(local, [0, 15], [0, 1]));
            const tick = clamp(interpolate(frame - 120 - i * 5, [0, 12], [0, 1]));
            const Icon = tick > 0.5 ? CheckCircle2 : item.icon;
            return (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: pop,
                  transform: `translateX(${(1 - pop) * -24}px)`,
                }}
              >
                <Icon size={32} color={tick > 0.5 ? "#3ED598" : "#8fa8e8"} strokeWidth={2.2} />
                <span style={{ fontFamily: "system-ui, sans-serif", fontWeight: 800, fontSize: 28, color: "#ffffff" }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* right column rows (Increased width & gap, increased label size to 28, icons to 32) */}
        <div
          style={{
            position: "absolute",
            top: "24%",
            right: "4%",
            width: "38%",
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          {rightItems.map((item, i) => {
            const local = frame - 40 - i * 14;
            const pop = clamp(interpolate(local, [0, 15], [0, 1]));
            const tick = clamp(interpolate(frame - 125 - i * 5, [0, 12], [0, 1]));
            const Icon = tick > 0.5 ? CheckCircle2 : item.icon;
            return (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: pop,
                  transform: `translateX(${(1 - pop) * 24}px)`,
                }}
              >
                <Icon size={32} color={tick > 0.5 ? "#3ED598" : "#8fa8e8"} strokeWidth={2.2} />
                <span style={{ fontFamily: "system-ui, sans-serif", fontWeight: 800, fontSize: 28, color: "#ffffff" }}>
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
            const y = 265 + i * 128;
            const pathLength = 180;
            return (
              <path
                key={i}
                d={`M 43% ${y} C 48% ${y}, 52% ${y}, 57% ${y}`}
                fill="none"
                stroke="#5A8CFF"
                strokeWidth={3.5}
                strokeLinecap="round"
                markerEnd="url(#arrowhead)"
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength * (1 - arrowDraw)}
              />
            );
          })}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="4" refY="5" orient="auto">
              <path d="M0,1 L10,5 L0,9 Z" fill="#5A8CFF" />
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
            gap: 14,
            transform: `scale(${typoScale})`,
          }}
        >
          <div
            style={{
              opacity: typoOpacity,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 900,
              fontSize: 94,
              color: "#5A8CFF",
              letterSpacing: 2,
              textShadow: "0px 8px 24px rgba(90,140,255,0.3)",
            }}
          >
            INSPIRE
          </div>
          <div
            style={{
              opacity: arrowDownOpacity,
              fontSize: 56,
              color: "rgba(255,255,255,0.8)",
              fontWeight: "bold",
            }}
          >
            ↓
          </div>
          <div
            style={{
              opacity: modelOpacity,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 900,
              fontSize: 94,
              color: "#5A8CFF",
              letterSpacing: 2,
              textShadow: "0px 8px 24px rgba(90,140,255,0.3)",
            }}
          >
            MODEL
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

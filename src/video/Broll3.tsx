import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Layers, LayoutGrid, PenTool, CheckCircle2, Sparkles } from "lucide-react";

/**
 * Broll3 — Frames 451–560 (local 0–109)
 * Topic: Templates and Inspiration
 * Story: floating glass template cards → moodboard/inspiration grid →
 * notebook planning with checklist → sketch morphs into finished work →
 * fade back to A-roll.
 */

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

const GlassCard: React.FC<{
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ style, children }) => (
  <div
    style={{
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.18)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Broll3: React.FC = () => {
  const frame = useCurrentFrame();

  /* ---------------- Master timing ---------------- */
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [98, 110], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
  });
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  const sceneScale = interpolate(frame, [0, 110], [1, 1.05], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateRight: "clamp",
  });

  /* ---------------- Phase A: floating template cards (8-35) ---------------- */
  const cardsOpacity = interpolate(frame, [8, 14, 32, 38], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardConfigs = [
    { x: -140, y: -30, rot: -8, delay: 0 },
    { x: 20, y: -55, rot: 3, delay: 5 },
    { x: 150, y: -10, rot: 9, delay: 10 },
    { x: -30, y: 60, rot: -4, delay: 15 },
  ];

  /* ---------------- Phase B: moodboard grid (35-60) ---------------- */
  const gridOpacity = interpolate(frame, [35, 41, 58, 64], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gridColors = ["#5A8CFF", "#FFC43D", "#3ED598", "#FF7A5A", "#9C6BFF", "#5AD1FF"];

  /* ---------------- Phase C: notebook planning (60-80) ---------------- */
  const notebookOpacity = interpolate(frame, [60, 66, 78, 84], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const checklistItems = ["Reference", "Layout", "Motion"];

  /* ---------------- Phase D: idea -> finished work (80-100) ---------------- */
  const finalOpacity = interpolate(frame, [80, 86], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const morph = clamp(interpolate(frame, [82, 98], [0, 1]));

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity, pointerEvents: "none" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${sceneScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Premium dark studio background */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, #221a2e 0%, #120f18 55%, #050406 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "50%",
            width: 650,
            height: 500,
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(150,110,255,0.22) 0%, rgba(150,110,255,0) 70%)",
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* ---------- Phase A: floating glass template cards ---------- */}
        <div
          style={{
            position: "absolute",
            top: "42%",
            left: "50%",
            opacity: cardsOpacity,
          }}
        >
          {cardConfigs.map((c, i) => {
            const local = frame - 8 - c.delay;
            const pop = clamp(interpolate(local, [0, 12], [0, 1]));
            const float = Math.sin((frame + i * 20) / 18) * 6;
            return (
              <GlassCard
                key={i}
                style={{
                  position: "absolute",
                  width: 130,
                  height: 82,
                  transform: `translate(${c.x - 65}px, ${c.y - 41 + float}px) rotate(${c.rot}deg) scale(${0.85 + pop * 0.15})`,
                  opacity: pop,
                  padding: 10,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <div style={{ width: "70%", height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.5)" }} />
                <div style={{ width: "50%", height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.3)" }} />
                <div style={{ width: "85%", height: 20, borderRadius: 5, background: "linear-gradient(135deg, #5A8CFF, #9C6BFF)", opacity: 0.6, marginTop: 4 }} />
              </GlassCard>
            );
          })}
        </div>

        {/* ---------- Phase B: moodboard / inspiration grid ---------- */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: gridOpacity,
            display: "grid",
            gridTemplateColumns: "repeat(3, 90px)",
            gridAutoRows: "70px",
            gap: 10,
          }}
        >
          {gridColors.map((c, i) => {
            const local = frame - 35 - i * 4;
            const pop = clamp(interpolate(local, [0, 10], [0, 1]));
            return (
              <div
                key={i}
                style={{
                  borderRadius: 10,
                  backgroundColor: c,
                  opacity: 0.55 * pop,
                  transform: `scale(${0.8 + pop * 0.2})`,
                  height: i % 2 === 0 ? 70 : 90,
                }}
              />
            );
          })}
        </div>

        {/* ---------- Phase C: notebook planning ---------- */}
        <GlassCard
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: notebookOpacity,
            width: 300,
            padding: "22px 26px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <PenTool size={18} color="#ffffff" strokeWidth={1.75} />
            <span style={{ fontFamily: "system-ui, sans-serif", fontWeight: 800, fontSize: 15, color: "#ffffff", letterSpacing: 1 }}>
              PLANNING
            </span>
          </div>
          {checklistItems.map((item, i) => {
            const local = frame - 66 - i * 6;
            const tick = clamp(interpolate(local, [0, 10], [0, 1]));
            return (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, opacity: 0.4 + tick * 0.6 }}>
                <CheckCircle2 size={18} color={tick > 0.5 ? "#3ED598" : "rgba(255,255,255,0.3)"} strokeWidth={2} />
                <span style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600, fontSize: 17, color: "#ffffff" }}>{item}</span>
              </div>
            );
          })}
        </GlassCard>

        {/* ---------- Phase D: idea -> finished work morph ---------- */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: finalOpacity,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* sketch wireframe */}
          <div
            style={{
              width: 130,
              height: 170,
              borderRadius: 12,
              border: "2px dashed rgba(255,255,255,0.35)",
              opacity: 1 - morph,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: 14,
            }}
          >
            <div style={{ width: "60%", height: 6, borderRadius: 3, border: "1px dashed rgba(255,255,255,0.4)" }} />
            <div style={{ width: "80%", height: 60, borderRadius: 6, border: "1px dashed rgba(255,255,255,0.4)" }} />
            <div style={{ width: "40%", height: 6, borderRadius: 3, border: "1px dashed rgba(255,255,255,0.4)" }} />
          </div>

          <Sparkles size={26} color="#FFC43D" strokeWidth={1.75} style={{ opacity: morph }} />

          {/* finished polished card */}
          <GlassCard
            style={{
              width: 130,
              height: 170,
              opacity: morph,
              transform: `scale(${0.85 + morph * 0.15})`,
              background: "linear-gradient(160deg, rgba(90,140,255,0.35), rgba(156,107,255,0.25))",
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ width: "60%", height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.7)" }} />
            <div style={{ width: "100%", height: 60, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.25)" }} />
            <Layers size={18} color="#ffffff" strokeWidth={1.75} />
          </GlassCard>
        </div>

        {/* ambient corner label */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: fadeIn,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <LayoutGrid size={16} color="rgba(255,255,255,0.5)" strokeWidth={1.75} />
          <span style={{ fontFamily: "system-ui, sans-serif", fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: 2 }}>
            INSPIRATION
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

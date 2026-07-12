import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Play, Smartphone, Laptop, Sparkles } from "lucide-react";

/**
 * Broll1 — Frames 91–185 (local 0–94)
 * Story: person watches a motivational video → gets excited → opens laptop →
 * works → energy quickly disappears (battery drains, clock speeds up,
 * timeline collapses) → smooth fade back to the A-roll talking head.
 *
 * This component fully covers the A-roll (opaque dark workspace background)
 * for the middle of the clip, then fades its own opacity out at the end so
 * the A-roll is revealed again underneath — no hard cut.
 */

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const Broll1: React.FC = () => {
  const frame = useCurrentFrame();

  /* ---------------- Master timing ---------------- */
  const sceneFadeIn = interpolate(frame, [0, 8], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const sceneFadeOut = interpolate(frame, [78, 95], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
  });
  const sceneOpacity = Math.min(sceneFadeIn, sceneFadeOut);

  // subtle continuous cinematic push-in for the whole scene
  const sceneScale = interpolate(frame, [0, 95], [1, 1.05], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateRight: "clamp",
  });

  /* ---------------- Phase 1: watching phone (8-30) ---------------- */
  const phoneOpacity = interpolate(frame, [8, 16, 40, 48], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phoneScale = interpolate(frame, [8, 18], [0.9, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const playPulse = 1 + Math.sin(frame / 4) * 0.06;
  const warmGlow = interpolate(frame, [8, 30], [0.15, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ---------------- Phase 2: excitement burst (30-45) ---------------- */
  const burstOpacity = interpolate(frame, [28, 34, 44], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sparkleParticles = new Array(8).fill(0).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const dist = interpolate(frame, [30, 45], [0, 140], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  });

  /* ---------------- Phase 3: laptop opens (45-60) ---------------- */
  const laptopOpacity = interpolate(frame, [45, 53, 76, 84], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const laptopY = interpolate(frame, [45, 55], [40, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const screenGlow = interpolate(frame, [50, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ---------------- Phase 4: energy drains (60-80) ---------------- */
  const drainProgress = clamp(interpolate(frame, [60, 82], [0, 1]));
  const batteryFill = interpolate(drainProgress, [0, 1], [90, 6]); // % filled
  const batteryColor =
    batteryFill > 55 ? "#3ED598" : batteryFill > 25 ? "#FFC43D" : "#FF5E5E";

  const clockRotation = frame * 22; // fast spin = accelerated time
  const clockOpacity = interpolate(frame, [58, 66, 80, 88], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const timelineWidth = interpolate(frame, [55, 65, 85], [10, 95, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
        {/* Dark premium workspace background */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, #2a1f14 0%, #14100c 55%, #050505 100%)",
          }}
        />
        {/* warm cinematic light spot */}
        <div
          style={{
            position: "absolute",
            top: "18%",
            left: "50%",
            width: 600,
            height: 600,
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,180,90,0.35) 0%, rgba(255,180,90,0) 70%)",
            opacity: warmGlow,
          }}
        />
        {/* subtle vignette */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* ---------- Phase 1+2: phone watching + excitement ---------- */}
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${phoneScale})`,
            opacity: phoneOpacity,
          }}
        >
          {/* excitement sparkle burst */}
          {sparkleParticles.map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(${p.x}px, ${p.y}px)`,
                opacity: burstOpacity,
              }}
            >
              <Sparkles size={18} color="#FFC43D" strokeWidth={1.5} />
            </div>
          ))}

          <div
            style={{
              width: 150,
              height: 260,
              borderRadius: 24,
              border: "3px solid rgba(255,255,255,0.25)",
              backgroundColor: "#000000",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${playPulse})`,
            }}
          >
            <Play size={44} color="#FFC43D" fill="#FFC43D" />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -50,
              left: "50%",
              transform: "translateX(-50%)",
              opacity: 0.5,
            }}
          >
            <Smartphone size={22} color="#ffffff" strokeWidth={1.5} />
          </div>
        </div>

        {/* ---------- Phase 3: laptop opens & glows ---------- */}
        <div
          style={{
            position: "absolute",
            bottom: "30%",
            left: "50%",
            transform: `translate(-50%, ${laptopY}px)`,
            opacity: laptopOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 180,
              height: 110,
              borderRadius: 10,
              backgroundColor: "#0d0d0d",
              border: "2px solid rgba(255,255,255,0.15)",
              boxShadow: `0 0 ${40 * screenGlow}px rgba(120,170,255,${0.35 * screenGlow})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "80%",
                height: "70%",
                borderRadius: 4,
                background: `linear-gradient(180deg, rgba(120,170,255,${0.5 * screenGlow}) 0%, rgba(30,40,60,${0.3}) 100%)`,
              }}
            />
          </div>
          <div
            style={{
              width: 210,
              height: 10,
              backgroundColor: "#1a1a1a",
              borderRadius: "0 0 6px 6px",
              marginTop: -2,
            }}
          />
        </div>

        {/* ---------- Phase 4: battery + clock + timeline (energy drains) ---------- */}
        <div
          style={{
            position: "absolute",
            top: "14%",
            right: "8%",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {/* custom battery */}
          <div style={{ opacity: clockOpacity, display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 46,
                height: 22,
                border: "2.5px solid rgba(255,255,255,0.5)",
                borderRadius: 4,
                padding: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${batteryFill}%`,
                  backgroundColor: batteryColor,
                  borderRadius: 2,
                  transition: "none",
                }}
              />
            </div>
            <div
              style={{
                width: 3,
                height: 10,
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: 1,
                marginLeft: 1,
              }}
            />
          </div>

          {/* custom fast-spinning clock */}
          <div
            style={{
              opacity: clockOpacity,
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "2.5px solid rgba(255,255,255,0.5)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 2,
                height: 12,
                backgroundColor: "#FF5E5E",
                transformOrigin: "50% 100%",
                transform: `translate(-50%, -100%) rotate(${clockRotation}deg)`,
              }}
            />
          </div>
        </div>

        {/* shrinking energy timeline bar */}
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: 5,
            backgroundColor: "rgba(255,255,255,0.12)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${timelineWidth}%`,
              background: "linear-gradient(90deg, #FFC43D 0%, #FF5E5E 100%)",
              borderRadius: 4,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Film, MessageCircle, Building2, TrendingUp, Loader2 } from "lucide-react";

/**
 * Broll2 — Frames 271–365 (local 0–94)
 * Topic: Video editing → Agency
 * Story: editing timeline → color grading → rendering → client message →
 * money notification → agency dashboard with revenue growth → fade back to A-roll.
 * Fully covers the A-roll (opaque luxury workspace) then fades out at the end.
 */

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const Broll2: React.FC = () => {
  const frame = useCurrentFrame();

  /* ---------------- Master timing ---------------- */
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [80, 95], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
  });
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  const sceneScale = interpolate(frame, [0, 95], [1, 1.05], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateRight: "clamp",
  });

  /* ---------------- Phase A: editing timeline (8-28) ---------------- */
  const timelineOpacity = interpolate(frame, [8, 14, 30, 36], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const playheadX = interpolate(frame, [8, 30], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ---------------- Phase B: color grading (26-42) ---------------- */
  const gradeOpacity = interpolate(frame, [26, 32, 42, 48], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gradeMix = clamp(interpolate(frame, [26, 42], [0, 1]));
  const wheelRotation = frame * 4;

  /* ---------------- Phase C: rendering (40-54) ---------------- */
  const renderOpacity = interpolate(frame, [40, 45, 54, 59], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const renderPercent = Math.round(clamp(interpolate(frame, [40, 54], [0, 1])) * 100);
  const spinnerRotation = frame * 10;

  /* ---------------- Phase D: client message (52-66) ---------------- */
  const clientOpacity = interpolate(frame, [52, 58, 66, 71], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clientY = interpolate(frame, [52, 60], [20, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ---------------- Phase E: money notification (64-77) ---------------- */
  const moneyOpacity = interpolate(frame, [64, 70, 77, 82], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const moneyScale = interpolate(frame, [64, 71], [0.85, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ---------------- Phase F: agency dashboard (75-90) ---------------- */
  const dashOpacity = interpolate(frame, [75, 81, 90], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const graphDraw = clamp(interpolate(frame, [75, 90], [0, 1]));
  const pathLength = 220;

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
        {/* Luxury cool-toned office background */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, #1a2230 0%, #0d1117 55%, #030405 100%)",
          }}
        />
        {/* cool rim light */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            width: 700,
            height: 500,
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(90,140,255,0.22) 0%, rgba(90,140,255,0) 70%)",
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* ---------- Phase A: editing timeline ---------- */}
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: timelineOpacity,
            width: 420,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Film size={18} color="#9fb4ff" strokeWidth={1.75} />
            <span
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#9fb4ff",
                letterSpacing: 1,
              }}
            >
              TIMELINE
            </span>
          </div>
          <div
            style={{
              position: "relative",
              height: 46,
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              overflow: "hidden",
            }}
          >
            {["#5A8CFF", "#3ED598", "#FFC43D", "#FF7A5A", "#9C6BFF"].map((c, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: c,
                  opacity: 0.55,
                  borderRight: "1px solid rgba(0,0,0,0.3)",
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${playheadX}%`,
                width: 2,
                backgroundColor: "#ffffff",
                boxShadow: "0 0 8px rgba(255,255,255,0.8)",
              }}
            />
          </div>
        </div>

        {/* ---------- Phase B: color grading ---------- */}
        <div
          style={{
            position: "absolute",
            top: "36%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: gradeOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 260,
              height: 150,
              borderRadius: 10,
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, #3a3f52 0%, #23262f 100%)",
                filter: `saturate(${1 + gradeMix * 0.6}) contrast(${1 + gradeMix * 0.25}) brightness(${1 - gradeMix * 0.05})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(255,150,80,0.18), rgba(80,150,255,0.18))",
                opacity: gradeMix,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["#FF7A5A", "#B3B3B3", "#5A8CFF"].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: `2px solid ${c}`,
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
                    backgroundColor: c,
                    transformOrigin: "50% 100%",
                    transform: `translate(-50%, -100%) rotate(${wheelRotation + i * 40}deg)`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Phase C: rendering ---------- */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: renderOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Loader2
            size={34}
            color="#ffffff"
            strokeWidth={2}
            style={{ transform: `rotate(${spinnerRotation}deg)` }}
          />
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 34,
              color: "#ffffff",
              letterSpacing: 1,
            }}
          >
            {renderPercent}%
          </div>
          <div
            style={{
              width: 220,
              height: 5,
              borderRadius: 4,
              backgroundColor: "rgba(255,255,255,0.12)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${renderPercent}%`,
                background: "linear-gradient(90deg, #5A8CFF, #3ED598)",
              }}
            />
          </div>
        </div>

        {/* ---------- Phase D: client message ---------- */}
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "50%",
            transform: `translate(-50%, ${clientY}px)`,
            opacity: clientOpacity,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 26px",
              borderRadius: 18,
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(6px)",
            }}
          >
            <MessageCircle size={22} color="#3ED598" strokeWidth={1.75} />
            <span
              style={{
                fontFamily: "system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: "#ffffff",
              }}
            >
              "This looks incredible 🔥"
            </span>
          </div>
        </div>

        {/* ---------- Phase E: money notification ---------- */}
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${moneyScale})`,
            opacity: moneyOpacity,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "18px 30px",
              borderRadius: 16,
              backgroundColor: "#ffffff",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <span
              style={{
                fontFamily: "system-ui, sans-serif",
                fontWeight: 900,
                fontSize: 30,
                color: "#1EC86B",
              }}
            >
              + 4,200 ETB
            </span>
          </div>
        </div>

        {/* ---------- Phase F: agency dashboard ---------- */}
        <div
          style={{
            position: "absolute",
            bottom: "16%",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: dashOpacity,
            width: 420,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Building2 size={18} color="#ffffff" strokeWidth={1.75} />
              <span
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 15,
                  color: "#ffffff",
                  letterSpacing: 1,
                }}
              >
                AGENCY DASHBOARD
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <TrendingUp size={16} color="#3ED598" strokeWidth={2} />
              <span
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 15,
                  color: "#3ED598",
                }}
              >
                +38%
              </span>
            </div>
          </div>
          <div
            style={{
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "16px 18px",
            }}
          >
            <svg width="100%" height="70" viewBox="0 0 380 70">
              <path
                d="M 0 55 Q 60 50, 100 40 T 200 28 T 300 14 T 380 6"
                fill="none"
                stroke="#3ED598"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength * (1 - graphDraw)}
              />
            </svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

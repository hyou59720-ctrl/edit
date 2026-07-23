import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

/**
 * BROLL 2 — TIMELINE (OPTIMIZED SIZE & BALANCED BOTTOM POSITION)
 * Subtitle covered: "it's probably like one to two months"
 * Total Duration: 54 frames
 */

const ACCENT = "#F5C64B"; // ወርቃማ ቀለም
const WHITE = "#FFFFFF";
const GRAY = "#8A8A93";
const MUTED_DASH = "#4A4A52"; // የጭረቱ ቀለም

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const InfographicBroll: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- Overall presence ----
  // 👈 እዚህ ጋር ማብቂያው 54 ሆኗል፣ ከ 50 ጀምሮ fade ማድረግ ይጀምራል
  const containerOpacity = interpolate(
    frame,
    [0, 8, 50, 64],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }
  );

  const entryScale = interpolate(frame, [0, 8], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  const breathe = 1 + Math.sin(((frame - 8) / 34) * Math.PI) * 0.006;
  const scale = frame <= 8 ? entryScale : entryScale * breathe;

  // 👈 የንቅናቄው ማብቂያም ከጠቅላላው ቆይታ ጋር እንዲሄድ ወደ 54 ተስተካክሏል
  const drift = interpolate(frame, [8, 54], [0, -4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  // ---- Progress bar filling ----
  const barFill = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  const labelOpacity = interpolate(frame, [10, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  const barOpacity = interpolate(frame, [12, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{ opacity: containerOpacity }}>
      {/* 
        ማስተካከያ 1፦ የጥቁር ጥላው (Gradient) ኤለመንቶቹ ወደ ላይ ከፍ ስለሉ 
        አብሮ ይበልጥ ተስማሚ እንዲሆን ከ 50% ጀምሮ ጥላው እንዲጀምር ተደርጓል።
      */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(5, 5, 7, 0.0) 50%, rgba(5, 5, 7, 0.7) 70%, rgba(5, 5, 7, 0.95) 88%, #050507 100%)",
        }}
      />

      {/* 
        ማስተካከያ 2፦ በጣም ወደ ታች እንዳይጣበቅ በምትፈልገው መልክ paddingBottom ወደ 140 ከፍ ብሏል።
        ይህም ሙሉውን ዲዛይን ወደ መሃል-ታች (Lower-Third Zone) ያመጣዋል።
      */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 250, // 👈 በጣም ታች ሳይሆን በጥሩ መጠን ወደ ላይ ከፍ እንዲል ያደርገዋል
          transform: `translateY(${drift}px) scale(${scale})`,
        }}
      >
        {/* Eyebrow label */}
        <span
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 800,
            fontSize: 25, // 👈 መጠኑ ጨምሯል
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: GRAY,
            opacity: labelOpacity,
            marginBottom: 8,
          }}
        >
          Idea Stage
        </span>

        {/* Primary visual: 1-2 MONTHS */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 20,
          }}
        >
          <div
            style={{
              fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 900,
              fontSize: 240, // 👈 የቁጥሩ መጠን በደንብ እንዲታይ መልሶ ጨምሯል
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            <span style={{ color: WHITE }}>1</span>
            <span style={{ color: MUTED_DASH, padding: "0 8px" }}>-</span>
            <span style={{ color: ACCENT, filter: "drop-shadow(0 0 40px rgba(245, 198, 75, 0.45))" }}>2</span>
          </div>

          <span
            style={{
              fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 900,
              fontSize: 64, // 👈 የ MONTHS ጽሑፍ መጠን ጨምሯል
              letterSpacing: "0.04em",
              color: WHITE,
              marginBottom: 18,
            }}
          >
            MONTHS
          </span>
        </div>

        {/* Timeline visualization */}
        <div
          style={{
            marginTop: 24,
            width: 700, // 👈 የባሩ ስፋት በትንሹ ጨምሯል
            opacity: barOpacity,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
              fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 800,
              fontSize: 20, // 👈 የጽሑፍ መጠን ጨምሯል
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: WHITE, textShadow: "0 0 10px rgba(255,255,255,0.3)" }}>Idea</span>
            <span style={{ color: GRAY }}>Work Begins</span>
          </div>

          {/* ዋናው የታይምላይን መስመር */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 6,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 3,
            }}
          >
            {/* የሚሞላው መስመር */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${barFill * 100}%`,
                backgroundColor: ACCENT,
                borderRadius: 3,
                boxShadow: `0 0 18px ${ACCENT}, 0 0 35px ${ACCENT}`,
              }}
            />
            
            {/* ጫፍ ላይ ያለችው አይኮን/ነጥብ */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: `${barFill * 100}%`,
                width: 24, // 👈 የነጥቧ መጠን በጥቂቱ ጎላ ተደርጓል
                height: 24,
                borderRadius: "50%",
                backgroundColor: WHITE,
                transform: "translate(-50%, -50%)",
                border: `3px solid ${ACCENT}`,
                boxShadow: `0 0 22px ${ACCENT}, 0 0 45px ${ACCENT}`,
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default InfographicBroll;

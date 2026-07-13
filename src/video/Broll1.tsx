import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile, Audio } from "remotion";
import { Play, Sparkles } from "lucide-react";

/**
 * Broll1 — Frames 91–185 (local 0–94)
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

  /* ---------------- Optimized Phone Positioning & Scaling ---------------- */
  // መጀመሪያ መሃል ላይ ይሆንና ምስሉ ሲመጣ (45-55) ወደ ላይ በግራ (Top-Left) ይሄዳል
  const phoneTop = interpolate(
    frame, 
    [0, 45, 55, 95], 
    ["50%", "50%", "22%", "22%"], 
    { easing: Easing.bezier(0.25, 1, 0.5, 1) }
  );

  const phoneLeft = interpolate(
    frame, 
    [0, 45, 55, 95], 
    ["50%", "50%", "15%", "15%"], 
    { easing: Easing.bezier(0.25, 1, 0.5, 1) }
  );

  // መጀመሪያ መሃል ላይ 1x በትልቁ ሆኖ ምስሉ ሲገባ ወደ 0.43x ያንሳል
  const dynamicPhoneScale = interpolate(
    frame, 
    [0, 8, 45, 55, 95], 
    [0, 1, 1, 0.43, 0.43], 
    { easing: Easing.bezier(0.25, 1, 0.5, 1) }
  );

  const phoneOpacity = interpolate(frame, [0, 8, 90, 95], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const playPulse = 1 + Math.sin(frame / 4) * 0.04;
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
    const dist = interpolate(frame, [30, 45], [0, 220], { 
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  });

  /* ---------------- Phase 3: Programmer Image Animation & Resizing ---------------- */
  const pcOpacity = interpolate(frame, [45, 53, 90, 95], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  const pcY = interpolate(frame, [45, 55], [60, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  // ምስሉ ልክ ሲመጣ በትክክል መሃል ላይ እንዲቀመጥ ተደርጓል
  const pcLeft = interpolate(frame, [45, 55, 95], ["50%", "50%", "50%"], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  });

  // ምስሉ መሃል ላይ ሲመጣ አነስ ብሎ (0.6x) ይጀምርና ወደ ኋላ እየሄደ 1000 size (1.1x) እንዲሆን የሚያደርግ አኒሜሽን
  const pcScale = interpolate(frame, [45, 60, 95], [0.6, 1.0, 1.1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  const screenGlow = interpolate(frame, [50, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ---------------- Phase 4: energy drains (60-80) ---------------- */
  const drainProgress = clamp(interpolate(frame, [60, 82], [0, 1]));
  const batteryFill = interpolate(drainProgress, [0, 1], [90, 6]);
  const batteryColor =
    batteryFill > 55 ? "#3ED598" : batteryFill > 25 ? "#FFC43D" : "#FF5E5E";

  const clockRotation = frame * 22;
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
      
      {/* ---------------- 🎵 SFX SECTION ---------------- */}
      {/* Scene Intro: ስልኩ መሃል ላይ ብቅ ሲል */}
      {frame === 0 && <Audio src={staticFile("audio/whoosh.mp3")} volume={0.6} />}

      {/* Sparkle Burst: በ Frame 30 ላይ ፍንጣሪዎቹ ሲወጡ */}
      {frame === 30 && <Audio src={staticFile("audio/pop.mp3")} volume={0.6} />}

      {/* Screen Transition: ስልኩ ወደ ጥግ ሄዶ የኮምፒውተር ምስሉ ሲመጣ */}
      {frame === 45 && <Audio src={staticFile("audio/whoosh.mp3")} volume={0.6} />}

      {/* Interface Lock: ምስሉ መሃል ላይ ቦታውን በትክክል ሲይዝ */}
      {frame === 55 && <Audio src={staticFile("audio/pop.mp3")} volume={0.6} />}

      {/* Energy Drain & Clock: ሰዓቱ መሽከርከር እና ባትሪው መቀነስ ሲጀምር */}
      {frame === 60 && <Audio src={staticFile("audio/click.mp3")} volume={0.7} />}
      {frame === 68 && <Audio src={staticFile("audio/click.mp3")} volume={0.7} />}
      {frame === 76 && <Audio src={staticFile("audio/click.mp3")} volume={0.7} />}
      {/* -------------------------------------------------- */}

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

        {/* ---------- iPhone View Layout ---------- */}
        <div
          style={{
            position: "absolute",
            top: phoneTop,
            left: phoneLeft,
            transform: `translate(-50%, -50%) scale(${dynamicPhoneScale})`,
            opacity: phoneOpacity,
            zIndex: 30,
            transformOrigin: "center center",
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
                zIndex: 20,
              }}
            >
              <Sparkles size={26} color="#FFC43D" strokeWidth={1.5} />
            </div>
          ))}

          {/* iPhone Premium Frame Body */}
          <div
            style={{
              width: 480,
              height: 840,
              borderRadius: 48,
              backgroundColor: "#1c1c1e",
              boxShadow: "0 45px 100px rgba(0,0,0,0.85), inset 0 0 4px 2px rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${playPulse})`,
              position: "relative",
              padding: 10,
            }}
          >
            {/* The Actual iOS Screen View */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 38,
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#000",
              }}
            >
              <img
                src={staticFile("/icon/Screenshot.jpg")}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 1.0, 
                }}
                alt="iPhone UI Screen"
              />
              
              <div 
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.1)",
                  zIndex: 1,
                }}
              />

              {/* iPhone Dynamic Island Badging */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 200,
                  height: 30,
                  borderRadius: 12,
                  backgroundColor: "#000000",
                  zIndex: 15,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
                  border: "0.5px solid rgba(255,255,255,0.05)"
                }}
              />

              {/* iOS Home Indicator Bar at bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 100,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  zIndex: 15,
                }}
              />

              {/* Action Play Button Layout */}
              <div 
                style={{ 
                  zIndex: 10, 
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                }}
              >
                <Play size={32} color="#FFC43D" fill="#FFC43D" style={{ marginLeft: 4 }} />
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Phase 3: Dynamic Scaling Programmer Image ---------- */}
        <div
          style={{
            position: "absolute",
            bottom: "5%", 
            left: pcLeft,
            transform: `translate(-50%, ${pcY}px) scale(${pcScale})`, 
            opacity: pcOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
            width: 1000, 
            transformOrigin: "bottom center",
          }}
        >
          {/* Neon Screen Glow Layer Behind the Image */}
          <div
            style={{
              position: "absolute",
              top: "30%",
              right: "20%",
              width: 350,
              height: 280,
              borderRadius: "20%",
              background: "radial-gradient(circle, rgba(120,170,255,0.45) 0%, rgba(120,170,255,0) 70%)",
              boxShadow: `0 0 ${70 * screenGlow}px rgba(120,170,255,${0.55 * screenGlow})`,
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* Programmer Asset — ከውጪው መያዣ ጋር 100% እንዲሞላ ተደርጓል */}
          <img
            src={staticFile("/icon/programmer.png")}
            style={{
              width: "100%", 
              height: "auto",
              zIndex: 2,
              filter: `drop-shadow(0 25px 35px rgba(0,0,0,0.85)) drop-shadow(0 0 15px rgba(120,170,255,${0.2 * screenGlow}))`,
            }}
            alt="Programmer working on Desktop PC"
          />
        </div>

        {/* ---------- Phase 4: battery + clock + timeline ---------- */}
        <div
          style={{
            position: "absolute",
            top: "14%",
            right: "8%",
            display: "flex",
            alignItems: "center",
            gap: 14,
            zIndex: 40
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
            zIndex: 40
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

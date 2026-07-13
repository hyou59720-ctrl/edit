import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Audio, staticFile } from "remotion";
import { Film, Building2, TrendingUp, Scissors, Play } from "lucide-react";

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const Broll2: React.FC = () => {
  const frame = useCurrentFrame();

  /* ---------------- Master timing ---------------- */
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [85, 95], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
  });
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  const sceneScale = interpolate(frame, [0, 95], [1, 1.02], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateRight: "clamp",
  });

  /* ---------------- Animation Timings ---------------- */
  // 1. VIDEO EDITING SCREEN
  const editOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  
  // ኤዲቱ ከበፊቱ በበለጠ ወደ ላይ (ወደ 18%) ከፍ ብሏል ለታችኛው ቦታ ለመስጠት
  const editTopLocation = interpolate(frame, [40, 52], [45, 18], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const playheadX = interpolate(frame, [0, 90], [10, 90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. AGENCY DASHBOARD SCREEN (ጽሑፉ እንዳይሸፍነው ወደ ላይ ከፍ ተደርጓል)
  const agencyOpacity = interpolate(frame, [45, 55], [0, 1], { extrapolateLeft: "clamp" });
  
  // ከ 63% የነበረውን ወደ 54% ከፍ አድርገነዋል (ከጽሑፉ ነፃ እንዲሆን)
  const agencyTopLocation = interpolate(frame, [40, 52], [63, 54], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const agencyYPosition = interpolate(frame, [45, 55], [60, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // የኢትዮጵያ ብር ቁጥር አኒሜሽን
  const rawBrAmount = interpolate(frame, [48, 80], [0, 45500], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const formattedBr = Math.round(rawBrAmount).toLocaleString();

  const bars = [0, 1, 2, 3];

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity, pointerEvents: "none" }}>
      
      {/* ---------------- 🎵 SOUND EFFECTS ---------------- */}
      {/* የመጀመሪያው ስክሪን ሲገባ የሚሰማ የሽውታ ድምፅ */}
      {frame === 0 && <Audio src={staticFile("audio/whoosh.mp3")} volume={0.4} />}
      
      {/* ኤዲቲንግ ኢንተርፌስ ሙሉ በሙሉ ታይቶ ሲያበቃ (Frame 10) */}
      {frame === 10 && <Audio src={staticFile("audio/pop.mp3")} volume={0.3} />}
      
      {/* የኤጀንሲው ዴሽቦርድ ወደ ላይ ከፍ እያለ ሲመጣ (Frame 45) */}
      {frame === 45 && <Audio src={staticFile("audio/whoosh.mp3")} volume={0.4} />}
      
      {/* የግራፍ አሞሌዎች (Bars) በየተራ ብቅ ሲሉ እና የብር ቁጥሩ መቆጠር ሲጀምር */}
      {frame === 48 && <Audio src={staticFile("audio/click.mp3")} volume={0.3} />}
      {frame === 53 && <Audio src={staticFile("audio/click.mp3")} volume={0.3} />}
      {frame === 58 && <Audio src={staticFile("audio/click.mp3")} volume={0.3} />}
      {frame === 63 && <Audio src={staticFile("audio/click.mp3")} volume={0.3} />}
      {/* -------------------------------------------------- */}

      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${sceneScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Luxury office background */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, #1a2230 0%, #0d1117 55%, #030405 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            width: 900,
            height: 600,
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(90,140,255,0.22) 0%, rgba(90,140,255,0) 70%)",
          }}
        />

        {/* ---------- 🎬 SCREEN 1: VIDEO EDITING SOFTWARE ---------- */}
        <div
          style={{
            position: "absolute",
            top: `${editTopLocation}%`,
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: editOpacity,
            width: 800,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Film size={22} color="#5A8CFF" strokeWidth={2.5} />
            <span
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 16,
                fontWeight: 800,
                color: "#5A8CFF",
                letterSpacing: 1.5,
              }}
            >
              VIDEO EDITING INTERFACE
            </span>
          </div>

          <div
            style={{
              position: "relative",
              borderRadius: 12,
              backgroundColor: "#141923",
              border: "2px solid rgba(90,140,255,0.3)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", gap: 20, height: 160 }}>
              <div
                style={{
                  flex: 1.5,
                  backgroundColor: "#0d1117",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div style={{ width: 60, height: 60, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Play size={28} color="#ffffff" fill="#ffffff" style={{ marginLeft: 4 }} />
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  backgroundColor: "#0d1117",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Scissors size={64} color="#5A8CFF" strokeWidth={1.5} style={{ opacity: 0.8 }} />
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#0d1117",
                borderRadius: 8,
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                position: "relative",
              }}
            >
              <div style={{ display: "flex", gap: 6, height: 24 }}>
                <div style={{ width: "40%", backgroundColor: "#FFC43D", borderRadius: 4, opacity: 0.9 }} />
                <div style={{ width: "45%", backgroundColor: "#5A8CFF", borderRadius: 4, opacity: 0.9 }} />
              </div>
              <div style={{ display: "flex", gap: 6, height: 18 }}>
                <div style={{ width: "25%", backgroundColor: "#5A8CFF", borderRadius: 4, opacity: 0.8 }} />
                <div style={{ width: "50%", backgroundColor: "#3ED598", borderRadius: 4, opacity: 0.8 }} />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${playheadX}%`,
                  width: 3,
                  backgroundColor: "#FF4A4A",
                  boxShadow: "0 0 10px #FF4A4A",
                  zIndex: 10,
                }}
              >
                <div style={{ position: "absolute", top: -4, left: -4, width: 11, height: 8, backgroundColor: "#FF4A4A", borderRadius: 2 }} />
              </div>
            </div>
          </div>
        </div>

        {/* ---------- 🏢 SCREEN 2: AGENCY DASHBOARD (ቁመት ጨምሮ ወደ ላይ ከፍ ብሏል) ---------- */}
        <div
          style={{
            position: "absolute",
            top: `${agencyTopLocation}%`, // ከጽሑፍ ነፃ እንዲሆን ተስተካክሏል
            left: "50%",
            transform: `translate(-50%, -50%) translateY(${agencyYPosition}px)`,
            opacity: agencyOpacity,
            width: 800,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Building2 size={22} color="#f59e0b" strokeWidth={2.5} />
              <span
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 16,
                  color: "#f59e0b",
                  letterSpacing: 1.5,
                }}
              >
                VIDEO AGENCY GROWTH
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <TrendingUp size={20} color="#f59e0b" strokeWidth={2.5} />
              <span
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 900,
                  fontSize: 18,
                  color: "#f59e0b",
                }}
              >
                +38%
              </span>
            </div>
          </div>

          <div
            style={{
              borderRadius: 12,
              backgroundColor: "#141923",
              border: "2px solid rgba(245,158,11,0.3)",
              padding: "30px 35px", // ቁመት ለመጨመር padding ጨምረናል
              boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 40,
            }}
          >
            {/* የኢትዮጵያ ብር መጠን ማሳያ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: 1 }}>
                TOTAL REVENUE
              </div>
              <div 
                style={{ 
                  fontFamily: "system-ui, sans-serif", 
                  fontSize: 46, 
                  fontWeight: 950, 
                  color: "#fde047",
                  textShadow: "0 0 15px rgba(253,224,71,0.25)"
                }}
              >
                {formattedBr} ETB
              </div>
            </div>

            {/* 🚀 ቁመታቸው የጨመረ 4 አሞሌዎች (Taller Growth Bars) */}
            <svg width={300} height={150} viewBox="0 0 240 130" style={{ overflow: "visible" }}>
              <defs>
                <linearGradient id="agencyGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fde047" />
                </linearGradient>
              </defs>
              {bars.map((i) => {
                const barStart = 48 + i * 5;
                // ቁመታቸውን ይበልጥ ረጅም አድርገነዋል (ከ30-90 የነበረው አሁን እስከ 115 ያድጋል)
                const targetHeight = 35 + i * 26; 
                const h = interpolate(frame, [barStart, barStart + 12], [0, targetHeight], {
                  easing: Easing.out(Easing.cubic),
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const x = 15 + i * 56;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={120 - h} // ከታች መስመሩ ላይ ተነስተው ወደ ላይ ያድጋሉ
                    width={40}
                    height={h}
                    rx="6"
                    fill="url(#agencyGrad)"
                    opacity={0.95}
                  />
                );
              })}
              <line x1="0" y1="120" x2="230" y2="120" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
            </svg>
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};

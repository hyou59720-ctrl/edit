import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Audio, staticFile } from "remotion";
import { LayoutGrid, PenTool, CheckCircle2, Sparkles, Layout } from "lucide-react";

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

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

  const sceneScale = interpolate(frame, [0, 110], [1, 1.02], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateRight: "clamp",
  });

  /* ---------------- Animation Timings ---------------- */
  const contentOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const contentY = interpolate(frame, [0, 12], [30, 0], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });

  const checklistItems = ["Reference Concept", "Visual Layout", "Motion Design"];

  // ለቴምፕሌት ሳጥኖች አኒሜሽን መቆጣጠሪያ
  const templatePop1 = clamp(interpolate(frame, [12, 24], [0, 1], { easing: Easing.out(Easing.back(1.2)) }));
  const templatePop2 = clamp(interpolate(frame, [20, 32], [0, 1], { easing: Easing.out(Easing.back(1.2)) }));

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity, pointerEvents: "none" }}>
      
      {/* ---------------- 🎵 SOUND EFFECTS SEQUENCE ---------------- */}
      
      {/* 1. መክፈቻ — ቦርዱ ፍሬም 0 ላይ ሲገባ የሚሰማ የሽውታ ድምፅ */}
      <Audio src={staticFile("audio/whoosh.mp3")} volume={0.6} />

      {/* 2. ቴምፕሌቶች — በግራ በኩል ያሉት ሳጥኖች በየተራ ሲወጡ (Frame 12 እና 20) */}
      {frame === 12 && <Audio src={staticFile("audio/pop.mp3")} volume={0.6} />}
      {frame === 20 && <Audio src={staticFile("audio/pop.mp3")} volume={0.6} />}

      {/* 3. ቼክሊስት — በቀኝ ያሉት መስመሮች በየተራ Check ሲደረጉ (Frame 15, 30, እና 45) */}
      {frame === 15 && <Audio src={staticFile("audio/click.mp3")} volume={0.7} />}
      {frame === 30 && <Audio src={staticFile("audio/click.mp3")} volume={0.7} />}
      {frame === 45 && <Audio src={staticFile("audio/click.mp3")} volume={0.7} />}

      {/* ----------------------------------------------------------- */}

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
              "radial-gradient(ellipse at 50% 30%, #1e152a 0%, #0f0b18 55%, #050308 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "50%",
            width: 900,
            height: 600,
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(156,107,255,0.2) 0%, rgba(156,107,255,0) 70%)",
          }}
        />

        {/* ከላይ የሚቀመጥ ርዕስ (Header) */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: fadeIn,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <LayoutGrid size={22} color="#9C6BFF" strokeWidth={2.5} />
          <span style={{ fontFamily: "system-ui, sans-serif", fontWeight: 800, fontSize: 16, color: "#9C6BFF", letterSpacing: 2 }}>
            INSPIRATION & PLANNING
          </span>
        </div>

        {/* ---------- 🛠️ MAIN PLANNING BOARD ---------- */}
        <div
          style={{
            position: "absolute",
            top: "52%",
            left: "50%",
            transform: `translate(-50%, -50%) translateY(${contentY}px)`,
            opacity: contentOpacity,
            width: 800,
          }}
        >
          <div
            style={{
              borderRadius: 12,
              backgroundColor: "#130f1c",
              border: "2px solid rgba(156,107,255,0.3)",
              padding: "35px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 40,
            }}
          >
            {/* 📋 በግራ በኩል፡ የቪዲዮ/ፎቶ TEMPLATE መዋቅርን በግልጽ የሚያስረዳ ማሳያ */}
            <div
              style={{
                flex: 1,
                height: 220,
                borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(156,107,255,0.2)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                position: "relative",
              }}
            >
              {/* ቴምፕሌት Header ክፍል */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(156,107,255,0.15)", paddingBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Layout size={16} color="#9C6BFF" />
                  <div style={{ width: 70, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.5)" }} />
                </div>
                <Sparkles size={16} color="#FFC43D" />
              </div>
              
              {/* የፕላስ ማሳያ እና ዋናው የቪዲዮ ቴምፕሌት ቦክስ (Hero Layout Grid) */}
              <div 
                style={{ 
                  flex: 1.5, 
                  borderRadius: 6, 
                  background: "linear-gradient(135deg, rgba(156,107,255,0.15), rgba(90,140,255,0.08))",
                  border: "1px dashed rgba(156,107,255,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${templatePop1})`,
                  opacity: templatePop1,
                }}
              >
                {/* የካሜራ ክፈፍ ወይም የፎቶ ቴምፕሌት ጠርዝ ምልክት */}
                <div style={{ width: "85%", height: "75%", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>PREVIEW AREA</span>
                </div>
              </div>

              {/* ከስር ያሉ የንዑስ ቴምፕሌት ክፍሎች (Sub Layout Items) */}
              <div 
                style={{ 
                  display: "flex", 
                  gap: 10, 
                  height: 45,
                  transform: `scale(${templatePop2})`,
                  opacity: templatePop2,
                }}
              >
                <div style={{ flex: 1, borderRadius: 4, backgroundColor: "rgba(156,107,255,0.15)", border: "1px solid rgba(156,107,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "50%", height: 4, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 2 }} />
                </div>
                <div style={{ flex: 1, borderRadius: 4, backgroundColor: "rgba(156,107,255,0.15)", border: "1px solid rgba(156,107,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "50%", height: 4, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 2 }} />
                </div>
              </div>
            </div>

            {/* 📝 በቀኝ በኩል፡ የፕላኒንግ ቼክሊስት */}
            <div style={{ flex: 1.2, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <PenTool size={20} color="#ffffff" strokeWidth={2} />
                <span style={{ fontFamily: "system-ui, sans-serif", fontWeight: 800, fontSize: 18, color: "#ffffff", letterSpacing: 0.5 }}>
                  PRODUCTION STEPS
                </span>
              </div>

              {checklistItems.map((item, i) => {
                const startFrame = 15 + i * 15;
                const tick = clamp(interpolate(frame, [startFrame, startFrame + 10], [0, 1]));
                
                return (
                  <div 
                    key={item} 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 16, 
                      opacity: 0.3 + tick * 0.7,
                      transform: `translateX(${interpolate(tick, [0, 1], [-10, 0])}px)`,
                      transition: "all 0.2s ease-out"
                    }}
                  >
                    <CheckCircle2 
                      size={24} 
                      color={tick > 0.5 ? "#3ED598" : "rgba(255,255,255,0.2)"} 
                      fill={tick > 0.5 ? "rgba(62,213,152,0.1)" : "none"}
                      strokeWidth={2.5} 
                    />
                    <span 
                      style={{ 
                        fontFamily: "system-ui, sans-serif", 
                        fontWeight: 700, 
                        fontSize: 20, 
                        color: "#ffffff",
                      }}
                    >
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};

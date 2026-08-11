import React from "react";

export const GlassCard = ({
  title = "GLASS",
  subtitle = "morphism",
  width = 500,
  height = 500,
  borderRadius = 40,
}: {
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
  borderRadius?: number | string;
}) => {
  return (
    <div
      style={{
        width,
        height,
        background: "rgba(255, 255, 255, 0.03)",
        
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        
        borderRadius,
        // የካርዱ ዙሪያ ብርሃን (Glow እና Border) ይበልጥ ደማቅ እንዲሆን ተደርጓል
        border: "2px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 255, 255, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.4)",
        
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ከካርዱ ላይኛው ጠርዝ ላይ የሚታየው ብርሃን ውፍረቱ ጨምሮ በደምብ ጎልቶ እንዲታይ ተደርጓል */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "5%",
          right: "5%",
          height: "3px",
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 1), transparent)",
          boxShadow: "0 0 15px rgba(255, 255, 255, 0.8)",
          pointerEvents: "none",
        }}
      />

      <span
        style={{
          fontSize: 13,
          letterSpacing: "6px",
          color: "rgba(255, 255, 255, 0.6)",
          marginBottom: 20,
          zIndex: 1,
          textTransform: "uppercase",
        }}
      >
        · vector ·
      </span>

      <h1
        style={{
          margin: "0 0 5px 0",
          fontSize: 48,
          fontWeight: 800,
          letterSpacing: "3px",
          color: "#ffffff",
          zIndex: 1,
        }}
      >
        {title}
      </h1>

      <h2
        style={{
          margin: 0,
          fontSize: 44,
          fontWeight: 300,
          letterSpacing: "2px",
          color: "rgba(255, 255, 255, 0.9)",
          zIndex: 1,
        }}
      >
        {subtitle}
      </h2>

      <div
        style={{
          display: "flex",
          gap: 6,
          marginTop: 30,
          zIndex: 1,
        }}
      >
        <span style={{ width: 5, height: 5, background: "rgba(255,255,255,0.5)", borderRadius: "50%" }} />
        <span style={{ width: 5, height: 5, background: "rgba(255,255,255,0.5)", borderRadius: "50%" }} />
        <span style={{ width: 5, height: 5, background: "rgba(255,255,255,0.5)", borderRadius: "50%" }} />
      </div>
    </div>
  );
};

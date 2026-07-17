import React from "react";

export const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        width: 320,
        height: 660,
        borderRadius: 48,
        background: "#0a0a0a", // የውጪው ስልክ አካል (Bezel)
        padding: 12,
        boxShadow: "0 30px 80px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,255,255,0.05)",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 36,
          overflow: "hidden",
          position: "relative",
          background: "#ffffff", // የስክሪኑ ጀርባ ሙሉ በሙሉ ነጭ እንዲሆን
        }}
      >
        {/* 📱 Dynamic Island (ኖች) - በነጩ ጀርባ ላይ በጥቁር ቀለም ጎልቶ እንዲታይ ተደርጓል */}
        <div
          style={{
            position: "absolute",
            top: 11, // ከላይ ትንሽ እንዲወርድ
            left: "50%",
            transform: "translateX(-50%)",
            width: 85, // እውነተኛ የ Pill ቅርጽ ስፋት
            height: 25, // ቁመት
            background: "#000000", // ጥቁር ኖች
            borderRadius: 20, // ክብ የካፕሱል ቅርጽ
            zIndex: 30, // ከሁሉም በላይ እንዲሆን
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />

        {/* 🔋 Status Bar - ጀርባው ነጭ እና ጽሑፎቹ ጥቁር የሆኑ */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 42, // ለኖቹ የሚሆን በቂ ቁመት
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 22px 0",
            zIndex: 15,
            fontSize: 11,
            color: "#000000", // ሰዓት እና ባትሪ ጥቁር እንዲሆኑ
            fontWeight: 700,
            background: "#ffffff", // የጀርባው ቀለም ነጭ
          }}
        >
          <span>9:41</span>
          <span>100%</span>
        </div>

        {/* Screen content - የውስጠኛው የዩቲዩብ ፔጅ */}
        <div style={{ width: "100%", height: "100%" }}>
          {children}
        </div>

        {/* ➖ Home indicator - በነጩ ስክሪን ላይ እንዲታይ ወደ ጥቁር ተቀይሯል */}
        <div
          style={{
            position: "absolute",
            bottom: 6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 100,
            height: 4,
            borderRadius: 2,
            background: "rgba(0,0,0,0.7)", // በጥቁር የተሰራ የሆም መስመር
            zIndex: 20,
          }}
        />
      </div>
    </div>
  );
};

import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface TextProps {
  text: string;
  startFrame: number;
}

export const StyledSubtitleText: React.FC<TextProps> = ({ text, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");

  return (
    <div
      style={{
        fontSize: "110px",
        fontWeight: "900",
        textAlign: "center",
        textTransform: "uppercase",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        lineHeight: 1.2,
        letterSpacing: "-1px",
      }}
    >
      {words.map((word, index) => {
        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();

        // 1. የእንግሊዝኛ ቃላትን መለየት
        const isEnglish = /^[A-Za-z]+$/.test(cleanWord);

        // የቃላት መግቢያ ፖፕ (Pop) አኒሜሽን
        const wordDelay = index * 2.5;
        const wordSpring = spring({
          frame: frame - startFrame - wordDelay,
          fps,
          config: { damping: 11, stiffness: 140 },
        });

        const scale = interpolate(wordSpring, [0, 1], [0.65, 1]);
        const translateY = interpolate(wordSpring, [0, 1], [15, 0]);

        // 🔵 ለእንግሊዝኛ ቃላት፦ በ smooth gradient የተዋሃደና ደምቆ የሚበራ (Neon Glow) ሰማያዊ ዘዴ
        if (isEnglish) {
          return (
            <span
              key={`${word}-${index}`}
              style={{
                display: "inline-block",
                transform: `scale(${scale}) translateY(${translateY}px)`,
                fontFamily: "'Akira Expanded Demo', sans-serif",
                margin: "0 12px",
                whiteSpace: "nowrap",
                // ✨ በመሃል የነበረውን መስመር ለማጥፋት 50% የሚለውን በመተው smooth gradient እንዲሆን ተደርጓል
                background: "linear-gradient(to bottom, #38BDF8, #1D4ED8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                // 🌟 Glow እንዲያደርግ (የበለጠ ጎልቶ እንዲወጣ) የ drop-shadow መጠኑ ጨምሯል
                filter: "drop-shadow(0px 0px 20px rgba(56, 189, 248, 0.8)) drop-shadow(0px 0px 5px rgba(29, 78, 216, 0.5))",
              }}
            >
              {word}
            </span>
          );
        }

        // 🇪🇹 ለአማርኛ ቃላት፦ ሁሉም አንድ አይነት ነጭ ሆነው ውብ የሆነ ነጭ Glow እንዲኖራቸው የተደረገበት ዘዴ
        return (
          <span
            key={`${word}-${index}`}
            style={{
              display: "inline-block",
              transform: `scale(${scale}) translateY(${translateY}px)`,
              fontFamily: "'HabeshaStencil', sans-serif",
              color: "#FFFFFF", // ሁሉም አንድ አይነት ነጭ ቀለም
              margin: "0 12px",
              whiteSpace: "nowrap",
              // 🌟 ለአማርኛ ቃላቱ የተደረገ ውብ የነጭ Glow (የበለጠ ጎልቶ እንዲወጣ ያደርገዋል)
              filter: "drop-shadow(0px 0px 15px rgba(255, 255, 255, 0.6))",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

import React from "react";
// 🌟 ፎንቶቹን ከ index.ts ጠራናቸው
import {
  akiraFont,
  habeshaFont,
  inkfreeFont,
  surGraphicsFont,
  waldbaYebseFont,
  waldbaYigezuFont,
  yeshuahFont,
  montserratFont,
  tacticSans,
} from "./index";

export type CustomFontName =
  | "Akira"
  | "HabeshaSTENCIL"
  | "Inkfree"
  | "SurGraphics"
  | "WaldbaYebse"
  | "WaldbaYigezu"
  | "YESHUAH"
  | "MontserratBlack"
  | "TacticSans"
  | string; // ለ Google Fonts

interface FontRendererProps {
  fontName?: CustomFontName;
  children: React.ReactNode;
}

export const FontRenderer: React.FC<FontRendererProps> = ({ fontName, children }) => {
  let fontUrl = "";
  let fontFamily = fontName || "sans-serif";

  // 🌟 የተጻፈውን ስም ከትክክለኛው ፎንት ጋር ማገናኘት
  switch (fontName) {
    case "Akira": fontUrl = akiraFont as string; break;
    case "HabeshaSTENCIL": fontUrl = habeshaFont as string; break;
    case "Inkfree": fontUrl = inkfreeFont as string; break;
    case "SurGraphics": fontUrl = surGraphicsFont as string; break;
    case "WaldbaYebse": fontUrl = waldbaYebseFont as string; break;
    case "WaldbaYigezu": fontUrl = waldbaYigezuFont as string; break;
    case "YESHUAH": fontUrl = yeshuahFont as string; break;
    case "MontserratBlack": fontUrl = montserratFont as string; break;
    case "TacticSans": fontUrl = tacticSans as string; break;
    default: break;
  }

  // 🌟 ፋይሉ Local ከሌለ (Google Font ከሆነ) ሊንኩን ማዘጋጀት
  const isGoogleFont = fontName && !fontUrl && fontName !== "sans-serif";
  const googleFontUrl = isGoogleFont
    ? `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@400;700;900&display=swap`
    : null;

  return (
    <>
      {/* የ Local ፎንት CSS */}
      {fontUrl && (
        <style>
          {`
            @font-face {
              font-family: '${fontFamily}';
              src: url('${fontUrl}') format('${fontUrl.endsWith(".otf") ? "opentype" : "truetype"}');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
          `}
        </style>
      )}

      {/* የ Google ፎንት ሊንክ */}
      {googleFontUrl && <link rel="stylesheet" href={googleFontUrl} />}

      {/* ጽሁፉን ፎንት በመስጠት መጠቅለል */}
      <div style={{ fontFamily: `'${fontFamily}', sans-serif`, width: '100%' }}>
        {children}
      </div>
    </>
  );
};

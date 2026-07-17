import { AbsoluteFill } from "remotion";
import { ReactNode } from "react";

interface ColorGradeProps {
  children: ReactNode;
  active: boolean;
}

// 🎨 ሙሉ Color Correction / Grading እዚህ ብቻ ይስተካከላል
export const ColorGrade: React.FC<ColorGradeProps> = ({ children, active }) => {
  return (
    <AbsoluteFill>
      {/* ዋናው content (Video) filter እዚህ ይተገበርበታል */}
      <AbsoluteFill
        style={{
          opacity: active ? 1 : 0,
          filter: "contrast(1.12) saturate(1.2) brightness(1.15) hue-rotate(-2deg)",
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Split-tone overlay: teal shadows / warm highlights */}
      <AbsoluteFill
        style={{
          opacity: active ? 1 : 0,
          background:
            "linear-gradient(135deg, rgba(10,20,80,0.4) 0%, rgba(0,0,0,0) 45%, rgba(255,140,60,0.06) 100%)",
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          opacity: active ? 1 : 0,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Filmic black-lift */}
      <AbsoluteFill
        style={{
          opacity: active ? 0.5 : 0,
          background: "rgba(5,5,15,0.08)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

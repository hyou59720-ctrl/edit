// TornPaper.tsx
import React, { useMemo } from "react";

interface TornPaperProps {
  width: number;
  height: number;
  className?: string;
  seed?: number;
  children?: React.ReactNode;
  paperColor?: string;     // ዋናው የወረቀት ቀለም
  gradientColor?: string;  // የዳርቻው ትንሽ ጠቆር ያለ ቀለም
  tornSide?: "left" | "right" | "all";
  elevation?: number;
}

const rand = (seed: number, n: number) => {
  const x = Math.sin(seed * 111.7 + n * 17.9898) * 100000;
  return x - Math.floor(x);
};

const buildTornPath = (w: number, h: number, seed: number, tornSide: string) => {
  const jaggedEdge = (from: any, to: any, axis: string, offsetSeed: number, amp: number) => {
    const len = axis === "x" ? Math.abs(to.x - from.x) : Math.abs(to.y - from.y);
    const steps = Math.max(10, Math.round(len / 12));
    let d = "";
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const r1 = rand(seed, offsetSeed + i);
      const spike = (r1 - 0.5) * amp * (r1 > 0.8 ? 2 : 1);
      if (axis === "x") {
        d += `L ${from.x + (to.x - from.x) * t} ${from.y + spike} `;
      } else {
        d += `L ${from.x + spike} ${from.y + (to.y - from.y) * t} `;
      }
    }
    return d;
  };

  const amp = 8;
  let d = `M 0 0 `;
  d += tornSide === "all" ? jaggedEdge({ x: 0, y: 0 }, { x: w, y: 0 }, "x", 100, amp) : `L ${w} 0 `;
  d += tornSide === "right" || tornSide === "all" ? jaggedEdge({ x: w, y: 0 }, { x: w, y: h }, "y", 5000, amp) : `L ${w} ${h} `;
  d += tornSide === "all" ? jaggedEdge({ x: w, y: h }, { x: 0, y: h }, "x", 9000, amp) : `L 0 ${h} `;
  d += tornSide === "left" || tornSide === "all" ? jaggedEdge({ x: 0, y: h }, { x: 0, y: 0 }, "y", 14000, amp) : `L 0 0 `;
  d += "Z";
  return d;
};

export const TornPaper: React.FC<TornPaperProps> = ({
  width,
  height,
  className = "",
  seed = 2,
  children,
  paperColor = "#d9d4c3",
  gradientColor = "#e9e3ce",
  tornSide = "all",
  elevation = 15,
}) => {
  const clipId = `torn-clip-${seed}`;
  const path = useMemo(() => buildTornPath(width, height, seed, tornSide), [width, height, seed, tornSide]);

  return (
    <div
      className={`relative ${className}`}
      style={{
        width,
        height,
        // በጥራት እንዲታይ shadow ብቻ ነው የምንጠቀመው
        filter: `drop-shadow(0 ${elevation/2}px ${elevation/2}px rgba(0,0,0,0.15))`,
      }}
    >
      <svg width={width} height={height} className="absolute inset-0" style={{ overflow: "visible" }}>
        <defs>
          <clipPath id={clipId}><path d={path} /></clipPath>
          {/* ለወረቀቱ ጥልቀት እንዲሰጥ gradient */}
          <linearGradient id={`grad-${seed}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={paperColor} />
            <stop offset="100%" stopColor={gradientColor} />
          </linearGradient>
        </defs>

        {/* ዋናው የወረቀት አካል (ያለ ብዥታ) */}
        <path d={path} fill={`url(#grad-${seed})`} />

        {/* የነጭ ጠርዝ (The White Core) - በጣም ጥርት ያለ */}
        <path
          d={path}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={5}
          strokeLinejoin="round"
        />
        
        {/* የዳርቻው ጥላ (Edge definition) */}
        <path
          d={path}
          fill="none"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth={1}
          transform="translate(1,1)"
        />
      </svg>

      {/* ጽሑፍ ያለ ብዥታ በትክክል እንዲታይ */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ clipPath: `url(#${clipId})` }}
      >
        {children}
      </div>
    </div>
  );
};

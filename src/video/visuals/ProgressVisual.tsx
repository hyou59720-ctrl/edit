import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VisualProps } from "../types";

/* PROGRESS — ቻርቱ በመሃል ሲደርስ ድንገት ቆሞ ቀስቱ ወደ "X" የሚቀየርበት Premium Effect */
export const ProgressVisual: React.FC<VisualProps> = ({ frame, start, end }) => {
  const videoConfig = useVideoConfig();
  const data = [12, 30, 22, 48, 40, 62, 55, 78, 70, 92];
  const w = 320;
  const h = 180;
  const pad = 25; 

  const xScale = (i: number) => (i / (data.length - 1)) * (w - pad * 2) + pad;
  const yScale = (v: number) => h - pad - (v / 100) * (h - pad * 2);
  
  const linePath = data.map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(v)}`).join(" ");
  const areaPath = `${linePath} L ${xScale(data.length - 1)} ${h - pad} L ${xScale(0)} ${h - pad} Z`;

  const duration = Math.max(1, end - start);
  const currentProgress = frame - start;

  // 1. "ይቆማል!" ለሚለው ቻርቱን በትክክል 50% (መሃል) ላይ ማቆሚያ ስሌት
  const maxProgressRatio = 0.52; // ቻርቱ ከግማሽ በላይ እንዳይሄድ እዚህ ላይ ይቆልፋል
  const freezeFrame = duration * 0.4; // ቆም የሚልበት የፍሬም መነሻ

  const progressRatio = interpolate(currentProgress, [0, freezeFrame], [0, maxProgressRatio], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isFrozen = currentProgress >= freezeFrame;

  // 2. በቆመበት ቅጽበት ለሚፈጠረው የ"X" ምልክት ስፕሪንግ አኒሜሽን
  const xSpring = spring({
    frame: currentProgress - freezeFrame,
    fps: videoConfig.fps,
    config: { damping: 10, stiffness: 120 },
  });

  const clipWidth = progressRatio * (w - pad * 2);

  // የመስመሩ መጨረሻ ጫፍ (የቆመበት መጋጠሚያ) መፈለጊያ
  const currentDataIndex = Math.min(
    data.length - 1,
    Math.floor(progressRatio * (data.length - 1))
  );
  const nextDataIndex = Math.min(data.length - 1, currentDataIndex + 1);
  const localRatio = (progressRatio * (data.length - 1)) % 1;

  const currentX = pad + clipWidth;
  const currentY = interpolate(
    localRatio,
    [0, 1],
    [yScale(data[currentDataIndex]), yScale(data[nextDataIndex])]
  );

  // 3. ድንገት ሲቆም የሚፈጠር የድንጋጤ (Error Flash) ብልጭታ ስሌት
  const flashIntensity = isFrozen ? interpolate(Math.sin(frame * 0.8), [-1, 1], [0.3, 0.9]) : 1;
  const errorColor = "#ef4444"; // ቀይ ከለር
  const normalColor = "#10b981"; // አረንጓዴ ከለር
  const activeColor = isFrozen ? errorColor : normalColor;

  return (
    <svg 
      width={w} 
      height={h} 
      viewBox={`0 0 ${w} ${h}`} 
      style={{ 
        overflow: "visible",
        // ሲቆም በትንሹ የመንቀጥቀጥ (Shake) ስሜት እንዲሰጥ
        transform: isFrozen ? `translate(${Math.sin(frame * 1.5) * 1.5}px, ${Math.cos(frame * 1.5) * 1.5}px)` : "none"
      }}
    >
      <defs>
        {/* የቻርቱ የታችኛው ክፍል ከለር Gradient (ሲቆም ወደ ቀይ ይለወጣል) */}
        <linearGradient id="progressArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={activeColor} stopOpacity={isFrozen ? 0.5 : 0.4} />
          <stop offset="100%" stopColor={isFrozen ? "#b91c1c" : "#06b6d4"} stopOpacity="0" />
        </linearGradient>

        {/* የNeon Glow ማድረጊያ */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* መደበኛው አረንጓዴ ቀስት (እስከሚቆም ድረስ ብቻ የሚያገለግል) */}
        {!isFrozen && (
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill={normalColor} />
          </marker>
        )}

        <clipPath id="progressClip">
          <rect x={pad} y={0} width={clipWidth} height={h} />
        </clipPath>
      </defs>

      {/* የጀርባው Gradient ስእል */}
      <path d={areaPath} fill="url(#progressArea)" clipPath="url(#progressClip)" />

      {/* የጀርባው የኒዮን መስመር ፍካት */}
      <path
        d={linePath}
        fill="none"
        stroke={isFrozen ? errorColor : "#06b6d4"}
        strokeWidth="6"
        opacity={isFrozen ? flashIntensity : 0.5}
        filter="url(#glow)"
        clipPath="url(#progressClip)"
      />

      {/* ዋናው የቻርት መስመር */}
      <path
        d={linePath}
        fill="none"
        stroke={activeColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={!isFrozen ? "url(#arrow)" : undefined}
        clipPath="url(#progressClip)"
      />

      {/* 4. ድንገት ሲቆም በመሃል ቀስቱ ተቆርጦ ወደ "X" ምልክት የሚቀየርበት ማራኪ አኒሜሽን */}
      {isFrozen && (
        <g 
          transform={`translate(${currentX}, ${currentY}) scale(${xSpring * 1.3})`}
          filter="url(#glow)"
        >
          {/* የጀርባው ቀይ የክብ ማስጠንቀቂያ ግሎው */}
          <circle r="12" fill={errorColor} opacity="0.3" />
          
          {/* የ"X" ምልክት መስመሮች */}
          <line x1="-6" y1="-6" x2="6" y2="6" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="6" y1="-6" x2="-6" y2="6" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      )}

      {/* የGlowing Dot ነጥብ (ከመቆሙ በፊት ብቻ የምትታይ) */}
      {!isFrozen && progressRatio > 0 && (
        <g transform={`translate(${currentX}, ${currentY})`}>
          <circle r="7" fill={normalColor} opacity="0.6" filter="url(#glow)" />
          <circle r="3" fill="#ffffff" />
        </g>
      )}
    </svg>
  );
};

import React, {useMemo} from 'react';
import {
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  Easing,
  Video,
  staticFile,
  AbsoluteFill,
} from 'remotion';




const mainContainerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#000000', // Screen blend mode በትክክል እንዲሰራ ጀርባው ንጹህ ጥቁር መሆን አለበት
  overflow: 'hidden',
};

// ካርታው ያለበት ኮንቴይነር (መሃል ላይ እንዲሆን)
const MapContainerStyle: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  // Map ቪዲዮው ከላንድስኬፕ ወደ ወርቲካል ( contain ) ስታይል ሲመጣ 
  // ትልቅ የጥቁር ቦታ ከላይ እና ከታች ይኖራል - እሱን እንጠቀማለን።
  aspectRatio: '16 / 9',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
};

// የቪዲዮውን ጀርባ ለማጥፋት (Blending) የምንጠቀመው ስታይል
const mapVideoStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    // 🌟 የቪዲዮውን ጥራት ለማሳደግ filters
    filter: "contrast(1.2) saturate(1.1) brightness(1.1) hue-rotate(10deg)", // hue-rotate የሰማያዊውን ቀለም ትንሽ የተለየ ያደርገዋል
    // 🌟 Blend Mode (ጥቁሩን አጥፍቶ ብርሃኑን ብቻ ያሳያል)
    mixBlendMode: "screen",
};

// 🌟 የ UI አካላት የሚያብለጨልጭ (Neon) ስታይል
const neonTextStyle: React.CSSProperties = {
  fontFamily: 'Courier New, monospace',
  fontWeight: 'bold',
  color: '#bae6fd', // ቀለል ያለ ሰማያዊ
  textShadow: '0 0 5px #38bdf8, 0 0 10px #38bdf8, 0 0 20px #0284c7',
  textTransform: 'uppercase',
};

const UIElementContainerStyle: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  left: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 20,
  padding: '10px',
  color: 'white',
};

const GlobalClientsBroll: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // መግቢያ እና መውጫ Opacity (Fade in/out)
  const opacity = interpolate(frame, [0, 20, 90, 100], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // የመግቢያ Scale (ብቅ ማለት)
  const introScale = interpolate(frame, [0, 25], [0.8, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });

  // ቀስ ያለ የንዝረት/የመቀሳቀስ (Floating) animation
  const floatAnim = Math.sin(frame / 15) * 5;

  // 🌟 አኒሜሽኑ ከካርታው ጋር እኩል ብቅ እንዲል የምንጠቀመው Opacity
  const uiOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });

  // የታችኛውን የLog ጽሁፎች ለማዘጋጀት memoization እንጠቀማለን (ለperformance)
  const logEntries = useMemo(() => [
    "[NET] IP_REQUEST::USA_HUB",
    "[FREELANCE] SYNC::PROJECT_ALPHA",
    "[CONTRACT] SECURED::NEW_YORK",
    "[PAY] STATUS::USD::RECEIVED",
    "[SYS] SEARCH::LOCAL_TALENT::FOUND",
  ], []);

  // 🌟 አጠቃላይ Broll መግቢያ እና መውጫ Fade In/Out አኒሜሽን
  const brollFade = interpolate(
    frame,
    [0, 15, 85, 100], // frame numbers
    [0, 1, 1, 0], // opacity values
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    // 🌟 እዚህ ስታይል ላይ brollFade opacity ተጨምሯል
    <div style={{...mainContainerStyle, opacity: brollFade}}>
      {/* 🌟 1. ጀርባ (Layer 0) */}
      <AbsoluteFill>
      </AbsoluteFill>

      {/* 🌟 2. የካርታው ቪዲዮ (Layer 10) */}
      <div style={{...MapContainerStyle, transform: `translate(-50%, calc(-50% + ${floatAnim}px)) scale(${interpolate(frame, [0, 100], [1.1, 1])})`, opacity: opacity}}>
        <Video
          src={staticFile('worldmap.mp4')}
          playbackRate={2.5} 
          style={mapVideoStyle}
          muted
        />
      </div>

      {/* 🌟 3. የላይኛው UI ( Layer 20 ) - ከካርታው በላይ ካለው ጥቁር ቦታ */}
      <div style={{...UIElementContainerStyle, top: '2%', opacity: uiOpacity, transform: `translateY(${-floatAnim / 2}px) scale(${introScale})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', ...neonTextStyle, fontSize: '18px'}}>
          <div style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#34d399', boxShadow: '0 0 8px #34d399', animation: 'pulse 1s infinite'}}/>
          NETWORK HUB::ACTIVE
        </div>
        <div style={{fontSize: '12px', ...neonTextStyle, color: 'rgba(186, 230, 253, 0.7)'}}>SCANNING::GLOBAL_FREELANCE_MARKET</div>
        <div style={{marginTop: '5px', width: '200px', height: '3px', background: 'rgba(56, 189, 248, 0.2)', position: 'relative', overflow: 'hidden'}}>
            <div style={{position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)', animation: 'progress 2s linear infinite'}}/>
        </div>
      </div>

      {/* 🌟 4. የታችኛው UI ( Layer 20 ) - ከካርታው በታች ካለው ጥቁር ቦታ */}
      <div style={{...UIElementContainerStyle, bottom: '5%', opacity: uiOpacity, transform: `translateY(${floatAnim / 2}px) scale(${introScale})`, alignItems: 'flex-start', left: '10%', width: 'auto'}}>
        <div style={{...neonTextStyle, fontSize: '16px', borderBottom: '1px solid rgba(56, 189, 248, 0.4)', paddingBottom: '3px', marginBottom: '5px'}}>
          GLOBAL CONTRACTS LOG
        </div>
        
        {/* የጽሁፍ ዝርዝር (Log) */}
        {logEntries.map((entry, index) => {
          // እያንዳንዱ ጽሁፍ ተራ በተራ ብቅ እንዲል (Staggered animation)
          const startTime = 40 + (index * 8); // ከ40 frame ጀምሮ ተራ በተራ
          const entryOpacity = interpolate(frame, [startTime, startTime + 10], [0, 1], {extrapolateRight: 'clamp'});
          const entrySlide = interpolate(frame, [startTime, startTime + 15], [20, 0], {easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp'});

          return (
            <div 
              key={entry} 
              style={{
                ...neonTextStyle, 
                fontSize: '11px', 
                color: index === 3 ? '#a78bfa' : 'rgba(186, 230, 253, 0.8)', // የክፍያ ጽሁፉን ቀለም የተለየ እናደርጋለን (Purple)
                paddingLeft: '5px',
                marginTop: '2px',
                borderLeft: '2px solid rgba(56, 189, 248, 0.2)',
                opacity: entryOpacity,
                transform: `translateX(${entrySlide}px)`,
              }}
            >
              {entry}
            </div>
          );
        })}
        
        {/* የ "SEARCHING" መስመር */}
        <div style={{...neonTextStyle, fontSize: '11px', color: '#facc15', marginTop: '5px', animation: 'blink 1.5s infinite'}}>
           [STATUS]::SEARCHING...
        </div>
      </div>

      {/* 🌟 CSS animations ለ pulse, blinking እና progress bar */}
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
        @keyframes progress { 0% { left: -100%; } 100% { left: 100%; } }
      `}</style>
    </div>
  );
};

export default GlobalClientsBroll;

import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import React from "react";
import { Background } from "./Background"; // እንደ አስፈላጊነቱ ፋይል ማውጫውን (path) አስተካክል

// 🖼️ ምስሉን በቀጥታ ከ icon ፎልደር Import ማድረግ
import img6 from "../icon/6.png"; 

export const Broll2 = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. መላው የሶፍትዌር መስኮት መግቢያ (Spring intro)
  const windowScale = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 100 },
  });

  // 2. 🚪 ወደ Broll3 ለመሄጃ መውጫ አኒሜሽን - ሙሉ በሙሉ እንዲቆም ተደርጓል (ምንም ትራንዚሽን የለም)
  const outroProgress = 0; 
  const finalScale = windowScale;
  const translateYOut = 0;
  const translateXOut = 0;
  const finalOpacity = 1;

  // 3. የጊዜ መስመር አጫዋች (Playhead Movement)
  const playheadProgress = interpolate(
    frame % durationInFrames,
    [0, durationInFrames],
    [15, 95],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 4. የማውዝ ቀስት (Cursor) እንቅስቃሴ
  const cursorX = interpolate(
    frame % durationInFrames,
    [0, durationInFrames],
    [160, 930],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cursorY = 410; 

  // 5. ተንሳፋፊ አካላት ረጋ ያለ እንቅስቃሴ
  const floatY1 = interpolate(Math.sin(frame / 10), [-1, 1], [-8, 8]);
  const floatY2 = interpolate(Math.cos(frame / 12), [-1, 1], [-6, 10]);
  const rotateFloat = interpolate(Math.sin(frame / 15), [-1, 1], [-4, 4]);

  return (
    <Background opacity={finalOpacity}>
      
      {/* ዋናው የሶፍትዌር በይነገጽ */}
      <div
        className="relative w-[1000px] h-[560px] rounded-2xl bg-[#171424]/90 border border-[#3A3358]/55 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden backdrop-blur-md"
        style={{ 
          transform: `scale(${finalScale}) translate(${translateXOut}px, ${translateYOut}px)`,
          opacity: finalOpacity,
        }}
      >
        {/* የሶፍትዌር የላይኛው ባር */}
        <div className="h-12 border-b border-[#25203A] flex items-center justify-between px-5 bg-[#1B172C]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-[#A39FBA] text-xs font-semibold ml-4 tracking-wider uppercase">Project Editor Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-2 w-24 bg-[#2A2444] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: "70%" }} />
            </div>
            <span className="text-[#A39FBA] text-[11px] font-mono">Rendering... 70%</span>
          </div>
        </div>

        {/* የሶፍትዌር ውስጠኛ የስራ ቦታ */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* የጎን ምናሌ */}
          <div className="w-16 border-r border-[#25203A] bg-[#141121] flex flex-col items-center py-4 gap-6">
            <div className="w-10 h-10 rounded-xl bg-[#2A2444] flex items-center justify-center text-purple-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-2 12H4V8h16v10z"/></svg>
            </div>
            <div className="text-[#645F80] hover:text-white transition-colors cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/></svg>
            </div>
            <div className="text-[#645F80] hover:text-white transition-colors cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/></svg>
            </div>
            <div className="text-[#645F80] hover:text-white transition-colors cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L3.7 8.7C3.13 8.13 2 8.53 2 9.5V15c0 .55.45 1 1 1h5.5c.97 0 1.37-1.13.7-1.7l-2-2c1.45-1.25 3.32-2 5.3-2 3.8 0 7.03 2.54 8.14 6 .17.53.66.9 1.22.9h.1c.82 0 1.43-.79 1.19-1.58C21.75 11.23 17.51 8 12.5 8z"/></svg>
            </div>
          </div>

          {/* ዋናው የቪዲዮ ማሳያ እና የጊዜ መስመር */}
          <div className="flex-1 flex flex-col bg-[#110E1C] relative">
            
            {/* የቪዲዮ ማሳያ ቦታ */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-0">
              <div className="relative w-[500px] h-[280px] rounded-xl overflow-hidden border-2 border-[#3F3763] bg-[#090710] shadow-2xl flex items-center justify-center">
                
                {/* 🖼️ የተስተካከለው ምስል - አሁን img6 ን ይጠቀማል */}
                <img 
                  src={img6} 
                  alt="Video Preview" 
                  className="w-full h-full object-cover"
                />
                
                {/* ጥቁር ጥላ ማሳያ */}
                <div className="absolute inset-0 bg-black/30 pointer-events-none" />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#1E1233]/40 to-[#3B1F54]/40 text-center p-4">
                  <div className="w-14 h-14 rounded-full bg-purple-600/30 flex items-center justify-center border border-purple-500/50 mb-3 animate-pulse">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                  </div>
                  <span className="text-white text-sm font-semibold">Previewing Clip "6.png"</span>
                  <span className="text-purple-300 text-xs mt-1">00:02 / 00:10</span>
                </div>

                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 border border-red-500/50 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  <span className="text-[10px] text-white font-bold tracking-widest uppercase">REC</span>
                </div>
              </div>
            </div>

            {/* የጊዜ ሰሌዳ */}
            <div className="h-44 border-t border-[#25203A] bg-[#161326] flex flex-col relative z-10">
              <div className="h-6 border-b border-[#25203A] flex items-center bg-[#1B172C] select-none">
                <div className="w-32 border-r border-[#25203A]" />
                <div className="flex-1 flex justify-between text-[10px] text-[#555073] font-mono px-4">
                  <span>00:00:00</span>
                  <span>00:00:02</span>
                  <span>00:00:04</span>
                  <span>00:00:06</span>
                  <span>00:00:08</span>
                  <span>00:00:10</span>
                </div>
              </div>

              <div className="flex-1 flex relative overflow-hidden">
                <div className="w-32 border-r border-[#25203A] bg-[#141121] flex flex-col font-mono text-[#A39FBA] text-[11px] select-none">
                  <div className="h-10 border-b border-[#25203A] flex items-center justify-between px-3">
                    <span>V2</span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                  </div>
                  <div className="h-10 border-b border-[#25203A] flex items-center justify-between px-3 bg-[#1B172C]">
                    <span className="text-white font-bold">V1</span><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                  </div>
                  <div className="h-7 border-b border-[#25203A] flex items-center px-3 gap-2 text-cyan-400">
                    <span>A1</span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                  </div>
                  <div className="h-7 border-b border-[#25203A] flex items-center px-3 gap-2 text-cyan-400/70">
                    <span>A2</span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                  </div>
                </div>

                <div className="flex-1 flex flex-col relative px-4 py-0 justify-start mt-0">
                  <div className="h-10 w-full border-b border-[#25203A] relative"/>
                  
                  <div className="h-10 w-full border-b border-[#25203A] relative flex items-center gap-1">
                    <div className="w-[10%] h-7 bg-gray-600/50 rounded border border-gray-500/50" />
                    <div className="w-[30%] h-7 bg-purple-500/30 border-2 border-purple-500/60 rounded flex items-center px-2 gap-1.5 overflow-hidden shadow-[inset_0_0_10px_rgba(168,85,247,0.2)]">
                       <div className="w-6 h-5 rounded-sm bg-black/40 overflow-hidden flex-shrink-0">
                         {/* የጊዜ መስመር ላይ ያለው ምስል እዚህም img6 እንዲጠቀም ተደርጓል */}
                         <img src={img6} className="w-full h-full object-cover opacity-80" />
                       </div>
                       <span className="text-[9px] text-purple-100 font-medium truncate">6.png [V]</span>
                    </div>
                    <div className="w-[45%] h-7 bg-blue-500/20 border border-blue-500/50 rounded flex items-center px-2 gap-1 overflow-hidden">
                       <span className="text-[9px] text-blue-200 truncate">Broll_Landscape_Master_Final.mp4</span>
                    </div>
                  </div>

                  <div className="h-7 w-full border-b border-[#25203A] relative flex items-center">
                    <div className="w-[90%] h-5 bg-cyan-500/10 border border-cyan-500/30 rounded-sm relative flex items-center overflow-hidden">
                      <div className="absolute inset-0 flex items-center gap-[1.5px] px-1.5 py-0.5">
                        {[30, 60, 45, 90, 20, 75, 40, 85, 30, 60, 80, 40, 95, 20, 50, 70, 40, 85, 30, 60, 50, 10, 80, 35, 90, 40, 55, 70, 30, 85, 40, 60, 90, 20, 75, 40, 80, 50, 65, 30, 85, 40, 60, 95, 20, 70].map((val, idx) => (
                          <div key={idx} className="bg-cyan-400/50 rounded-full w-[2px]" style={{ height: `${val}%` }} />
                        ))}
                      </div>
                      <span className="absolute left-2 text-[8px] text-cyan-200 font-mono bg-[#161326]/80 px-1 rounded">Audio Track.wav [A1]</span>
                    </div>
                  </div>

                  <div className="h-7 w-full border-b border-[#25203A] relative"/>

                  <div 
                    className="absolute top-[-24px] bottom-0 w-[2px] bg-red-500 shadow-[0_0_10px_#EF4444] z-20 pointer-events-none"
                    style={{ left: `${playheadProgress}%` }}
                  >
                    <div className="absolute top-0 -left-[6px] w-0 h-0 
                      border-l-[6px] border-l-transparent 
                      border-r-[6px] border-r-transparent 
                      border-t-[10px] border-t-blue-500
                      filter drop-shadow(0 2px 2px rgba(0,0,0,0.5))">
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ተንሳፋፊ አካል 1 */}
      <div 
        className="absolute left-[8%] bottom-[15%] p-3 bg-gradient-to-r from-[#251A4D] to-[#1D113B] rounded-2xl border border-[#4C2899] shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center gap-3 z-20"
        style={{ 
          transform: `translateY(${floatY1 + translateYOut}px) rotate(${rotateFloat}deg) scale(${interpolate(outroProgress, [0, 1], [1, 1])})`,
          opacity: finalOpacity,
        }}
      >
        <div className="w-10 h-10 rounded-xl bg-purple-600/30 flex items-center justify-center text-purple-300 border border-purple-500/40">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v18c-4.97 0-9-4.03-9-9s4.03-9 9-9zm0 2c-3.87 0-7 3.13-7 7s3.13 7 7 7V5z"/></svg>
        </div>
        <div className="flex flex-col pr-2">
          <span className="text-white text-[11px] font-bold">Audio Track.wav</span>
          <span className="text-purple-300 text-[9px]">44.1 kHz • Stereo</span>
        </div>
      </div>

      {/* ተንሳፋፊ አካል 2 */}
      <div 
        className="absolute right-[8%] bottom-[18%] p-3.5 bg-[#1F1935]/95 rounded-2xl border border-[#3B2F63] shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col gap-2.5 z-20"
        style={{ 
          transform: `translateY(${floatY2 + translateYOut}px) rotate(${-rotateFloat}deg) scale(${interpolate(outroProgress, [0, 1], [1, 1])})`,
          opacity: finalOpacity,
        }}
      >
        <span className="text-[#8E86AB] text-[10px] font-bold tracking-wider uppercase">Quick Presets</span>
        <div className="flex gap-2">
          <span className="w-6 h-6 rounded-md bg-purple-500 shadow-[0_0_8px_#A855F7] cursor-pointer" />
          <span className="w-6 h-6 rounded-md bg-blue-500 shadow-[0_0_8px_#3B82F6] cursor-pointer" />
          <span className="w-6 h-6 rounded-md bg-cyan-400 shadow-[0_0_8px_#22D3EE] cursor-pointer" />
          <span className="w-6 h-6 rounded-md bg-emerald-400 shadow-[0_0_8px_#34D399] cursor-pointer" />
        </div>
      </div>

      {/* ተንሳፋፊ አካል 3 */}
      <div 
        className="absolute z-50 pointer-events-none"
        style={{ 
          left: `${cursorX + translateXOut}px`,
          top: `${cursorY + translateYOut}px`,
          transform: `translate(${floatY1 * 0.5}px, ${floatY2 * 0.3}px) scale(${interpolate(outroProgress, [0, 1], [1, 1])})`,
          opacity: finalOpacity,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)]">
          <path d="M4.5 3V19.5L9.8 14.2H17L4.5 3Z" fill="white" stroke="#6D28D9" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
      </div>

    </Background>
  );
};

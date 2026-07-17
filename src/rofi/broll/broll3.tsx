import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import React from "react";
import { Background } from "./Background"; // እንደ አስፈላጊነቱ የፋይል ማውጫውን (path) ያስተካክሉ

// 🖼️ ዋናውን ምስል ከ icon ፎልደር Import ማድረግ
import img6 from "../icon/6.png";

// 🖼️ ለግራ ካርዶች የሚሆኑ ምስሎችን Import ማድረግ
import img7 from "../icon/7.png";
import img8 from "../icon/8.png";
import img9 from "../icon/9.png";
import img10 from "../icon/10.png";

// 🖼️ በቀኝ ላሉት ካርዶች የሚሆኑ ምስሎችን Import ማድረግ
import img11 from "../icon/11.png";
import img12 from "../icon/12.png";
import img13 from "../icon/13.png";
import img14 from "../icon/14.png";

export const Broll3 = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig(); // ቆይታው በ composition ላይ 84 መሆን አለበት

  // 1. የሶፍትዌር ኤዲተር Zoom አኒሜሽን
  // ከ 5 ፍሬም ጀምሮ ወደ 0.6 ይቀንሳል። ከ 60 ፍሬም በኋላም ያለምንም የዙም (zoom) ጭማሪ በ 0.6 ላይ ጸንቶ ይቆማል።
  const shrinkScale = interpolate(frame, [5, 25, 60, 84], [1, 0.6, 0.6, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // 2. የካርዶቹ መግቢያ አኒሜሽን
  // ከ 10-30 ፍሬም ይወጣሉ። ከ 60 ፍሬም በኋላ ሳይደበቁ እዚያው ባሉበት ይቆያሉ (እሴቱ 1 ላይ ይረጋል)።
  const cardsProgress = interpolate(frame, [10, 30, 60, 80], [0, 1, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 3. ✨ የብርሃን ለውጦች (Color Transitions and Tints)

  // 🔴 8ቱ ካርዶች ሁልጊዜ ቀይ Glow እና ቀይ Tint እንዲኖራቸው ተደርጓል
  const cardsShadowColor = 'rgba(220, 38, 38, 0.9)';
  const cardsTint = 'bg-red-600/40';

  // 🟢 ለመሃሉ ሶፍትዌር ኤዲተር ብቻ የሚሆን የ glow ቀለም - በ frame 60 ላይ ወደ ኃይለኛ አረንጓዴ ይቀየራል
  const editorGlowColor = interpolate(frame, [59, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) === 1 ? 'rgba(16, 185, 129, 0.95)' : 'rgba(0, 0, 0, 0.5)';

  // ለመሃሉ ኤዲተር የ glow መጠን - በ frame 60 ላይ ይጨምራል (glow ያደርጋል)
  const editorGlowRadius = interpolate(frame, [59, 60], [30, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 4. የጊዜ መስመር አጫዋች (Playhead Movement)
  const playheadProgress = interpolate(
    frame % durationInFrames,
    [0, durationInFrames],
    [15, 95],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // የግራ ካርዶች ዝርዝር ከነ ምስላቸው (7.png - 10.png)
  const leftCards = [
    { id: 1, text: "Tutorial 1", image: img7 },
    { id: 2, text: "Tutorial 2", image: img8 },
    { id: 3, text: "Tutorial 3", image: img9 },
    { id: 4, text: "20+ Tutorials", image: img10 }
  ];

  // የቀኝ ካርዶች ዝርዝር ከነ ምስላቸው (11.png - 14.png)
  const rightCards = [
    { id: 1, text: "Tutorial 5", image: img11 },
    { id: 2, text: "Tutorial 6", image: img12 },
    { id: 3, text: "Tutorial 7", image: img13 },
    { id: 4, text: "PDF Guides", image: img14 }
  ];

  return (
    <Background opacity={1}>
      
      {/* 1. የግራ ካርዶች ድርድር (Stacked Left) - ቲክቶክ ሳይዝ ሙሉ ምስል የያዙ */}
      {leftCards.map((card, idx) => {
        // ወደ ግራ በረድፍ ለመዘርጋት የኤክስ-አክሲስ (X-Axis) ስሌት
        const finalTranslateX = -260 - (idx * 90); 
        const currentTranslateX = interpolate(cardsProgress, [0, 1], [-100, finalTranslateX]);
        const scale = interpolate(cardsProgress, [0, 1], [0.8, 1 - (idx * 0.05)]);
        const rotation = -4 - (idx * 3); // እያንዳንዱ ካርድ በትንሹ ዘመም እንዲል
        
        return (
          <div
            key={`left-${card.id}`}
            // z-10 ተደርጓል (ከመሃሉ ኤዲተር z-20 በስተጀርባ/በስተኋላ እንዲሆኑ)
            className="absolute w-[135px] h-[240px] bg-[#171424]/95 border border-[#3A3358]/30 rounded-2xl flex flex-col justify-end p-3.5 shadow-2xl backdrop-blur-md overflow-hidden"
            style={{
              transform: `translateX(${currentTranslateX}px) scale(${scale}) rotate(${rotation}deg)`,
              opacity: cardsProgress,
              zIndex: 10 - idx, 
              boxShadow: `0 10px 40px ${cardsShadowColor}`
            }}
          >
            {/* 🖼️ ሙሉውን ካርድ የሚሸፍን የቲክቶክ ሳይዝ ምስል */}
            <img 
              src={card.image} 
              alt={card.text} 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            
            {/* ✨ በቀይ ከለር መሸፈኛ (Red Tint Overlay) - ለብቻው ጸንቶ የሚቆይ */}
            <div className={`absolute inset-0 ${cardsTint}`} />

            {/* 🖤 ጽሑፉ በደንብ እንዲታይ ከስር የሚደረግ የጥቁር ጥላ ፈሳሽ (Gradient) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />

            {/* ▶️ መሃል ላይ የሚቀመጥ ቆንጆ የፕሌይ ምልክት */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white bg-black/40 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center border border-white/20 text-lg shadow-lg">▶</span>
            </div>

            {/* 📝 የካርዱ ጽሑፍ ከስር */}
            <div className="relative z-10 flex flex-col items-center w-full">
              <div className="text-white text-[11px] font-black text-center leading-tight w-full truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {card.text}
              </div>
              <div className="w-10 h-[3px] bg-red-500 rounded mt-2" />
            </div>
          </div>
        );
      })}

      {/* 2. የቀኝ ካርዶች ድርድር (Stacked Right) - ቲክቶክ ሳይዝ ሙሉ ምስል የያዙ */}
      {rightCards.map((card, idx) => {
        // ወደ ቀኝ በረድፍ ለመዘርጋት የኤክስ-አክሲስ (X-Axis) ስሌት
        const finalTranslateX = 260 + (idx * 90); 
        const currentTranslateX = interpolate(cardsProgress, [0, 1], [100, finalTranslateX]);
        const scale = interpolate(cardsProgress, [0, 1], [0.8, 1 - (idx * 0.05)]);
        const rotation = 4 + (idx * 3);
        
        return (
          <div
            key={`right-${card.id}`}
            // z-10 ተደርጓል (ከመሃሉ ኤዲተር z-20 በስተጀርባ/በስተኋላ እንዲሆኑ)
            className="absolute w-[135px] h-[240px] bg-[#171424]/95 border border-[#3A3358]/30 rounded-2xl flex flex-col justify-end p-3.5 shadow-2xl backdrop-blur-md overflow-hidden"
            style={{
              transform: `translateX(${currentTranslateX}px) scale(${scale}) rotate(${rotation}deg)`,
              opacity: cardsProgress,
              zIndex: 10 - idx,
              boxShadow: `0 10px 40px ${cardsShadowColor}`
            }}
          >
            {/* 🖼️ ሙሉውን ካርድ የሚሸፍን የቲክቶክ ሳይዝ ምስል */}
            <img 
              src={card.image} 
              alt={card.text} 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            
            {/* ✨ በቀይ ከለር መሸፈኛ (Red Tint Overlay) - ለብቻው ጸንቶ የሚቆይ */}
            <div className={`absolute inset-0 ${cardsTint}`} />

            {/* 🖤 ጽሑፉ በደንብ እንዲታይ ከስር የሚደረግ የጥቁር ጥላ ፈሳሽ (Gradient) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />

            {/* ▶️ መሃል ላይ የሚቀመጥ ቆንጆ የፕሌይ ምልክት */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white bg-black/40 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center border border-white/20 text-lg shadow-lg">▶</span>
            </div>

            {/* 📝 የካርዱ ጽሑፍ ከስር */}
            <div className="relative z-10 flex flex-col items-center w-full">
              <div className="text-white text-[11px] font-black text-center leading-tight w-full truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {card.text}
              </div>
              <div className="w-10 h-[3px] bg-red-500 rounded mt-2" />
            </div>
          </div>
        );
      })}

      {/* 3. ዋናው የሶፍትዌር በይነገጽ (UI) - መሃል ላይ ሆኖ መጠኑን የሚቀንስ */}
      <div
        className="relative w-[1000px] h-[560px] rounded-2xl bg-[#171424]/90 border border-[#3A3358]/55 shadows flex flex-col overflow-hidden backdrop-blur-md z-20"
        style={{ 
          transform: `scale(${shrinkScale})`,
          // ✨ ለመሃሉ ኤዲተር ብቻ የሚሆን አረንጓዴ የብርሃን ነጸብራቅ እና Glow በ frame 60 ላይ
          boxShadow: `0 25px ${editorGlowRadius}px -15px ${editorGlowColor}, 0 0 ${editorGlowRadius/2}px ${editorGlowColor}`
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
            <span className="text-emerald-400 text-xs font-black px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">1 REAL EDIT</span>
          </div>
        </div>

        {/* የሶፍትዌር ውስጠኛ የስራ ቦታ */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* የጎን ምናሌ */}
          <div className="w-16 border-r border-[#25203A] bg-[#141121] flex flex-col items-center py-4 gap-6">
            <div className="w-10 h-10 rounded-xl bg-[#2A2444] flex items-center justify-center text-purple-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-2 12H4V8h16v10z"/></svg>
            </div>
          </div>

          {/* ዋናው የቪዲዮ ማሳያ እና የጊዜ መስመር */}
          <div className="flex-1 flex flex-col bg-[#110E1C] relative">
            
            {/* የቪዲዮ ማሳያ ቦታ */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-0">
              <div className="relative w-[500px] h-[280px] rounded-xl overflow-hidden border-2 border-[#3F3763] bg-[#090710] shadow-2xl flex items-center justify-center">
                
                {/* 🖼️ የቪዲዮ ማሳያው ላይ ምስሉ እዚህ ገብቷል */}
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
                </div>
              </div>

              <div className="flex-1 flex relative overflow-hidden">
                <div className="w-32 border-r border-[#25203A] bg-[#141121] flex flex-col font-mono text-[#A39FBA] text-[11px] select-none">
                  <div className="h-10 border-b border-[#25203A] flex items-center justify-between px-3">
                    <span>V2</span>
                  </div>
                  <div className="h-10 border-b border-[#25203A] flex items-center justify-between px-3 bg-[#1B172C]">
                    <span className="text-white font-bold">V1</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col relative px-4 py-0 justify-start mt-0">
                  <div className="h-10 w-full border-b border-[#25203A] relative"/>
                  
                  <div className="h-10 w-full border-b border-[#25203A] relative flex items-center gap-1">
                    <div className="w-[10%] h-7 bg-gray-600/50 rounded border border-gray-500/50" />
                    <div className="w-[30%] h-7 bg-purple-500/30 border-2 border-purple-500/60 rounded flex items-center px-2 gap-1.5 overflow-hidden shadow-[inset_0_0_10px_rgba(168,85,247,0.2)]">
                       <div className="w-6 h-5 rounded-sm bg-black/40 overflow-hidden flex-shrink-0">
                         {/* 🖼️ በጊዜ መስመሩ ላይ ያለው ምስል እዚህም img6 እንዲጠቀም ተደርጓል */}
                         <img src={img6} className="w-full h-full object-cover opacity-80" />
                       </div>
                       <span className="text-[9px] text-purple-100 font-medium truncate">6.png [V]</span>
                    </div>
                  </div>

                  <div 
                    className="absolute top-[-24px] bottom-0 w-[2px] bg-red-500 shadow-[0_0_10px_#EF4444] z-20 pointer-events-none"
                    style={{ left: `${playheadProgress}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </Background>
  );
};

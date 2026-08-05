import React from "react";
import { Video } from "remotion";

interface EditingUIProps {
  opacity: number;
  videoSrc: string;
  clip1Width: number;
  clip2Width: number;
  clip3Width: number;
  playheadMove: number;
}

export const EditingSoftwareUI: React.FC<EditingUIProps> = ({
  opacity,
  videoSrc,
  clip1Width,
  clip2Width,
  clip3Width,
  playheadMove,
}) => {
  return (
    <div
      className="absolute top-1/2 left-1/2 rounded-xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.9)] z-[1] border-2 border-gray-500"
      style={{
        width: 1280, // ወደ ጎን እንዲሰፋ ተደርጓል
        height: 720, // ቁመቱ ቀንሷል
        transform: `translate(-50%, -50%)`,
        backgroundColor: "#181818", // DaVinci Base Dark Gray
        opacity: opacity,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* 1. Top Menu Bar (DaVinci Resolve, File, Edit...) */}
      <div className="w-full h-6 bg-[#1a1a1a] flex items-center px-4 text-[#a0a0a0] text-[10px] gap-4 border-b border-[#000000]">
        <span className="font-bold text-[#d0d0d0]">DaVinci Resolve</span>
        <span>File</span>
        <span>Edit</span>
        <span>Trim</span>
        <span>Timeline</span>
        <span>Clip</span>
        <span>Mark</span>
        <span>View</span>
        <span>Playback</span>
        <span>Fusion</span>
        <span>Color</span>
        <span>Fairlight</span>
        <span>Workspace</span>
        <span>Help</span>
      </div>

      {/* 2. Main Toolbar (Media Pool, Untitled Project, Inspector) */}
      <div className="w-full h-10 bg-[#212121] flex items-center justify-between px-4 border-b border-[#111111]">
        <div className="flex gap-4 text-[#b0b0b0] text-[11px] items-center">
          <div className="flex items-center gap-1 font-semibold text-white">
            <div className="w-3 h-3 bg-white/20 rounded-sm" /> Media Pool
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-white/10 rounded-sm" /> Effects Library
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-white/10 rounded-sm" /> Edit Index
          </div>
        </div>
        
        <div className="text-[#e0e0e0] text-[12px] font-semibold flex gap-2 items-baseline">
          Untitled Project <span className="text-[#666666] text-[10px] font-normal">Edited</span>
        </div>

        <div className="flex gap-4 text-[#b0b0b0] text-[11px] items-center">
          <div className="flex items-center gap-1">Mixer</div>
          <div className="flex items-center gap-1">Metadata</div>
          <div className="flex items-center gap-1">Inspector</div>
        </div>
      </div>

      {/* 3. Middle Section (Media Pool & Monitor) */}
      {/* የዚህ ክፍል ቁመት ቀንሷል ከ 450px ወደ 380px */}
      <div className="flex w-full h-[380px] bg-[#141414]">
        
        {/* Left: Media Pool Sidebar */}
        <div className="w-[340px] h-full flex border-r border-[#000000]">
          {/* Smart Bins / Master List */}
          <div className="w-[90px] h-full bg-[#181818] border-r border-[#222222] p-2 flex flex-col justify-between">
            <div>
              <span className="text-[#e0e0e0] text-[10px] font-bold block mb-2 px-1">Master</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[#888888] text-[10px] font-bold px-1">Smart Bins</span>
              <span className="text-[#888888] text-[10px] font-bold px-1 mb-4">Keywords</span>
            </div>
          </div>
          
          {/* Clips Grid */}
          <div className="flex-1 bg-[#1a1a1a] p-4">
            <div className="flex items-center gap-2 mb-4 text-[#888] text-[10px]">
               <span>Master</span> <span className="text-[8px]">&gt;</span>
            </div>
            {/* Grid Items (Thumbnails like the image) */}
            <div className="grid grid-cols-2 gap-4">
              {/* Timeline icon */}
              <div className="flex flex-col gap-1">
                <div className="w-full h-16 bg-[#2a2a2a] rounded-[2px] border-t-2 border-l-2 border-[#ff3333] relative overflow-hidden">
                   <Video src={videoSrc} muted className="w-full h-full object-cover opacity-50" />
                </div>
                <span className="text-[#b0b0b0] text-[10px] text-center">Timeline 1</span>
              </div>
              {/* Video Clip 3 */}
              <div className="flex flex-col gap-1">
                <div className="w-full h-16 bg-[#2a2a2a] rounded-[2px] border-t-2 border-[#ff3333] relative overflow-hidden">
                   <Video src={videoSrc} muted className="w-full h-full object-cover" />
                </div>
                <span className="text-[#b0b0b0] text-[10px] text-center">3.mp4</span>
              </div>
              {/* Audio/Video Clip 2 */}
              <div className="flex flex-col gap-1">
                <div className="w-full h-16 bg-[#2a2a2a] rounded-[2px] relative overflow-hidden">
                   <Video src={videoSrc} muted className="w-full h-full object-cover filter contrast-125" />
                </div>
                <span className="text-[#b0b0b0] text-[10px] text-center">2.mp4</span>
              </div>
              {/* Video Clip 1 */}
              <div className="flex flex-col gap-1">
                <div className="w-full h-16 bg-[#2a2a2a] rounded-[2px] border-b-2 border-[#ff3333] relative overflow-hidden">
                   <Video src={videoSrc} muted className="w-full h-full object-cover filter brightness-75" />
                </div>
                <span className="text-[#b0b0b0] text-[10px] text-center">1.mp4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Monitor Section (The absolute video from parent will sit exactly here) */}
        <div className="flex-1 flex flex-col bg-[#0e0e0e]">
          {/* Monitor Top Bar */}
          <div className="h-7 bg-[#1c1c1c] flex items-center justify-center border-b border-[#000000]">
             <span className="text-[#b0b0b0] text-[11px]">Timeline 1 <span className="text-[8px] ml-1">▼</span></span>
          </div>
          {/* Blank area for overlay video */}
          <div className="flex-1 relative" />
          {/* Monitor Bottom Controls */}
          <div className="h-8 bg-[#1c1c1c] flex items-center justify-between px-4 border-t border-[#000000]">
             <span className="text-[#b0b0b0] text-[10px]">▶|</span>
             <div className="flex gap-4 text-[#888] text-[10px]">
                <span>|◀</span> <span>◀</span> <span>▶</span> <span>▶|</span> <span>⟳</span>
             </div>
             <span className="text-[#b0b0b0] text-[10px]">[ ]</span>
          </div>
        </div>
      </div>

      {/* 4. Timeline Section (Bottom) */}
      {/* የዚህ ክፍል flex-1 ሆኖ የቀረውን ቦታ በትክክል እንዲሞላ ተደርጓል */}
      <div className="flex-1 flex flex-col bg-[#141414] border-t border-[#000000]">
        
        {/* Timeline Tools & Timecode Bar */}
        <div className="w-full h-10 bg-[#1e1e1e] border-b border-[#111111] flex items-center px-4 gap-8">
           <span className="text-[#e0e0e0] text-xl font-mono tracking-widest">01:00:04:04</span>
           <div className="flex gap-3 text-[#888] text-[12px] items-center">
              <span className="text-[#ff3333]">▶</span> {/* Snapping active */}
              <span>[ ]</span>
              <span>✂</span>
              <span className="text-white">🔗</span> {/* Linked Selection active */}
              <span>🔒</span>
              <span className="text-[#4fa2f8]">⚑</span> {/* Blue marker */}
           </div>
           <div className="flex-1" />
           <div className="flex items-center gap-2">
              <span className="text-[#888] text-[10px]">-</span>
              <div className="w-24 h-[2px] bg-[#333]"><div className="w-4 h-2 bg-[#888] rounded-full -mt-[3px] ml-10" /></div>
              <span className="text-[#888] text-[10px]">+</span>
           </div>
        </div>

        {/* Tracks Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Track Headers (Left Column) */}
          <div className="w-[140px] h-full bg-[#181818] border-r border-[#000000] flex flex-col pt-6 gap-[2px]">
            {/* V2 */}
            <div className="h-16 flex flex-col justify-center px-3 border-b border-[#222]">
              <div className="flex items-center gap-2 text-[#b0b0b0] text-[10px] font-bold">
                 <span>V2</span> <span>Video 2</span>
              </div>
              <div className="flex gap-2 text-[#666] text-[10px] mt-1"><span>🔒</span> <span>👁</span></div>
            </div>
            {/* V1 (Active / Darker background) */}
            <div className="h-16 flex flex-col justify-center px-3 border-b border-[#222] bg-[#222222]">
              <div className="flex items-center gap-2 text-white text-[10px] font-bold">
                 <span>V1</span> <span>Video 1</span>
              </div>
              <div className="flex gap-2 text-[#aaa] text-[10px] mt-1"><span>🔒</span> <span>👁</span></div>
            </div>
            {/* A1 (Audio) */}
            <div className="h-16 flex flex-col justify-center px-3 border-b border-[#222]">
              <div className="flex items-center gap-2 text-[#b0b0b0] text-[10px] font-bold">
                 <span>A1</span> <span>Audio 1</span> <span className="ml-auto text-[#666]">2.0</span>
              </div>
              <div className="flex gap-2 text-[#666] text-[10px] mt-1"><span>🔒</span> <span>[S]</span> <span>[M]</span></div>
            </div>
          </div>

          {/* Timeline Grid & Clips */}
          <div className="flex-1 relative bg-[#141414] pt-6 overflow-hidden">
            {/* Ruler / Timecodes */}
            <div className="absolute top-0 w-full h-6 border-b border-[#222] flex items-end px-2 text-[#555] text-[9px] font-mono gap-24">
               <span>01:00:00:00</span>
               <span>01:00:04:00</span>
               <span>01:00:08:00</span>
               <span>01:00:12:00</span>
            </div>
            
            {/* Background Grid Lines */}
            <div className="absolute inset-0 top-6 pointer-events-none opacity-5 bg-[linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:96px_100%]" />

            {/* --- V1 (Video Track Clips) - DaVinci Blue (#3b678f) --- */}
            <div className="absolute top-[66px] flex gap-[2px]" style={{ left: 20 }}>
               {/* First split clip */}
               <div 
                 className="h-[60px] bg-[#3b678f] border border-[#528cb6] rounded-[2px] relative overflow-hidden flex flex-col shadow-[inset_0_10px_20px_rgba(0,0,0,0.3)]"
                 style={{ width: clip2Width }}
               >
                  <div className="px-1 pt-[2px] flex items-center gap-1 z-10 bg-gradient-to-b from-black/40 to-transparent pb-1">
                     <span className="text-white text-[9px]">🔗</span>
                     <span className="text-white text-[9px] font-semibold drop-shadow-md">1.mp4</span>
                  </div>
                  <div className="absolute inset-0 flex opacity-40 pointer-events-none mt-4">
                    <Video src={videoSrc} muted className="h-full object-cover w-24" />
                    <Video src={videoSrc} muted className="h-full object-cover w-24" />
                    <Video src={videoSrc} muted className="h-full object-cover w-24" />
                  </div>
               </div>
               
               {/* Second split clip (Red highlighted border) */}
               <div 
                 className="h-[60px] bg-[#3b678f] border border-[#ff3333] rounded-[2px] relative overflow-hidden flex flex-col shadow-[inset_0_10px_20px_rgba(0,0,0,0.3)]"
                 style={{ width: clip3Width }}
               >
                  <div className="px-1 pt-[2px] flex items-center gap-1 z-10 bg-gradient-to-b from-black/40 to-transparent pb-1">
                     <span className="text-white text-[9px]">🔗</span>
                     <span className="text-white text-[9px] font-semibold drop-shadow-md">3.mp4</span>
                  </div>
                  <div className="absolute inset-0 flex opacity-40 pointer-events-none mt-4">
                    <Video src={videoSrc} muted className="h-full object-cover w-24" style={{ filter: "hue-rotate(180deg)" }} />
                    <Video src={videoSrc} muted className="h-full object-cover w-24" style={{ filter: "hue-rotate(180deg)" }} />
                  </div>
               </div>
            </div>

            {/* --- A1 (Audio Track Clips) - DaVinci Green (#467d58) --- */}
            <div className="absolute top-[130px] flex gap-[2px]" style={{ left: 20 }}>
               {/* First split audio */}
               <div 
                 className="h-[60px] bg-[#467d58] border border-[#5fa675] rounded-[2px] relative overflow-hidden shadow-[inset_0_10px_20px_rgba(0,0,0,0.3)]"
                 style={{ width: clip2Width }}
               >
                  <div className="px-1 pt-[2px] flex items-center gap-1 z-10">
                     <span className="text-white text-[9px]">🔗</span>
                     <span className="text-white text-[9px] font-semibold drop-shadow-md">1.mp4</span>
                  </div>
                  <div className="absolute inset-0 mt-4 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjIiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] bg-repeat-x bg-center" />
               </div>
               
               {/* Second split audio (Red highlighted border) */}
               <div 
                 className="h-[60px] bg-[#467d58] border border-[#ff3333] rounded-[2px] relative overflow-hidden shadow-[inset_0_10px_20px_rgba(0,0,0,0.3)]"
                 style={{ width: clip3Width }}
               >
                  <div className="px-1 pt-[2px] flex items-center gap-1 z-10">
                     <span className="text-white text-[9px]">🔗</span>
                     <span className="text-white text-[9px] font-semibold drop-shadow-md">3.mp4</span>
                  </div>
                  <div className="absolute inset-0 mt-4 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjIiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] bg-repeat-x bg-center" />
               </div>
            </div>

            {/* --- Playhead (Red Line going down) --- */}
            <div className="absolute top-0 bottom-0 z-20 pointer-events-none" style={{ left: 40 + playheadMove }}>
               <div className="w-3 h-3 bg-[#ff3333] -ml-[5px] rounded-sm" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
               <div className="w-[1px] h-full bg-[#ff3333]" />
            </div>

          </div>
        </div>
      </div>
      
      {/* 5. Bottom Tabs (Media, Cut, Edit, Fusion, Color, Fairlight, Deliver) */}
      <div className="w-full h-8 bg-[#181818] border-t border-[#000000] flex items-center justify-center gap-8 text-[#666666] text-[12px]">
         <span className="hover:text-white">Media</span>
         <span className="hover:text-white">Cut</span>
         <span className="text-white font-bold border-b-2 border-[#ff3333] pb-1 mt-1">Edit</span>
         <span className="hover:text-white">Fusion</span>
         <span className="hover:text-white">Color</span>
         <span className="hover:text-white">Fairlight</span>
         <span className="hover:text-white">Deliver</span>
      </div>
    </div>
  );
};

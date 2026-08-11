import React, { Suspense } from 'react';
import {
  AbsoluteFill,
  useVideoConfig,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import Laptop3D from '../assets/Laptop3D';
import Background from './Background'; // 👈 አዲሱ Background ፋይል

const EditingTimelineBroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // --------------------------------------------------
  // LAPTOP ANIMATION
  // --------------------------------------------------
  // ካርዱ ሲፈነዳ (ከ 15 እስከ 35) ላፕቶፑ ቪዲዮው በደንብ እንዲታይ ትንሽ ወደ ፊት ይመጣል (0.38 -> 0.55)
  const laptopScale = interpolate(frame, [15, 35], [0.38, 0.55], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --------------------------------------------------
  // BLUE FLASH ANIMATION (አዲሱ የፍላሽ አኒሜሽን)
  // --------------------------------------------------
  // ከ 17 እስከ 20 ድምቅ ብሎ ይበራል (0 -> 1) ፣ ከ 20 እስከ 26 ቀስ ብሎ ይጠፋል (1 -> 0)
  const flashOpacity = interpolate(frame, [17, 20, 26], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --------------------------------------------------
  // ICONS
  // --------------------------------------------------
  const icons = {
    video: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
        <path d="M23 7L16 12L23 17V7Z" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="1" y="5" width="15" height="14" rx="2" stroke="#60a5fa" strokeWidth="1.8" />
      </svg>
    ),
    design: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
        <path d="M12 19L19 12L22 15L15 22L12 19Z" stroke="#60a5fa" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M18 13L16.5 5.5L2 2L5.5 16.5L13 18L18 13Z" stroke="#60a5fa" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="11" cy="11" r="2" stroke="#60a5fa" strokeWidth="1.8" />
      </svg>
    ),
    content: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
        <path d="M23 19C23 20.1 22.1 21 21 21H3C1.9 21 1 20.1 1 19V8C1 6.9 1.9 6 3 6H7L9 3H15L17 6H21C22.1 6 23 6.9 23 8V19Z" stroke="#60a5fa" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="4" stroke="#60a5fa" strokeWidth="1.8" />
      </svg>
    ),
    programming: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
        <path d="M16 18L22 12L16 6" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 6L2 12L8 18" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    marketing: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
        <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 6H23V12" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    freelance: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
        <path d="M17 21V19C17 16.8 15.2 15 13 15H5C2.8 15 1 16.8 1 19V21" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke="#60a5fa" strokeWidth="1.8" />
        <path d="M23 21V19C23 17.1 21.7 15.5 20 15.1" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M16 3.1C17.7 3.5 19 5 19 7C19 9 17.7 10.5 16 10.9" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  };

  // --------------------------------------------------
  // CARDS INITIAL POSITIONS
  // --------------------------------------------------
  const cards = [
    { id: 1, title: 'VIDEO EDITING', icon: icons.video, top: 26, left: 26, rotateY: 12, baseScale: 0.92 },
    { id: 2, title: 'GRAPHIC DESIGN', icon: icons.design, top: 26, left: 74, rotateY: -12, baseScale: 0.92 },
    { id: 3, title: 'CONTENT CREATOR', icon: icons.content, top: 50, left: 16, rotateY: 16, baseScale: 1 },
    { id: 4, title: 'PROGRAMMING', icon: icons.programming, top: 50, left: 84, rotateY: -16, baseScale: 1 },
    { id: 5, title: 'DIGITAL MARKETING', icon: icons.marketing, top: 74, left: 26, rotateY: 8, baseScale: 1.03 },
    { id: 6, title: 'FREELANCE WORK', icon: icons.freelance, top: 74, left: 74, rotateY: -8, baseScale: 1.03 },
  ];

  return (
    <AbsoluteFill>
      
      {/* 🌟 አዲሱ Background ፋይል */}
      <Background />

      <AbsoluteFill style={{ overflow: 'hidden' }}>
        
        {/* 3D የላፕቶፕ ክፍል */}
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0, 1.5, 4], fov: 45 }}
          style={{ zIndex: 10 }}
        >
          <ambientLight intensity={1.8} />
          <directionalLight position={[5, 10, 5]} intensity={3.0} />

          <Suspense fallback={null}>
            <group position={[0, -0.5, 0]}>
              <Laptop3D
                // 👇 ከ 20 frame በታች ሲሆን ምንም አያሳይም (ጥቁር ስክሪን), ከ20 በኋላ ቪዲዮውን ያሳያል
                screenContent={
                  frame >= 20 
                  ? {
                      type: 'video',
                      src: staticFile('premierepro.mp4'),
                      muted: false,
                      loop: true,
                      startFrame: 20, 
                    }
                  : { type: 'none' } as any // Hack to keep screen black/blank until frame 20
                }
                openAngle={1.8} 
                rotation={[0, 0, 0]} 
                scale={laptopScale} 
              />
            </group>
          </Suspense>
        </ThreeCanvas>

        {/* የካርዶች ክፍል (2D Overlay) */}
        <AbsoluteFill style={{ zIndex: 20 }}>
          {cards.map((card) => {
            
            // ==========================================
            // የ VIDEO EDITING ካርድ አኒሜሽን (ID 1)
            // ==========================================
            if (card.id === 1) {
              // ወደ ማዕከል መምጣት
              const moveX = interpolate(frame, [2, 20], [card.left, 50], { easing: Easing.inOut(Easing.cubic), extrapolateRight: 'clamp' });
              const moveY = interpolate(frame, [2, 20], [card.top, 50], { easing: Easing.inOut(Easing.cubic), extrapolateRight: 'clamp' });
              // መፈንዳት (Scale up)
              const explosionScale = interpolate(frame, [2, 20], [card.baseScale, 4.5], { easing: Easing.in(Easing.exp), extrapolateRight: 'clamp' });
              // እየጠፋ መሄድ
              const explosionOpacity = interpolate(frame, [14, 20], [1, 0], { extrapolateRight: 'clamp' });

              // 🌟 ካርዱ ሲያድግ ደማቅ ሰማያዊ Glow እንዲኖረው ተደርጓል
              const glowSpread = interpolate(frame, [2, 20], [20, 150], { extrapolateRight: 'clamp' });
              const glowOpacity = interpolate(frame, [2, 20], [0.3, 1], { extrapolateRight: 'clamp' });

              return (
                <div key={card.id} style={{
                  position: 'absolute',
                  top: `${moveY}%`,
                  left: `${moveX}%`,
                  transform: `translate(-50%, -50%) perspective(1000px) rotateY(0deg) scale(${explosionScale})`,
                  opacity: explosionOpacity,
                  width: '240px',
                  height: '270px',
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(30, 58, 138, 0.78))',
                  backdropFilter: 'blur(16px)',
                  border: '1.5px solid rgba(147, 197, 253, 0.6)',
                  borderRadius: '22px',
                  boxShadow: `0 0 ${glowSpread}px rgba(59, 130, 246, ${glowOpacity}), inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontFamily: 'sans-serif',
                }}>
                  <div style={{ marginBottom: '16px', background: 'rgba(59, 130, 246, 0.15)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(96, 165, 250, 0.4)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.25)' }}>
                    {card.icon}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '800', textAlign: 'center', padding: '0 12px', letterSpacing: '0.5px', color: '#ffffff', textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
                    {card.title}
                  </div>
                </div>
              );
            }

            // ==========================================
            // የቀሩት 5 ካርዶች አኒሜሽን (ወደ ታች መውደቅ)
            // ==========================================
            // ከ 2 እስከ 20 ኛው ፍሬም ወደ ታች ይወድቃሉ (Y axis ይጨምራል)
            const dropY = interpolate(frame, [2, 18], [0, 800], { easing: Easing.in(Easing.exp), extrapolateRight: 'clamp' });
            const dropOpacity = interpolate(frame, [2, 12], [1, 0], { extrapolateRight: 'clamp' });

            return (
              <div key={card.id} style={{
                position: 'absolute',
                top: `calc(${card.top}% + ${dropY}px)`,
                left: `${card.left}%`,
                transform: `translate(-50%, -50%) perspective(1000px) rotateY(${card.rotateY}deg) scale(${card.baseScale})`,
                opacity: dropOpacity,
                width: '240px',
                height: '270px',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(30, 58, 138, 0.78))',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(147, 197, 253, 0.6)',
                borderRadius: '22px',
                boxShadow: '0 20px 40px rgba(30, 58, 138, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontFamily: 'sans-serif',
              }}>
                <div style={{ marginBottom: '16px', background: 'rgba(59, 130, 246, 0.15)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(96, 165, 250, 0.4)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.25)' }}>
                  {card.icon}
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', textAlign: 'center', padding: '0 12px', letterSpacing: '0.5px', color: '#ffffff', textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
                  {card.title}
                </div>
              </div>
            );
          })}
        </AbsoluteFill>

        {/* 🌟 -------------------------------------------------- */}
        {/* 🌟 BLUE FLASH OVERLAY (የፍላሽ ኢፌክት እዚህ ይገባል) */}
        {/* 🌟 -------------------------------------------------- */}
        <AbsoluteFill
          style={{
            zIndex: 50, // ከሁሉም ነገር በላይ እንዲሆን
            opacity: flashOpacity, // በ 20ኛው ፍሬም ላይ ሙሉ በሙሉ ይበራል
            background: 'radial-gradient(circle, #ffffff 0%, #3b82f6 40%, #1e3a8a 100%)', // ከነጭ ወደ ደማቅ ሰማያዊ
            mixBlendMode: 'screen', // ሲኒማቲክ ብርሃን እንዲመስል ያደርገዋል
            pointerEvents: 'none', // ክሊክ እንዳይከለክል
          }}
        />

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default EditingTimelineBroll;

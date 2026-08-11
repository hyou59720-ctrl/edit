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
import Background from './Background'; // አዲሱን Background ፋይል import እናደርጋለን

const OnlineWorkBroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // --------------------------------------------------
  // SCENE
  // --------------------------------------------------
  const sceneOpacity = interpolate(frame, [100, 115], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --------------------------------------------------
  // LAPTOP MOTION
  // --------------------------------------------------
  // በ 23ኛው ፍሬም ከታች ወደ ላይ መጥቶ ይቆማል
  const laptopY = interpolate(frame, [0, 23], [-4, -0.5], {
    easing: Easing.out(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // በ 23ኛው ፍሬም ላይ 1.8 ደርሶ ይከፈታል
  const openAngle = interpolate(frame, [0, 23], [0, 1.8], {
    easing: Easing.inOut(Easing.ease),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const BROLL_START_FRAME = 40;

  // --------------------------------------------------
  // ICONS
  // --------------------------------------------------
  const icons = {
    video: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
        <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    design: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
        <path d="M12 19L19 12L22 15L15 22L12 19Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M18 13L16.5 5.5L2 2L5.5 16.5L13 18L18 13Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="11" cy="11" r="2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    content: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
        <path d="M23 19C23 20.1 22.1 21 21 21H3C1.9 21 1 20.1 1 19V8C1 6.9 1.9 6 3 6H7L9 3H15L17 6H21C22.1 6 23 6.9 23 8V19Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    programming: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
        <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    marketing: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
        <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 6H23V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    freelance: (
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
        <path d="M17 21V19C17 16.8 15.2 15 13 15H5C2.8 15 1 16.8 1 19V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M23 21V19C23 17.1 21.7 15.5 20 15.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M16 3.1C17.7 3.5 19 5 19 7C19 9 17.7 10.5 16 10.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  };

  // --------------------------------------------------
  // CARDS
  // --------------------------------------------------
  const cards = [
    { id: 1, title: 'VIDEO EDITING', icon: icons.video, top: '26%', left: '26%', rotateY: 12, baseScale: 0.92 },
    { id: 2, title: 'GRAPHIC DESIGN', icon: icons.design, top: '26%', left: '74%', rotateY: -12, baseScale: 0.92 },
    { id: 3, title: 'CONTENT CREATOR', icon: icons.content, top: '50%', left: '16%', rotateY: 16, baseScale: 1 },
    { id: 4, title: 'PROGRAMMING', icon: icons.programming, top: '50%', left: '84%', rotateY: -16, baseScale: 1 },
    { id: 5, title: 'DIGITAL MARKETING', icon: icons.marketing, top: '74%', left: '26%', rotateY: 8, baseScale: 1.03 },
    { id: 6, title: 'FREELANCE WORK', icon: icons.freelance, top: '74%', left: '74%', rotateY: -8, baseScale: 1.03 },
  ];

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      
      {/* BACKGROUND COMPONENT */}
      <Background />

      {/* LAPTOP */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{
          position: [0, 1.5, 4],
          fov: 45,
        }}
        className="absolute inset-0 z-10"
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[5, 10, 5]} intensity={3.2} />
        <directionalLight position={[-4, 5, -3]} intensity={1.1} />

        <Suspense fallback={null}>
          <group position={[0, laptopY, 0]}>
            <Laptop3D
              screenContent={{
                type: 'video',
                src: staticFile('onlinework.mp4'),
                muted: false,
                loop: true,
                startFrame: BROLL_START_FRAME,
              }}
              openAngle={openAngle}
              rotation={[0, 0, 0]}
              scale={0.38}
            />
          </group>
        </Suspense>
      </ThreeCanvas>

      {/* CARDS */}
      <AbsoluteFill className="z-20 [perspective:1400px]">
        {cards.map((card, index) => {
          // ካርዶቹ ልክ 23ኛው ፍሬም ላይ መታየት ይጀምራሉ፣ እናም ወደ ፊት ትንሽ ይጨምራሉ (+ index * 6)
          const entryStart = 23 + index * 6;
          const entryEnd = entryStart + 9;

          const progress = interpolate(frame, [entryStart, entryEnd], [0, 1], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const opacity = interpolate(frame, [entryStart, entryStart + 5], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const scale = interpolate(frame, [entryStart, entryEnd], [0.72, card.baseScale], {
            easing: Easing.out(Easing.back(1.3)),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const slideY = interpolate(progress, [0, 1], [35, 0]);
          const floatY = Math.sin((frame + index * 18) / 18) * 4;
          const floatRotate = Math.sin((frame + index * 15) / 24) * 0.5;
          
          const exitY = interpolate(frame, [100, 115], [0, -25], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={card.id}
              className="absolute flex w-[230px] h-[250px] flex-col items-center justify-center overflow-hidden rounded-[24px] border border-blue-300/45 font-sans text-white [transform-style:preserve-3d]"
              style={{
                top: card.top,
                left: card.left,
                transform: `
                  translate(-50%, -50%)
                  translateY(${slideY + floatY + exitY}px)
                  perspective(1200px)
                  rotateY(${card.rotateY}deg)
                  rotateZ(${floatRotate}deg)
                  scale(${scale})
                `,
                opacity,
                background: 'linear-gradient(145deg, rgba(17,32,62,0.94), rgba(30,58,110,0.88))',
                boxShadow: '0 22px 55px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.22)',
              }}
            >
              {/* Glass highlight */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.10), transparent 35%, transparent 70%, rgba(59,130,246,0.08))',
                }}
              />

              {/* Top reflection */}
              <div className="absolute left-[12%] right-[12%] top-0 h-[1px] bg-white/35 opacity-70" />

              {/* Icon */}
              <div
                className="relative mb-[18px] flex h-[76px] w-[76px] items-center justify-center rounded-[20px] border border-blue-400/42 text-blue-400"
                style={{
                  background: 'linear-gradient(145deg, rgba(59,130,246,0.22), rgba(37,99,235,0.08))',
                  boxShadow: '0 10px 30px rgba(37,99,235,0.18), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
              >
                {card.icon}
              </div>

              {/* Title */}
              <div
                className="relative px-[14px] text-center text-[18px] font-extrabold leading-tight tracking-[0.6px] text-slate-50"
                style={{
                  textShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                {card.title}
              </div>

              {/* Bottom accent */}
              <div
                className="absolute bottom-[14px] h-[2px] w-[34px] rounded-[10px] bg-blue-400/65"
                style={{
                  boxShadow: '0 0 12px rgba(59,130,246,0.45)',
                }}
              />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default OnlineWorkBroll;

import React, { Suspense } from 'react';
import {
  AbsoluteFill,
  useVideoConfig,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
  spring,
  Video,
} from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import IPhone3D from '../assets/IPhone3D';
import Background from './Background';

const SocialMediaScrollBroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // --------------------------------------------------
  // 1. CAMERA / PHONE ANIMATION (መግቢያ እና መውጫ ተጨምሯል)
  // --------------------------------------------------
  
  // ✅ የስልኩ Scale: መጀመሪያ ያድጋል -> መሃል ላይ ያንሳል -> መጨረሻ ላይ ስክሪኑን ይሸፍናል (5.5)
  const phoneScale = interpolate(frame, [0, 25, 60, 80, 90, 120], [0.01, 0.45, 0.45, 0.25, 0.25, 0.7], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ✅ የስልኩ Y ቦታ: ከታች (-8) ይገባል -> ቦታውን ይይዛል -> መጨረሻ ላይ ወደ ካሜራው መሃል (1.5) ይጠጋል
  const phoneY = interpolate(frame, [0, 25, 60, 80, 90, 120], [-8, -2.3, -2.3, -2.3, -2.3, -2.3], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ✅ የስልኩ X Rotation: መጨረሻ ላይ Zoom ሲያደርግ ስክሪኑ ቀጥ ብሎ እንዲታይ (0) ይሆናል
  const phoneRotateX = interpolate(frame, [0, 25, 60, 80, 90, 120], [-0.4, -0.4, -0.4, -0.4, -0.4, -0.4], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ✅ የስልኩ Y Rotation: ሲገባ ይሽከረከራል (Spin) -> መሃል ላይ ቀስ ይላል -> መጨረሻ ላይ ቀጥ ይላል
  const phoneRotateY = interpolate(frame, [0, 25, 60, 80, 90, 120], [3, 0.4, 0.4, 0, 0, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ✅ የስልኩ Z Rotation: ሲገባ አግድም ሆኖ ይመጣል -> መጨረሻ ላይ ይስተካከላል
  const phoneRotateZ = interpolate(frame, [0, 25, 60, 80, 90, 120], [-0.5, 0.05, 0.05, 0, 0, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 🌟 አየር ላይ የመንሳፈፍ (Floating) እንቅስቃሴ: Zoom ሲያደርግ እንዳይንቀጠቀጥ እናጠፋዋለን
  const floatMultiplier = interpolate(frame, [90, 100], [1, 0], { extrapolateRight: 'clamp' });
  const floatY = Math.sin(frame / 15) * 0.08 * floatMultiplier;
  const floatRotateZ = Math.sin(frame / 20) * 0.02 * floatMultiplier;

  // --------------------------------------------------
  // 2. EDITING TOOLS ANIMATION
  // --------------------------------------------------
  const toolsOpacity = interpolate(frame, [25, 30, 60, 70], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const toolsScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const scrubberPos = interpolate(frame, [25, 70], [10, 90], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --------------------------------------------------
  // 3. BACKGROUND VIDEO FADE IN 
  // --------------------------------------------------
  const bgVideoOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      
      {/* 🌟 ጀርባ ቀለም (Background) */}
      <Background />

      {/* 🌟 SCENE 3: የቪዲዮ ፏፏቴ (በ bg.mp4 ቪዲዮ ተተክቷል) */}
      <AbsoluteFill style={{ zIndex: 5, opacity: bgVideoOpacity }}>
        <Video
          src={staticFile('bg.mp4')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', 
            filter: 'brightness(0.8) contrast(1.3) saturate(1.4)',
          }}
          muted
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.95) 100%)',
            pointerEvents: 'none', 
          }}
        />
      </AbsoluteFill>

      {/* 🌟 ከስልኩ "ጀርባ" የሚወጣው የአዶ ክፍል (zIndex: 8) */}
      <AbsoluteFill style={{ zIndex: 8, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          top: '32%',
          left: '22%', 
          transform: `translate(-50%, -50%) scale(${toolsScale}) rotate(-10deg)`,
          opacity: toolsOpacity,
          width: '140px',
          height: '140px',
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.7), rgba(79, 70, 229, 0.4))', 
          backdropFilter: 'blur(20px)',
          borderRadius: '35px',
          border: '2px solid rgba(192, 132, 252, 0.9)',
          boxShadow: '0 0 45px rgba(147, 51, 234, 0.7), inset 0 0 25px rgba(192, 132, 252, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f0abfc',
        }}>
          <svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
      </AbsoluteFill>

      {/* 🌟 SCENE 1 & 3: 3D የሞባይል ስልክ (zIndex: 10) */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        style={{ zIndex: 10, background: 'transparent' }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2.5} />

        <Suspense fallback={null}>
          <group position={[0, phoneY + floatY, 0]}>
            <IPhone3D
              screenContent={{
                type: 'video',
                src: staticFile('social.mp4'), 
                muted: false,
                loop: true,
                startFrame: 0, 
              }}
              rotation={[phoneRotateX, phoneRotateY, phoneRotateZ + floatRotateZ]}
              scale={phoneScale} 
            />
          </group>
        </Suspense>
      </ThreeCanvas>

      {/* 🌟 SCENE 2: ከስልኩ "ፊት እና ጎን" የሚወጡት አዶዎች (zIndex: 20) */}
      <AbsoluteFill style={{ zIndex: 20, pointerEvents: 'none' }}>
        
        {/* ከፊት በስተግራ - የመቀስ አዶ (Cyan Glow) */}
        <div style={{
          position: 'absolute',
          top: '55%',
          left: '26%', 
          transform: `translate(-50%, -50%) scale(${toolsScale}) rotate(-20deg)`,
          opacity: toolsOpacity,
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.7), rgba(2, 132, 199, 0.4))',
          backdropFilter: 'blur(20px)',
          borderRadius: '50%',
          border: '2px solid rgba(125, 211, 252, 0.9)',
          boxShadow: '0 0 40px rgba(14, 165, 233, 0.6), inset 0 0 20px rgba(125, 211, 252, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#bae6fd',
        }}>
          <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
            <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
            <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
          </svg>
        </div>

        {/* ከፊት በስተቀኝ - ትልቅ የ Play አዶ (Blue Glow) */}
        <div style={{
          position: 'absolute',
          top: '42%',
          left: '78%', 
          transform: `translate(-50%, -50%) scale(${toolsScale}) rotate(12deg)`,
          opacity: toolsOpacity,
          width: '145px',
          height: '145px',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(30, 58, 138, 0.5))',
          backdropFilter: 'blur(20px)',
          borderRadius: '50%',
          border: '3px solid rgba(147, 197, 253, 0.9)',
          boxShadow: '0 0 50px rgba(59, 130, 246, 0.7), inset 0 0 25px rgba(147, 197, 253, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#eff6ff',
        }}>
          <svg width="65" height="65" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>

        {/* ከፊት በታች - የ Timeline UI */}
        <div style={{
          position: 'absolute',
          top: '78%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${toolsScale})`,
          opacity: toolsOpacity,
          width: '380px',
          height: '75px',
          background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.9), rgba(30, 58, 138, 0.8))',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1.5px solid rgba(96, 165, 250, 0.6)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(59, 130, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          padding: '12px',
          gap: '12px'
        }}>
          <div style={{ width: '50px', height: '100%', background: 'rgba(56, 189, 248, 0.5)', borderRadius: '8px', boxShadow: 'inset 0 0 10px rgba(255,255,255,0.2)' }} />
          <div style={{ width: '160px', height: '100%', background: 'rgba(129, 140, 248, 0.4)', borderRadius: '8px', boxShadow: 'inset 0 0 10px rgba(255,255,255,0.1)' }} />
          <div style={{ width: '100px', height: '100%', background: 'rgba(52, 211, 153, 0.4)', borderRadius: '8px', boxShadow: 'inset 0 0 10px rgba(255,255,255,0.1)' }} />
          
          {/* 🌟 የሚንቀሳቀሰው የ Scrubber መስመር */}
          <div style={{ 
            position: 'absolute', 
            left: `${scrubberPos}%`, 
            top: '-15px', 
            bottom: '-15px', 
            width: '3px', 
            background: '#ffffff', 
            boxShadow: '0 0 12px #ffffff, 0 0 20px #38bdf8' 
          }}>
             <div style={{ 
               position: 'absolute', 
               top: 0, 
               left: '-6px', 
               width: '15px', 
               height: '15px', 
               background: '#ffffff', 
               borderRadius: '50%',
               boxShadow: '0 0 10px #ffffff'
             }} />
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default SocialMediaScrollBroll;

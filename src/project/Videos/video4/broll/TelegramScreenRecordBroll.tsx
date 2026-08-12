import React, { Suspense } from 'react';
import {
  AbsoluteFill,
  useVideoConfig,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
  spring,
} from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import IPhone3D from '../assets/IPhone3D';
import Background from './Background';

const TelegramScreenRecordBroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // --------------------------------------------------
  // 1. CAMERA / PHONE ANIMATION 
  // --------------------------------------------------
  
  // ✅ የስልኩ Scale: 
  const phoneScale = interpolate(frame, [0, 30, 140, 175], [0.41, 0.45, 0.45, 0.75], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 🌟 የስልኩ X ቦታ: 0 በማድረግ በትክክል መሃል ላይ እንዲቆም ተደርጓል
  const phoneX = 0; 

  // ✅ የስልኩ Y ቦታ: 
  const phoneY = interpolate(frame, [0, 30], [-3, -2.3], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ✅ የስልኩ X Rotation: ወደ ኋላ ትንሽ ዘንበል ብሎ እንዲታይ
  const phoneRotateX = interpolate(frame, [0, 30, 140, 175], [-0.5, -0.4, -0.3, -0.3], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 🌟 የስልኩ Y Rotation: ከጎን ዞሮ ይመጣና በትክክል ፊት ለፊት (0) ይመለከታል
  const phoneRotateY = interpolate(frame, [0, 30, 140, 175], [-2, 0.4, -0.4, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ✅ የስልኩ Z Rotation: አግድም ሆኖ ይመጣና ይስተካከላል
  const phoneRotateZ = interpolate(frame, [0, 30, 140, 175], [0.5, 0, 0, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // አየር ላይ የመንሳፈፍ (Floating) እንቅስቃሴ
  const floatMultiplier = interpolate(frame, [130, 140], [1, 0], { extrapolateRight: 'clamp' });
  const floatY = Math.sin(frame / 15) * 0 * floatMultiplier;
  const floatRotateZ = Math.sin(frame / 20) * 0.002* floatMultiplier;

  // --------------------------------------------------
  // 2. TELEGRAM UI ANIMATIONS (በስልኩ ላይ መሃል ለመሃል የሚወጡት)
  // --------------------------------------------------
  
  // የ UI አጠቃላይ Opacity
  const uiOpacity = interpolate(frame, [20, 30, 140, 160], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // አኒሜሽኖቹ ተራ በተራ (Staggered) ብቅ እንዲሉ
  const membersCardPop = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 12, mass: 0.8 } });
  const searchBarPop = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 12, mass: 0.8 } });
  const joinBtnPop = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 12, mass: 0.8 } });

  // "Rofi Edits" የሚለው Typing Effect
  const fullText = "Rofi Edits";
  const typingProgress = Math.min(
    fullText.length,
    Math.max(0, Math.floor(interpolate(frame, [70, 100], [0, fullText.length])))
  );
  const typedText = fullText.slice(0, typingProgress);

  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      
      {/* 🌟 ንጹህ የጀርባ ቀለም እና ፍካት (Background) - bg.mp4 ተወግዷል */}
      <Background />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.1) 0%, transparent 60%)',
        }}
      />

      {/* 🌟 SCENE 2: በስልኩ ላይ መሃል ለመሃል የሚደረደሩት የ Telegram UI (ከ 3D ስልኩ በስተጀርባ - zIndex: 5) */}
      <AbsoluteFill style={{ zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', opacity: uiOpacity }}>
          
          {/* 1. Members Card (10,000+ Members) */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '20%', // 🌟 መሃል ላይ
            transform: `translate(-50%, -50%) scale(${membersCardPop})`,
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.85), rgba(15, 23, 42, 0.75))',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '2px solid rgba(56, 189, 248, 0.5)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(56, 189, 248, 0.2)',
            padding: '20px 30px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            color: 'white',
          }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#38bdf8', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 15px #38bdf8' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#7dd3fc', fontWeight: 'bold', letterSpacing: '1px' }}>TELEGRAM CHANNEL</div>
              <div style={{ fontSize: '32px', fontWeight: '900', textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>10,000+</div>
            </div>
          </div>

          {/* 2. Search Bar (Typing: Rofi Edits) */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '80%', // 🌟 መሃል ላይ
            transform: `translate(-50%, -50%) scale(${searchBarPop})`,
            width: '400px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(15px)',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            padding: '18px 25px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <div style={{ fontSize: '24px', color: 'white', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {typedText}
              {/* የሚያበራ የ Typing Cursor */}
              <span style={{ opacity: Math.sin(frame / 3) > 0 ? 1 : 0, color: '#38bdf8' }}>|</span>
            </div>
          </div>

          {/* 3. Join Channel Button */}
          <div style={{
            position: 'absolute',
            top: '70%',
            left: '15%', // 🌟 መሃል ላይ
            transform: `translate(-50%, -50%) scale(${joinBtnPop})`,
            background: 'linear-gradient(90deg, #0284c7, #2563eb)',
            borderRadius: '30px',
            padding: '15px 40px',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.5), inset 0 0 10px rgba(255,255,255,0.4)',
            border: '1px solid #60a5fa',
          }}>
            JOIN CHANNEL
          </div>

        </div>
      </AbsoluteFill>

      {/* 🌟 SCENE 3: 3D የሞባይል ስልክ (zIndex: 10) - አሁን መሃል ላይ ነው */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        style={{ zIndex: 10, background: 'transparent' }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2.5} />

        <Suspense fallback={null}>
          <group position={[phoneX, phoneY + floatY, 0]}>
            <IPhone3D
              screenContent={{
                type: 'video',
                src: staticFile('telegram.mp4'), 
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

    </AbsoluteFill>
  );
};

export default TelegramScreenRecordBroll;

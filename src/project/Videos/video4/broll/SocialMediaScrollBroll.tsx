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
  // 1. CAMERA / PHONE ANIMATION
  // --------------------------------------------------
  // ✅ የስልኩን መጠን በትንሹ አሳነስነው (0.38)
  const phoneScale = interpolate(frame, [60, 80], [0.45, 0.25], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ✅ ስልኩ ከላይ እንዳይቆረጥ (Center እንዲሆን) ቦታውን ወደ -1.0 አወረድነው
  const phoneY = interpolate(frame, [60, 80], [-2.3, -2.3], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ✅ 3D እይታ - ወደ ኋላ ዘምበል እንዲል (Tilt backwards)
  const phoneRotateX = interpolate(frame, [60, 80], [-0.4, -0.4], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ✅ 3D እይታ - ትንሽ ወደ ጎን እንዲዞር (Turn to the side)
  const phoneRotateY = interpolate(frame, [60, 80], [0.4, 0], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ✅ 3D እይታ - ትንሽ አግድም እንዲል (Slight diagonal tilt)
  const phoneRotateZ = interpolate(frame, [60, 80], [0.05, 0], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --------------------------------------------------
  // 2. EDITING TOOLS ANIMATION (25 ኛው ፍሬም ላይ ይወጣሉ)
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

  // --------------------------------------------------
  // 3. BACKGROUND VIDEO FADE IN (ካርዶቹ ይገቡ በነበረበት ሰዓት)
  // --------------------------------------------------
  // ቪዲዮው ከ 60ኛው ፍሬም ጀምሮ Fade in ያደርጋል
  const bgVideoOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      
      {/* 🌟 ጀርባ ቀለም (Background) */}
      <Background />

      {/* 🌟 SCENE 3: የቪዲዮ ፏፏቴ (በ bg.mp4 ቪዲዮ ተተክቷል) - ከስልኩ ጀርባ */}
      <AbsoluteFill style={{ zIndex: 5, opacity: bgVideoOpacity }}>
        <Video
          src={staticFile('bg.mp4')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // 9:16 ቪዲዮው ስክሪኑን ሙሉ በሙሉ እንዲሸፍን
          }}
          muted
        />
      </AbsoluteFill>

      {/* 🌟 SCENE 1 & 3: 3D የሞባይል ስልክ */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        style={{ zIndex: 10, background: 'transparent' }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2.5} />

        <Suspense fallback={null}>
          <group position={[0, phoneY, 0]}>
            <IPhone3D
              screenContent={{
                type: 'video',
                src: staticFile('social.mp4'), 
                muted: false,
                loop: true,
                startFrame: 0, 
              }}
              // ✅ 3D አቀማመጡን (Rotation) እዚህ አገናኝተናል
              rotation={[phoneRotateX, phoneRotateY, phoneRotateZ]}
              scale={phoneScale} 
            />
          </group>
        </Suspense>
      </ThreeCanvas>

      {/* 🌟 SCENE 2: የኤዲቲንግ መሳሪዎች ብቅ ሲሉ (Editing Tools Popup) */}
      <AbsoluteFill style={{ zIndex: 20, pointerEvents: 'none' }}>
        
        {/* ግራ በኩል - የመቀስ አይኮን (Cut/Edit) */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '25%',
          transform: `translate(-50%, -50%) scale(${toolsScale}) rotate(-15deg)`,
          opacity: toolsOpacity,
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.9), rgba(15, 23, 42, 0.95))',
          borderRadius: '50%',
          border: '2px solid rgba(96, 165, 250, 0.8)',
          boxShadow: '0 0 35px rgba(59, 130, 246, 0.6), inset 0 0 15px rgba(96, 165, 250, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#60a5fa',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
            <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
            <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
          </svg>
        </div>

        {/* ቀኝ በኩል - የ Play አይኮን (Render/Play) */}
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '75%',
          transform: `translate(-50%, -50%) scale(${toolsScale}) rotate(10deg)`,
          opacity: toolsOpacity,
          width: '110px',
          height: '110px',
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.9), rgba(15, 23, 42, 0.95))',
          borderRadius: '24px',
          border: '2px solid rgba(96, 165, 250, 0.8)',
          boxShadow: '0 0 35px rgba(59, 130, 246, 0.6), inset 0 0 15px rgba(96, 165, 250, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#60a5fa',
        }}>
          <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>

        {/* ታች - የ Timeline UI */}
        <div style={{
          position: 'absolute',
          top: '75%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${toolsScale})`,
          opacity: toolsOpacity,
          width: '300px',
          height: '60px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '12px',
          border: '1px solid rgba(96, 165, 250, 0.5)',
          boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)',
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          gap: '10px'
        }}>
          <div style={{ width: '40px', height: '100%', background: 'rgba(59, 130, 246, 0.4)', borderRadius: '6px' }} />
          <div style={{ width: '120px', height: '100%', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '6px' }} />
          <div style={{ width: '80px', height: '100%', background: 'rgba(59, 130, 246, 0.6)', borderRadius: '6px' }} />
          {/* Scrubber Line */}
          <div style={{ position: 'absolute', left: '60%', top: '-10px', bottom: '-10px', width: '2px', background: '#fff', boxShadow: '0 0 5px #fff' }}>
             <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', background: '#fff', borderRadius: '50%' }} />
          </div>
        </div>

      </AbsoluteFill>

    </AbsoluteFill>
  );
};

export default SocialMediaScrollBroll;

import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import PremiumTelebirrBackground from './background';

// ---------------------------------------------------------------------------
// COLORS — exact match with Scene2 / Scene3
// ---------------------------------------------------------------------------

const GREEN = '#1B5E20';
const GREEN_LIGHT = '#6CBE45';
const GREEN_MID = '#2E7D32';
const GOLD = '#F9A825';
const GOLD_LIGHT = '#FFD873';
const WHITE = '#F5FFF8';

// ---------------------------------------------------------------------------
// SENTENCE REVEAL — same cinematic typography language as Scene1 / Scene3
// ---------------------------------------------------------------------------

const SentenceReveal: React.FC<{
  text: string;
  startFrame: number;
  holdUntil: number;
}> = ({ text, startFrame, holdUntil }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  if (local < -1) return null;

  const entrance = spring({
    frame: local,
    fps,
    config: { damping: 18, stiffness: 130, mass: 0.9 },
  });

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 8, holdUntil, holdUntil + 8],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const blurAmount = interpolate(local, [0, 12], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const scale = interpolate(entrance, [0, 1], [0.8, 1]);

  const glow = interpolate(local, [0, 10, 34], [0, 26, 14], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sweepPos = interpolate(local, [0, 22], [-60, 160], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '10%',
        display: 'flex',
        justifyContent: 'center',
        opacity,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          filter: `blur(${blurAmount}px)`,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          fontFamily: '"Noto Sans Ethiopic", "Nyala", sans-serif',
          fontWeight: 800,
          fontSize: 64,
          letterSpacing: '-0.01em',
          color: WHITE,
          textShadow: `0 0 ${glow}px rgba(108,190,69,0.85), 0 0 ${glow * 2}px rgba(108,190,69,0.35)`,
          backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) ${sweepPos}%, rgba(255,255,255,0) ${
            sweepPos + 25
          }%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          backgroundSize: '200% 100%',
          padding: '0 40px',
          textAlign: 'center',
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// FLOATING PAYMENT PARTICLES — same green particle language as Scene1
// ---------------------------------------------------------------------------

const FloatingPaymentParticles: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();

  const particles = React.useMemo(() => {
    const arr: { x: number; y: number; size: number; speed: number; phase: number; drift: number }[] = [];
    for (let i = 0; i < 18; i++) {
      const seed = i * 12.9898;
      const pseudo = (Math.sin(seed) * 43758.5453) % 1;
      const pseudo2 = (Math.cos(seed * 1.7) * 12543.123) % 1;
      arr.push({
        x: Math.abs(pseudo) * 100,
        y: Math.abs(pseudo2) * 100,
        size: 2 + Math.abs(Math.sin(i * 3.1)) * 4,
        speed: 0.15 + Math.abs(Math.sin(i * 7.3)) * 0.35,
        phase: i * 37.13,
        drift: Math.abs(Math.cos(i * 2.2)) * 26 + 8,
      });
    }
    return arr;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {particles.map((p, i) => {
        const yOffset = Math.sin(frame * p.speed * 0.05 + p.phase) * p.drift;
        const xOffset = Math.cos(frame * p.speed * 0.03 + p.phase) * (p.drift * 0.4);
        const twinkle = interpolate(Math.sin(frame * 0.08 + p.phase), [-1, 1], [0.15, 0.85]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: GREEN_LIGHT,
              filter: 'blur(0.5px)',
              boxShadow: `0 0 ${p.size * 3}px ${GREEN_LIGHT}`,
              transform: `translate(${xOffset}px, ${yOffset}px)`,
              opacity: twinkle,
            }}
          />
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// GREEN SUCCESS PULSE / LIGHT SWEEP — instant confirmation feel
// ---------------------------------------------------------------------------

const LightSweep: React.FC<{ triggerFrame: number }> = ({ triggerFrame }) => {
  const frame = useCurrentFrame();

  const sweepX = interpolate(frame, [triggerFrame, triggerFrame + 24], [-40, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const sweepOpacity = interpolate(
    frame,
    [triggerFrame, triggerFrame + 6, triggerFrame + 20, triggerFrame + 28],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: sweepOpacity,
        background: `linear-gradient(100deg, transparent ${sweepX - 18}%, rgba(108,190,69,0.5) ${sweepX}%, transparent ${
          sweepX + 18
        }%)`,
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// IN-SCREEN: TAP → SCAN → SUCCESS (renders inside the phone's white app screen)
// ---------------------------------------------------------------------------

const TAP_END = 22;
const SCAN_START = 24;
const SCAN_END = 60;
const SUCCESS_START = 62;

const InScreenPayButton: React.FC = () => {
  const frame = useCurrentFrame();

  const groupOpacity = interpolate(frame, [0, 6, TAP_END, TAP_END + 8], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const tapScale = interpolate(frame, [12, 15, 19], [1, 0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rippleT = interpolate(frame, [15, 32], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const waveScale = 1 + rippleT * 5;
  const waveOpacity = interpolate(rippleT, [0, 1], [0.5, 0]);

  const fingerOpacity = interpolate(frame, [8, 13, 19, 22], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fingerY = interpolate(frame, [8, 15], [-22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className="absolute left-1/2"
      style={{ top: 230, transform: 'translateX(-50%)', opacity: groupOpacity, width: 220 }}
    >
      <div
        className="relative w-full rounded-2xl py-4 flex items-center justify-center gap-2 overflow-hidden"
        style={{
          transform: `scale(${tapScale})`,
          background: 'rgba(46,125,50,0.08)',
          border: `2px solid ${GREEN_MID}`,
        }}
      >
        <div className="w-6 h-6 rounded-full" style={{ background: GREEN_MID }} />
        <span
          className="font-black text-sm"
          style={{ color: GREEN_MID, fontFamily: 'Noto Sans Ethiopic, sans-serif' }}
        >
          ክፈሉ
        </span>

        <div
          className="absolute rounded-2xl pointer-events-none"
          style={{
            inset: 0,
            border: `2px solid ${GREEN_LIGHT}`,
            transform: `scale(${waveScale})`,
            opacity: waveOpacity,
          }}
        />
      </div>

      <div
        className="absolute z-30"
        style={{ left: '62%', top: -10 + fingerY, opacity: fingerOpacity }}
      >
        <svg width="36" height="36" viewBox="0 0 46 46">
          <circle cx="23" cy="23" r="22" fill="#111827" opacity="0.85" stroke="#fff" strokeWidth="2" />
          <circle cx="23" cy="23" r="9" fill={GREEN_LIGHT} />
        </svg>
      </div>
    </div>
  );
};

const InScreenScanner: React.FC = () => {
  const frame = useCurrentFrame();

  const groupOpacity = interpolate(
    frame,
    [SCAN_START, SCAN_START + 8, SCAN_END, SCAN_END + 6],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cornerScale = interpolate(frame, [SCAN_START, SCAN_START + 10], [0.7, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.4)),
  });

  const qrOpacity = interpolate(frame, [SCAN_START + 6, SCAN_START + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // laser sweeps down twice within the scan window
  const laserCycle = ((frame - SCAN_START) % 18) / 18;
  const laserY = interpolate(laserCycle, [0, 1], [10, 170]);
  const laserOpacity = interpolate(
    frame,
    [SCAN_START + 4, SCAN_START + 10, SCAN_END - 6, SCAN_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const frameGlow = interpolate(Math.sin(frame * 0.3), [-1, 1], [0.3, 0.7]);

  return (
    <div
      className="absolute left-1/2"
      style={{ top: 195, transform: 'translateX(-50%)', opacity: groupOpacity }}
    >
      <div
        style={{
          position: 'relative',
          width: 190,
          height: 190,
          transform: `scale(${cornerScale})`,
        }}
      >
        {/* viewfinder corners */}
        {[
          { top: 0, left: 0, borderTop: true, borderLeft: true },
          { top: 0, right: 0, borderTop: true, borderRight: true },
          { bottom: 0, left: 0, borderBottom: true, borderLeft: true },
          { bottom: 0, right: 0, borderBottom: true, borderRight: true },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 32,
              height: 32,
              top: c.top,
              left: c.left,
              right: c.right,
              bottom: c.bottom,
              borderTop: c.borderTop ? `4px solid ${GREEN_MID}` : undefined,
              borderLeft: c.borderLeft ? `4px solid ${GREEN_MID}` : undefined,
              borderRight: c.borderRight ? `4px solid ${GREEN_MID}` : undefined,
              borderBottom: c.borderBottom ? `4px solid ${GREEN_MID}` : undefined,
              borderRadius: 6,
              boxShadow: `0 0 ${frameGlow * 14}px rgba(46,125,50,0.6)`,
            }}
          />
        ))}

        {/* QR code image */}
        <div
          style={{
            position: 'absolute',
            inset: 28,
            opacity: qrOpacity,
            background: '#fff',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Img
            src={staticFile('/icon/QRcode.png')}
            style={{ width: '78%', height: '78%', objectFit: 'contain' }}
          />
        </div>

        {/* scan laser */}
        <div
          style={{
            position: 'absolute',
            left: 10,
            right: 10,
            top: laserY,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${GREEN_LIGHT}, transparent)`,
            opacity: laserOpacity,
            boxShadow: `0 0 12px 2px rgba(108,190,69,0.8)`,
          }}
        />
      </div>
    </div>
  );
};

const InScreenSuccess: React.FC = () => {
  const frame = useCurrentFrame();

  const pop = spring({ frame: frame - SUCCESS_START, fps: 60, config: { damping: 12, stiffness: 160 } });
  const opacity = interpolate(frame, [SUCCESS_START, SUCCESS_START + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(pop, [0, 1], [0.4, 1]);

  const ringScale = interpolate(frame, [SUCCESS_START, SUCCESS_START + 20], [0.6, 1.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringOpacity = interpolate(frame, [SUCCESS_START, SUCCESS_START + 5, SUCCESS_START + 20], [0.6, 0.4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const secondRingScale = interpolate(frame, [SUCCESS_START + 6, SUCCESS_START + 26], [0.6, 2.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const secondRingOpacity = interpolate(
    frame,
    [SUCCESS_START + 6, SUCCESS_START + 11, SUCCESS_START + 26],
    [0.4, 0.25, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div className="absolute left-1/2" style={{ top: 220, transform: 'translateX(-50%)', opacity }}>
      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: 74,
          height: 74,
          border: `2px solid ${GREEN_MID}`,
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: 74,
          height: 74,
          border: `2px solid ${GREEN_LIGHT}`,
          transform: `translate(-50%, -50%) scale(${secondRingScale})`,
          opacity: secondRingOpacity,
        }}
      />
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: 68,
          height: 68,
          background: GREEN_MID,
          boxShadow: '0 0 34px 8px rgba(46,125,50,0.6)',
          transform: `scale(${scale})`,
        }}
      >
        <svg width="30" height="30" viewBox="0 0 30 30">
          <path d="M6 15 L12 22 L24 8" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// PHONE — same shell as Scene2 / Scene3 (metal bezel + white app screen)
// Phone is already present and floating from Scene3 — no entrance animation,
// it never disappears, only its screen content changes.
// ---------------------------------------------------------------------------

const PhoneContinuation: React.FC = () => {
  const frame = useCurrentFrame();

  const floatY = Math.sin(frame / 32) * 14;
  const rotateY = Math.sin(frame / 70) * 6;
  const rotateX = Math.cos(frame / 85) * 3;

  // subtle cinematic glass reflection sweeping slowly across the bezel
  const reflectionPos = interpolate(frame, [0, 94], [-30, 130], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: 320,
        height: 560,
        transformStyle: 'preserve-3d',
        transform: `translateY(${floatY}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
      }}
    >
      <div
        className="absolute left-1/2 rounded-full"
        style={{
          bottom: -60,
          width: 260,
          height: 38,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)',
          transform: 'translateX(-50%)',
          filter: 'blur(6px)',
        }}
      />

      <div
        className="absolute inset-0 rounded-[44px]"
        style={{
          background: 'linear-gradient(150deg, #5a5a5f, #1a1a1c 45%, #050505)',
          padding: 9,
          boxShadow: '0 36px 80px -18px rgba(0,0,0,0.7), inset 0 0 2px rgba(255,255,255,0.4)',
        }}
      >
        <div className="relative w-full h-full rounded-[36px] overflow-hidden" style={{ background: '#FAFDF8' }}>
          <div className="absolute inset-0 flex flex-col items-center px-6 pt-8">
            <div className="w-full flex items-center justify-between mb-4">
              <Img src={staticFile('icon/telebirr-logo.png')} className="h-7 object-contain" />
              <span
                className="font-black"
                style={{ color: '#0F5FCE', fontSize: 15, fontFamily: 'Noto Sans Ethiopic, sans-serif' }}
              >
                ቴሌብር
              </span>
            </div>
          </div>

          {/* animated payment flow content inside the screen */}
          <InScreenPayButton />
          <InScreenScanner />
          <InScreenSuccess />

          {/* glossy reflection sweep across the screen */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(115deg, transparent ${reflectionPos - 15}%, rgba(255,255,255,0.18) ${reflectionPos}%, transparent ${
                reflectionPos + 15
              }%)`,
            }}
          />
        </div>
      </div>

      {/* bezel reflection highlight */}
      <div
        className="absolute inset-0 rounded-[44px] pointer-events-none"
        style={{
          background: `linear-gradient(115deg, transparent ${reflectionPos - 25}%, rgba(255,255,255,0.10) ${reflectionPos}%, transparent ${
            reflectionPos + 25
          }%)`,
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// MAIN SCENE — 94 frames
// ---------------------------------------------------------------------------

export const Scene4_TapScan: React.FC = () => {
  const frame = useCurrentFrame();

  // continues Scene2/Scene3 camera language — slow zoom + horizontal drift
  const camZoom = interpolate(frame, [0, 94], [1.0, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });
  const cameraDrift = Math.sin(frame / 90) * 10;

  const ambientGlow = interpolate(
    frame,
    [0, TAP_END, SCAN_END, SUCCESS_START, 94],
    [0.32, 0.32, 0.5, 0.55, 0.75],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const particlesOpacity = interpolate(frame, [SUCCESS_START, SUCCESS_START + 12], [0.2, 0.9], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <PremiumTelebirrBackground>
      <AbsoluteFill
        className="flex items-center justify-center"
        style={{
          transform: `scale(${camZoom}) translateX(${cameraDrift}px)`,
          perspective: 1600,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 45%, rgba(108,190,69,0.35) 0%, rgba(6,23,10,0.2) 45%, transparent 75%)`,
            opacity: ambientGlow,
          }}
        />

        <FloatingPaymentParticles opacity={particlesOpacity} />

        <PhoneContinuation />

        <SentenceReveal text="ይጫኑ" startFrame={2} holdUntil={TAP_END} />
        <SentenceReveal text="ስካን ያድርጉ" startFrame={SCAN_START} holdUntil={SCAN_END} />
        <SentenceReveal text="ጨርሰዋል!" startFrame={SUCCESS_START} holdUntil={94} />

        <LightSweep triggerFrame={SCAN_START} />
        <LightSweep triggerFrame={SUCCESS_START} />
      </AbsoluteFill>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 45%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </PremiumTelebirrBackground>
  );
};

export default Scene4_TapScan;
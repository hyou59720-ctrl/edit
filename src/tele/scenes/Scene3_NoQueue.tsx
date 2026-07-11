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

const GREEN = '#1B5E20';
const GREEN_LIGHT = '#6CBE45';
const GREEN_MID = '#2E7D32';
const GOLD = '#F9A825';
const WHITE = '#F5FFF8';
const RED = '#DC2626';

// ---------------------------------------------------------------------------
// አንድ ሰው (queue ውስጥ የቆመ) - ቀላል silhouette
// ---------------------------------------------------------------------------
const PersonIcon: React.FC<{ color?: string }> = ({ color = '#9CA3AF' }) => (
  <svg width="42" height="70" viewBox="0 0 42 70">
    <circle cx="21" cy="14" r="12" fill={color} />
    <path d="M4 68 L4 46 Q4 32 21 32 Q38 32 38 46 L38 68 Z" fill={color} />
  </svg>
);

// ---------------------------------------------------------------------------
// ደረጃ 1 — ሰዎች ወረፋ ላይ ቆመው (0-26) → ቀይ "አይ" ምልክት ይመጣል (18-32)
// ---------------------------------------------------------------------------
const QueueScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const groupOpacity = interpolate(frame, [0, 10, 60, 74], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const peopleIn = [0, 6, 12, 18, 24].map((d) =>
    spring({ frame: frame - d, fps, config: { damping: 14, stiffness: 120 } })
  );

  const noSignScale = spring({ frame: frame - 26, fps, config: { damping: 11, stiffness: 150 } });
  const noSignOpacity = interpolate(frame, [26, 32, 58, 64], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dissolve = interpolate(frame, [58, 76], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ opacity: groupOpacity }}>
      <div
        className="mb-8 px-6 py-2 rounded-full"
        style={{
          background: 'rgba(220,38,38,0.12)',
          border: '1.5px solid rgba(220,38,38,0.4)',
          opacity: interpolate(frame, [4, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        <span style={{ color: '#F87171', fontWeight: 800, fontSize: 20, fontFamily: 'Noto Sans Ethiopic, sans-serif' }}>
          ረጅም ወረፋ...
        </span>
      </div>

      <div className="relative flex items-end gap-3">
        {peopleIn.map((s, i) => {
          const seed = i * 21.3;
          const sx = Math.sin(seed) * 150 * dissolve;
          const sy = Math.cos(seed * 1.5) * -120 * dissolve;
          const rot = Math.sin(seed * 2) * 90 * dissolve;
          const op = 1 - dissolve;
          return (
            <div
              key={i}
              style={{
                opacity: s * op,
                transform: `translate(${sx}px, ${sy}px) scale(${interpolate(s, [0, 1], [0.5, 1]) * (1 - dissolve * 0.4)}) rotate(${rot}deg)`,
                filter: `blur(${dissolve * 6}px)`,
              }}
            >
              <PersonIcon color={i === 4 ? GREEN_MID : '#9CA3AF'} />
            </div>
          );
        })}

        <div
          className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
          style={{
            width: 260,
            height: 260,
            border: `7px solid ${RED}`,
            opacity: noSignOpacity,
            transform: `translate(-50%, -50%) scale(${interpolate(noSignScale, [0, 1], [0.4, 1])})`,
            boxShadow: `0 0 30px rgba(220,38,38,0.5)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 7,
              height: 300,
              background: RED,
              transform: 'translate(-50%,-50%) rotate(45deg)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ደረጃ 2 — መብረቅ + ስልክ (ልክ አንደ Scene4 ስልክ ንድፍ - 320×560 bezel)
// ---------------------------------------------------------------------------
const InstantPhone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - 58;

  if (local < -6) return null;

  const flashOpacity = interpolate(local, [0, 3, 10], [0, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const boltPop = spring({ frame: local, fps, config: { damping: 9, stiffness: 220 } });
  const boltOpacity = interpolate(local, [0, 4, 16, 22], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const phoneIn = spring({ frame: local - 8, fps, config: { damping: 13, stiffness: 130 } });
  const phoneOpacity = interpolate(local, [8, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const floatY = Math.sin(frame / 32) * 10;

  const checkPop = spring({ frame: local - 16, fps, config: { damping: 10, stiffness: 170 } });
  const checkOpacity = interpolate(local, [16, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ringScale = interpolate(local, [16, 34], [0.5, 2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ringOpacity = interpolate(local, [16, 20, 34], [0.6, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-white pointer-events-none" style={{ opacity: flashOpacity }} />

      <svg
        width="90"
        height="90"
        viewBox="0 0 120 120"
        className="absolute"
        style={{
          opacity: boltOpacity,
          transform: `scale(${interpolate(boltPop, [0, 1], [0.2, 1])})`,
          filter: `drop-shadow(0 0 30px rgba(249,168,37,0.9))`,
        }}
      >
        <polygon points="66,14 38,64 56,64 48,106 88,52 68,52" fill={GOLD} />
      </svg>

      {/* ===== ልክ አንደ Scene4 ስልክ ንድፍ (320×560, ተመሳሳይ bezel) ===== */}
      <div
        style={{
          opacity: phoneOpacity,
          transform: `translateY(${floatY}px) scale(${interpolate(phoneIn, [0, 1], [0.7, 1])})`,
        }}
        className="flex flex-col items-center"
      >
        <div
          style={{
            width: 320,
            height: 560,
            position: 'relative',
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

              {/* ስኬት ቼክ ማዕከል ላይ */}
              <div className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%,-40%)' }}>
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
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: 68,
                    height: 68,
                    background: GREEN_MID,
                    opacity: checkOpacity,
                    transform: `scale(${interpolate(checkPop, [0, 1], [0.3, 1])})`,
                    boxShadow: '0 0 30px 6px rgba(46,125,50,0.55)',
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 30 30">
                    <path d="M6 15 L12 22 L24 8" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-6 px-6 py-2 rounded-full"
          style={{
            background: 'rgba(46,125,50,0.15)',
            border: `1.5px solid ${GREEN_LIGHT}`,
            opacity: checkOpacity,
          }}
        >
          <span style={{ color: GREEN_LIGHT, fontWeight: 900, fontSize: 20, fontFamily: 'Noto Sans Ethiopic, sans-serif' }}>
            ወዲያውኑ ተጠናቀቀ!
          </span>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ጽሑፍ ርዕስ
// ---------------------------------------------------------------------------
const SentenceReveal: React.FC<{ text: string; startFrame: number; holdUntil: number }> = ({ text, startFrame, holdUntil }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  if (local < -1) return null;

  const entrance = spring({ frame: local, fps, config: { damping: 18, stiffness: 130, mass: 0.9 } });
  const opacity = interpolate(frame, [startFrame, startFrame + 10, holdUntil, holdUntil + 10], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const blurAmount = interpolate(local, [0, 14], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const scale = interpolate(entrance, [0, 1], [0.78, 1]);

  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: '9%', display: 'flex', justifyContent: 'center', opacity }}>
      <span
        style={{
          display: 'inline-block',
          filter: `blur(${blurAmount}px)`,
          transform: `scale(${scale})`,
          fontFamily: '"Noto Sans Ethiopic", "Nyala", sans-serif',
          fontWeight: 800,
          fontSize: 60,
          color: WHITE,
          textShadow: `0 0 24px rgba(108,190,69,0.7)`,
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
// MAIN SCENE — 80 ፍሬም
// ---------------------------------------------------------------------------
export const Scene3_NoQueue: React.FC = () => {
  const frame = useCurrentFrame();
  const camZoom = interpolate(frame, [0, 80], [1.05, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <PremiumTelebirrBackground>
      <AbsoluteFill className="flex items-center justify-center" style={{ transform: `scale(${camZoom})` }}>
        <QueueScene />
        <InstantPhone />

        <SentenceReveal text="መጨናነቅ የለም" startFrame={4} holdUntil={44} />
        <SentenceReveal text="መጠበቅ የለም!" startFrame={44} holdUntil={80} />
      </AbsoluteFill>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, transparent 45%, rgba(0,0,0,0.5) 100%)' }}
      />
    </PremiumTelebirrBackground>
  );
};

export default Scene3_NoQueue;
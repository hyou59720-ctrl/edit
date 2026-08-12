import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from 'remotion';

// ==========================================
// 🌟 ዲዛይን ቶከኖች (Design Tokens)
// ==========================================
// Palette: ጥልቅ ሚድናይት ብሉ ጀርባ + ኤሌክትሪክ ሲያን አክሰንት + አምበር ለ"ፕሮ" ግላይ
const COLORS = {
  bg: '#050914',
  bgGlow: 'rgba(56, 189, 248, 0.16)',
  panel: 'rgba(10, 16, 32, 0.72)',
  border: 'rgba(94, 213, 255, 0.22)',
  borderStrong: 'rgba(94, 213, 255, 0.55)',
  cyan: '#5ed5ff',
  cyanDeep: '#0ea5e9',
  amber: '#fbbf24',
  green: '#34d399',
  textDim: '#7c8aa8',
  textMid: '#a8b7d4',
};

const mainContainer: React.CSSProperties = {
  backgroundColor: COLORS.bg,
  color: 'white',
  fontFamily:
    '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
  overflow: 'hidden',
};

const glassCard: React.CSSProperties = {
  background: COLORS.panel,
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: `1px solid ${COLORS.border}`,
  borderRadius: '20px',
  boxShadow:
    '0 20px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255,255,255,0.02) inset, 0 0 40px rgba(14, 165, 233, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
};

const eyebrow: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '3.5px',
  fontWeight: 700,
  color: COLORS.textDim,
  textTransform: 'uppercase',
};

// ==========================================
// 🎛 ትንንሽ SVG አይኮኖች (Custom line icons — no emoji)
// ==========================================
const IconFolder = ({ size = 34, color = COLORS.cyan }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6.5C3 5.67 3.67 5 4.5 5H9l2 2h8.5c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-15C3.67 19 3 18.33 3 17.5v-11Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const IconClapper = ({ size = 30, color = COLORS.cyan }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 10.5 19.5 6l1 3.7L4 14.2 3 10.5Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    <rect x="4" y="12" width="16" height="8" rx="1.2" stroke={color} strokeWidth="1.6" />
    <path d="M8 9 6.5 5.6M13.5 7.6 12 4.2" stroke={color} strokeWidth="1.4" />
  </svg>
);

const IconScissors = ({ size = 30, color = COLORS.cyan }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="6" r="2.2" stroke={color} strokeWidth="1.6" />
    <circle cx="6" cy="18" r="2.2" stroke={color} strokeWidth="1.6" />
    <path d="M7.6 7.4 20 18M20 6 7.6 16.6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const IconCheck = ({ size = 22, color = COLORS.green }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9.3" stroke={color} strokeWidth="1.6" />
    <path d="M7.5 12.5 10.4 15.5 16.5 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PracticalEditingBroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 🌟 አጠቃላይ የ B-roll Fade In / Fade Out (ከ 0 እስከ 140 ፍሬም)
  const globalOpacity = interpolate(frame, [0, 15, 125, 140], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // የጀርባ ግላይ ቀስ ብሎ የሚተነፍስ (ambient breathing)
  const bgPulse = 0.85 + 0.15 * Math.sin(frame / 18);

  // ==========================================
  // ክፍል 1፡ Assignments (Frame 0 - 45)
  // ==========================================
  const assignmentsOpacity = interpolate(frame, [0, 10, 40, 50], [0, 1, 1, 0]);
  const assignmentsScale = interpolate(frame, [0, 45], [0.92, 1.03]);

  const card1 = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 13 } });
  const card2 = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 13 } });
  const card3 = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 13 } });

  // ==========================================
  // ክፍል 2፡ Timeline Editing (Frame 45 - 82)
  // ==========================================
  const timelineOpacity = interpolate(frame, [40, 50, 75, 85], [0, 1, 1, 0]);
  const timelineZoom = interpolate(frame, [45, 82], [0.85, 1.12]);

  const playheadX = interpolate(frame, [45, 80], [8, 92], { extrapolateRight: 'clamp' });

  const cutFlash1 = interpolate(frame, [55, 58, 62], [1, 1.6, 1], { extrapolateRight: 'clamp' });
  const cutFlash2 = interpolate(frame, [65, 68, 72], [1, 1.6, 1], { extrapolateRight: 'clamp' });

  // የ scissors አዶ በካትስ ላይ ብቅ ብቅ ማለት
  const scissorsPop1 = interpolate(frame, [55, 58, 63], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scissorsPop2 = interpolate(frame, [65, 68, 73], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // waveform bars (ለ audio track)
  const waveBars = Array.from({ length: 28 }, (_, i) => {
    const h = 4 + Math.abs(Math.sin(i * 0.9 + frame * 0.15)) * 14;
    return h;
  });

  // ==========================================
  // ክፍል 3፡ 3-6 Months Progress (Frame 82 - 140)
  // ==========================================
  const progressOpacity = interpolate(frame, [75, 85, 125, 140], [0, 1, 1, 0]);
  const progressScale = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 14 } });

  const monthCount = Math.min(6, Math.max(1, Math.floor(interpolate(frame, [85, 115], [1, 6.9]))));
  const barWidth = interpolate(frame, [85, 115], [15, 100], { extrapolateRight: 'clamp' });
  const successPop = spring({ frame: Math.max(0, frame - 115), fps, config: { damping: 10 } });
  const readyGlow = interpolate(frame, [115, 125], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ ...mainContainer, opacity: globalOpacity }}>
      {/* የጀርባ ፍካት (Ambient Glow) */}
      <div
        style={{
          position: 'absolute',
          width: '65%',
          height: '65%',
          top: '18%',
          left: '18%',
          background: `radial-gradient(circle, ${COLORS.bgGlow} 0%, transparent 70%)`,
          filter: 'blur(50px)',
          opacity: bgPulse,
        }}
      />
      {/* ስውር grid ንድፍ (subtle grid texture) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(94,213,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(94,213,255,0.035) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ========================================== */}
      {/* 1. ASSIGNMENTS SECTION */}
      {/* ========================================== */}
      {frame < 55 && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: assignmentsOpacity,
            transform: `scale(${assignmentsScale})`,
            gap: '30px',
          }}
        >
          <div style={{ ...eyebrow, fontSize: '14px' }}>INCOMING WORK</div>
          <div style={{ display: 'flex', gap: '26px' }}>
            {[card1, card2, card3].map((anim, index) => (
              <div
                key={index}
                style={{
                  ...glassCard,
                  width: '220px', // 🌟 አድጓል (ከ 176px)
                  height: '260px', // 🌟 አድጓል (ከ 210px)
                  transform: `translateY(${(1 - anim) * 50}px) scale(${0.94 + anim * 0.06})`,
                  gap: '18px',
                }}
              >
                <div
                  style={{
                    width: '72px', // 🌟 አድጓል
                    height: '72px', // 🌟 አድጓል
                    borderRadius: '16px',
                    background: 'rgba(94,213,255,0.08)',
                    border: `1px solid ${COLORS.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconFolder size={36} /> 
                </div>
                <div style={{ fontSize: '13px', color: COLORS.textDim, fontWeight: 700, letterSpacing: '2px' }}>
                  PROJECT 0{index + 1}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '0.5px' }}>Assignment</div>
                <div
                  style={{
                    width: '70%',
                    height: '4px',
                    borderRadius: '4px',
                    background: `linear-gradient(90deg, ${COLORS.cyanDeep}, transparent)`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. TIMELINE EDITING SECTION */}
      {/* ========================================== */}
      {frame >= 40 && frame < 90 && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: timelineOpacity,
            transform: `scale(${timelineZoom})`,
          }}
        >
          <div
            style={{
              width: '82%',
              height: '320px',
              ...glassCard,
              padding: '26px 28px',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '22px',
              }}
            >
              <IconClapper size={22} />
              <div style={{ ...eyebrow, color: COLORS.cyan }}>PRACTICAL EDITING WORKSPACE</div>
            </div>

            {/* Ruler */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ fontSize: '9px', color: 'rgba(124,138,168,0.6)', letterSpacing: '1px' }}>
                  {`00:${(i * 3).toString().padStart(2, '0')}`}
                </div>
              ))}
            </div>

            {/* Timeline Tracks */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
              {/* Playhead */}
              <div
                style={{
                  position: 'absolute',
                  top: '-14px',
                  bottom: '-14px',
                  left: `${playheadX}%`,
                  width: '2px',
                  backgroundColor: '#ffffff',
                  zIndex: 10,
                  boxShadow: '0 0 12px #ffffff, 0 0 26px #5ed5ff',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '-6px',
                    width: '14px',
                    height: '14px',
                    backgroundColor: COLORS.cyan,
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  }}
                />
              </div>

              {/* Scissors pop at cut points */}
              <div
                style={{
                  position: 'absolute',
                  top: '-30px',
                  left: '54%',
                  opacity: scissorsPop1,
                  transform: `translateY(${(1 - scissorsPop1) * 10}px)`,
                }}
              >
                <IconScissors size={20} color={COLORS.amber} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: '-30px',
                  left: '80%',
                  opacity: scissorsPop2,
                  transform: `translateY(${(1 - scissorsPop2) * 10}px)`,
                }}
              >
                <IconScissors size={20} color={COLORS.amber} />
              </div>

              {/* Video Track (V1) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '9px', color: COLORS.textDim, fontWeight: 700, letterSpacing: '1.5px' }}>V1</div>
                <div style={{ display: 'flex', gap: '5px', height: '46px', width: '100%' }}>
                  <div
                    style={{
                      width: '30%',
                      background: `linear-gradient(180deg, ${COLORS.cyanDeep}, #0369a1)`,
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  />
                  <div
                    style={{
                      width: '25%',
                      background: `linear-gradient(180deg, ${COLORS.cyanDeep}, #0369a1)`,
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      filter: `brightness(${cutFlash1})`,
                      transform: `scale(${cutFlash1 === 1 ? 1 : 1.04})`,
                    }}
                  />
                  <div
                    style={{
                      width: '40%',
                      background: `linear-gradient(180deg, ${COLORS.cyanDeep}, #0369a1)`,
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      filter: `brightness(${cutFlash2})`,
                      transform: `scale(${cutFlash2 === 1 ? 1 : 1.04})`,
                    }}
                  />
                </div>
              </div>

              {/* Audio Track (A1) — real waveform */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '9px', color: COLORS.textDim, fontWeight: 700, letterSpacing: '1.5px' }}>A1</div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    height: '30px',
                    width: '100%',
                    background: 'rgba(52,211,153,0.06)',
                    borderRadius: '6px',
                    border: '1px solid rgba(52,211,153,0.15)',
                    padding: '0 8px',
                  }}
                >
                  {waveBars.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: '3px',
                        height: `${h}px`,
                        borderRadius: '2px',
                        backgroundColor: COLORS.green,
                        opacity: 0.75,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. PROGRESS TO PRO EDITOR (Frame 75 - 140) */}
      {/* ========================================== */}
      {frame >= 75 && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: progressOpacity,
            transform: `scale(${progressScale})`,
          }}
        >
          <div
            style={{
              ...glassCard,
              width: '520px', // 🌟 አድጓል (ከ 420px)
              height: '330px', // 🌟 አድጓል (ከ 270px)
              padding: '40px', // 🌟 አድጓል
              alignItems: 'flex-start',
              border:
                monthCount === 6
                  ? `1.5px solid ${COLORS.borderStrong}`
                  : `1px solid ${COLORS.border}`,
              boxShadow:
                monthCount === 6
                  ? `0 20px 60px rgba(0,0,0,0.55), 0 0 ${40 + readyGlow * 30}px rgba(94,213,255,${0.15 + readyGlow * 0.2})`
                  : glassCard.boxShadow,
            }}
          >
            <div style={{ ...eyebrow, fontSize: '14px' }}>TIMELINE</div>
            <div
              style={{
                fontSize: '60px', // 🌟 አድጓል (ከ 46px)
                fontWeight: 800,
                margin: '12px 0 6px',
                letterSpacing: '-0.5px',
                color: '#ffffff',
                textShadow: `0 0 18px rgba(94,213,255,0.55)`,
              }}
            >
              Month 0{monthCount}
            </div>
            <div style={{ fontSize: '16px', color: COLORS.textMid, marginBottom: '24px' }}>
              of consistent practical editing
            </div>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '10px', // 🌟 አድጓል
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${barWidth}%`,
                  background: `linear-gradient(90deg, ${COLORS.cyanDeep}, ${COLORS.cyan})`,
                  boxShadow: `0 0 12px ${COLORS.cyan}`,
                }}
              />
            </div>

            {/* Success Message */}
            <div style={{ height: '50px', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '26px' }}>
              {frame >= 115 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transform: `scale(${successPop})`,
                  }}
                >
                  <IconCheck size={26} /> {/* 🌟 አድጓል */}
                  <span
                    style={{
                      fontSize: '22px', // 🌟 አድጓል
                      fontWeight: 700,
                      color: COLORS.green,
                      textShadow: '0 0 12px rgba(52,211,153,0.6)',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Pro Editor Ready
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default PracticalEditingBroll;

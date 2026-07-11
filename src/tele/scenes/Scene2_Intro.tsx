import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";
import PremiumTelebirrBackground from "./background"; // የጀርባው ፋይል ጥሪ

const GREEN = "#1B5E20";
const GREEN_LIGHT = "#6CBE45";
const GREEN_MID = "#2E7D32";
const GOLD = "#F9A825";
const GOLD_LIGHT = "#FFD873";

const MoneyParticle: React.FC<{
  frame: number;
  delay: number;
  originX: number;
  originY: number;
  angle: number;
}> = ({ frame, delay, originX, originY, angle }) => {
  const local = frame - delay;
  if (local < 0 || local > 55) return null;
  const t = interpolate(local, [0, 55], [0, 1], { extrapolateRight: "clamp" });
  const dist = t * 260;
  const x = originX + Math.cos(angle) * dist;
  const y = originY - t * 340 + Math.sin(angle) * dist * 0.3;
  const opacity = interpolate(local, [0, 8, 40, 55], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(local, [0, 10], [0.3, 1], {
    extrapolateRight: "clamp",
  });
  const spin = local * 6;

  return (
    <div
      className="absolute z-30 flex items-center justify-center rounded-full font-black"
      style={{
        left: x,
        top: y,
        width: 30,
        height: 30,
        opacity,
        transform: `scale(${scale}) rotate(${spin}deg)`,
        background: `radial-gradient(circle at 35% 30%, ${GOLD_LIGHT}, ${GOLD} 70%)`,
        boxShadow: `0 0 14px 2px rgba(249,168,37,0.6)`,
        color: "#7A4A00",
        fontSize: 11,
        fontFamily: "Noto Sans Ethiopic, sans-serif",
      }}
    >
      ብር
    </div>
  );
};

export const TelebirrCommercial: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const SEQ_DURATION = 218;
  const EXIT_START = SEQ_DURATION - 30; // 188

  const cameraIn = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 40 },
  });
  const cameraZoom = interpolate(cameraIn, [0, 1], [1.18, 1]);
  const cameraDrift = Math.sin(frame / 90) * 10;

  const phoneEntrance = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 60 },
  });
  const floatY = Math.sin(frame / 32) * 14;
  const rotateY =
    Math.sin(frame / 70) * 9 +
    interpolate(frame, [0, 40], [22, 0], { extrapolateRight: "clamp" });
  const rotateX =
    Math.cos(frame / 85) * 4 +
    interpolate(frame, [0, 40], [8, 0], { extrapolateRight: "clamp" });

  const pushIn = interpolate(frame, [95, 150], [1, 1.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ==== 🚪 መውጫ ትራንዚሽን ====
  const exitProgress = interpolate(frame, [EXIT_START, SEQ_DURATION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitTranslateX = interpolate(exitProgress, [0, 1], [0, -520]);
  const exitRotateY = interpolate(exitProgress, [0, 1], [0, -35]);
  const exitOpacity = interpolate(exitProgress, [0, 0.85, 1], [1, 1, 0]);
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.82]);

  const tapScale = interpolate(frame, [54, 57, 61], [1, 0.93, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fingerOpacity = interpolate(frame, [46, 52, 62, 68], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
  const fingerY = interpolate(frame, [46, 56], [-26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rippleT = interpolate(frame, [55, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const waveScale = 1 + rippleT * 6;
  const waveOpacity = interpolate(rippleT, [0, 1], [0.55, 0]);

  const successScale = spring({
    frame: frame - 95,
    fps,
    config: { damping: 10, stiffness: 140 },
  });
  const successOpacity = interpolate(frame, [92, 98], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headerIn = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const balanceIn = interpolate(frame, [18, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const actionIn = interpolate(frame, [26, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sendGlow = interpolate(frame % 36, [0, 18, 36], [0.15, 0.5, 0.15]);

  const title1 = interpolate(frame, [4, 22, 118, 132], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
  const title1Blur = interpolate(frame, [4, 22], [10, 0], {
    extrapolateRight: "clamp",
  });
  const title2 = interpolate(
    frame,
    [130, 148, EXIT_START, SEQ_DURATION],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" },
  );
  const title2Y = interpolate(frame, [130, 148], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const brandTagIn = interpolate(
    frame,
    [150, 168, EXIT_START, SEQ_DURATION],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" },
  );

  const bgExitOpacity = interpolate(
    frame,
    [EXIT_START, SEQ_DURATION],
    [1, 0.4],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <PremiumTelebirrBackground bgExitOpacity={bgExitOpacity}>
      <AbsoluteFill
        className="flex flex-col items-center justify-center"
        style={{
          transform: `scale(${cameraZoom * pushIn}) translateX(${cameraDrift}px)`,
          perspective: 1600,
        }}
      >
        <div
          className="absolute top-[9%] text-center px-10"
          style={{ opacity: title1, filter: `blur(${title1Blur}px)` }}
        >
          <h1
            className="text-white font-black tracking-wide"
            style={{
              fontSize: 52,
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
              fontFamily: "Noto Sans Ethiopic, sans-serif",
            }}
          >
            ገንዘብዎን በቀላሉ <span style={{ color: GOLD_LIGHT }}>ይላኩ</span>
          </h1>
        </div>

        {/* ---------- 3D FLOATING PHONE ---------- */}
        <div
          style={{
            width: 400,
            height: 700,
            transformStyle: "preserve-3d",
            transform: `translateY(${floatY + (1 - phoneEntrance) * 80}px) translateX(${exitTranslateX}px) rotateY(${rotateY + exitRotateY}deg) rotateX(${rotateX}deg) scale(${phoneEntrance * exitScale})`,
            opacity: exitOpacity,
          }}
        >
          <div
            className="absolute left-1/2 rounded-full"
            style={{
              bottom: -70,
              width: 320,
              height: 46,
              background:
                "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)",
              transform: "translateX(-50%)",
              filter: "blur(6px)",
            }}
          />

          <div
            className="absolute inset-0 rounded-[54px]"
            style={{
              background:
                "linear-gradient(150deg, #5a5a5f, #1a1a1c 45%, #050505)",
              padding: 11,
              boxShadow:
                "0 40px 90px -20px rgba(0,0,0,0.7), inset 0 0 2px rgba(255,255,255,0.4)",
            }}
          >
            <div
              className="relative w-full h-full rounded-[44px] overflow-hidden"
              style={{ background: "#FAFDF8" }}
            >
              <div className="absolute inset-0 flex flex-col items-center px-7 pt-14">
                <div
                  className="w-full flex items-center justify-between mb-5"
                  style={{ opacity: headerIn }}
                >
                  <Img
                    src={staticFile("icon/telebirr-logo.png")}
                    className="h-9 object-contain"
                  />
                  <span
                    className="font-black"
                    style={{
                      color: "#0F5FCE",
                      fontSize: 18,
                      fontFamily: "Noto Sans Ethiopic, sans-serif",
                    }}
                  >
                    ቴሌብር
                  </span>
                </div>

                <div
                  className="w-full rounded-3xl px-6 py-6 mb-7 relative overflow-hidden"
                  style={{
                    opacity: balanceIn,
                    transform: `translateY(${(1 - balanceIn) * 14}px)`,
                    background: `linear-gradient(135deg, ${GREEN_LIGHT}, ${GREEN})`,
                    boxShadow: "0 20px 40px -12px rgba(46,125,50,0.5)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 80% 0%, rgba(255,255,255,0.18), transparent 60%)",
                    }}
                  />
                  <p className="text-white/80 text-xs font-bold mb-2 relative z-10">
                    Balance (ETB)
                  </p>
                  <p className="text-white font-black text-3xl tracking-widest relative z-10">
                    ••••••
                  </p>
                </div>

                <div
                  className="relative w-full rounded-2xl py-5 flex items-center justify-center gap-3 overflow-hidden"
                  style={{
                    opacity: actionIn,
                    transform: `translateY(${(1 - actionIn) * 12}px) scale(${tapScale})`,
                    background: "rgba(46,125,50,0.08)",
                    border: `2px solid ${GREEN_MID}`,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      boxShadow: `0 0 0 4px rgba(46,125,50,${sendGlow})`,
                    }}
                  />
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ background: GREEN_MID }}
                  />
                  <span
                    className="font-black text-lg"
                    style={{
                      color: GREEN_MID,
                      fontFamily: "Noto Sans Ethiopic, sans-serif",
                    }}
                  >
                    Send Money
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

                  <div
                    className="absolute z-30"
                    style={{
                      opacity: successOpacity,
                      transform: `scale(${successScale})`,
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: GREEN_MID,
                        boxShadow: "0 0 30px 6px rgba(46,125,50,0.6)",
                      }}
                    >
                      <svg width="30" height="30" viewBox="0 0 30 30">
                        <path
                          d="M6 15 L12 22 L24 8"
                          stroke="#fff"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div
                  className="w-full flex items-center justify-center gap-2 mt-6"
                  style={{ opacity: actionIn }}
                >
                  <div
                    className="w-5 h-5 rounded"
                    style={{ background: GOLD }}
                  />
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#5b6b5c" }}
                  >
                    QR ስካን ክፍያ
                  </span>
                </div>
              </div>

              {Array.from({ length: 7 }).map((_, i) => (
                <MoneyParticle
                  key={i}
                  frame={frame}
                  delay={60 + i * 3}
                  originX={215 + (i % 3) * 12}
                  originY={330}
                  angle={-Math.PI / 2 + (i - 3) * 0.22}
                />
              ))}
            </div>
          </div>

          <div
            className="absolute z-50"
            style={{ left: 200, top: 355 + fingerY, opacity: fingerOpacity }}
          >
            <svg width="46" height="46" viewBox="0 0 46 46">
              <circle
                cx="23"
                cy="23"
                r="22"
                fill="#111827"
                opacity="0.85"
                stroke="#fff"
                strokeWidth="2"
              />
              <circle cx="23" cy="23" r="9" fill={GREEN_LIGHT} />
            </svg>
          </div>
        </div>

        <div
          className="absolute bottom-[13%] text-center px-10"
          style={{ opacity: title2, transform: `translateY(${title2Y}px)` }}
        >
          <p
            className="font-black tracking-wide"
            style={{
              color: "#fff",
              fontSize: 34,
              fontFamily: "Noto Sans Ethiopic, sans-serif",
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            ክፍያዎን በፍጥነት <span style={{ color: GOLD_LIGHT }}>ይፈጽሙ</span>
          </p>
        </div>

        <div
          className="absolute bottom-[6%] text-center"
          style={{
            opacity: brandTagIn,
            transform: `translateY(${(1 - brandTagIn) * 10}px)`,
          }}
        >
          <p className="text-white/90 font-bold tracking-[0.3em] text-sm uppercase">
            Telebirr <span style={{ color: GOLD_LIGHT }}>—</span> Digital
            Payment Made Easy
          </p>
        </div>
      </AbsoluteFill>
    </PremiumTelebirrBackground>
  );
};

export default TelebirrCommercial;

// ============================================================================
// Transition.tsx — Cinematic Transition Engine for Remotion v4 (OPTIMIZED)
// React + TypeScript. No external motion-blur package. No CSS animations.
// Performance-first: gated heavy layers, precomputed grain pool, stable deps.
// ============================================================================

import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";

// ============================================================================
// SECTION 1 — TYPES
// ============================================================================

export type TransitionType =
  | "cinematic" | "impact" | "whip" | "flash" | "zoomPunch" | "glitchCut" | "softDissolve";

export type Direction = "left" | "right" | "up" | "down" | "in" | "out";

export type Quality = "preview" | "final";

export interface TransitionConfig {
  type: TransitionType;
  frame: number;
  duration?: number;
  intensity?: number;
  direction?: Direction;
  blur?: number;
  shake?: number;
  flash?: number;
  id?: string;
}

interface ResolvedTransition extends Required<Omit<TransitionConfig, "id">> {
  id: string;
  startFrame: number;
  endFrame: number;
  ease: EaseName;
  weights: TransitionPreset["weights"];
}

interface BlendedTransitionState {
  scale: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  translateX: number;
  translateY: number;
  cameraZ: number;
  perspective: number;
  opacity: number;
  brightness: number;
  contrast: number;
  saturate: number;
  directionalBlur: number;
  speedRampBlur: number;
  chromaticAberration: number;
  lensDistortion: number;
  shakeX: number;
  shakeY: number;
  shakeRotate: number;
  noiseFlash: number;
  filmGrain: number;
  glow: number;
  vignette: number;
  lightLeak: number;
  flashFrame: number;
  activeCount: number;
}

// ============================================================================
// SECTION 2 — EASING LIBRARY
// ============================================================================

const EASE_LIBRARY = {
  apple: Easing.bezier(0.22, 1, 0.36, 1),
  linear: Easing.bezier(0.16, 1, 0.3, 1),
  stripe: Easing.bezier(0.65, 0, 0.35, 1),
  framer: Easing.bezier(0.34, 1.56, 0.64, 1),
  tiktok: Easing.bezier(0.83, 0, 0.17, 1),
  mrbeast: Easing.bezier(0.9, 0, 0.1, 1),
  cinematic: Easing.bezier(0.25, 1, 0.5, 1),
  impactOut: Easing.out(Easing.back(1.8)),
} as const;

type EaseName = keyof typeof EASE_LIBRARY;

// ============================================================================
// SECTION 3 — PRESETS
// ============================================================================

interface TransitionPreset {
  duration: number;
  intensity: number;
  direction: Direction;
  blur: number;
  shake: number;
  flash: number;
  ease: EaseName;
  weights: {
    scale: number; rotation: number; camera: number; perspective: number;
    translate: number; chromatic: number; lensDistortion: number;
    grain: number; vignette: number; lightLeak: number; glow: number;
  };
}

const TRANSITION_PRESETS: Record<TransitionType, TransitionPreset> = {
  cinematic: { duration: 24, intensity: 1, direction: "in", blur: 10, shake: 2, flash: 0.15, ease: "cinematic",
    weights: { scale: 1, rotation: 0.4, camera: 1, perspective: 1, translate: 0.3, chromatic: 0.5, lensDistortion: 0.4, grain: 0.6, vignette: 1, lightLeak: 0.6, glow: 0.5 } },
  impact: { duration: 14, intensity: 1.4, direction: "in", blur: 22, shake: 9, flash: 0.55, ease: "mrbeast",
    weights: { scale: 1.3, rotation: 0.5, camera: 0.6, perspective: 0.7, translate: 0.2, chromatic: 1, lensDistortion: 0.8, grain: 0.4, vignette: 0.7, lightLeak: 0.3, glow: 1 } },
  whip: { duration: 16, intensity: 1.2, direction: "left", blur: 34, shake: 3, flash: 0.2, ease: "tiktok",
    weights: { scale: 0.6, rotation: 0.9, camera: 0.3, perspective: 0.5, translate: 1.4, chromatic: 0.7, lensDistortion: 0.3, grain: 0.2, vignette: 0.4, lightLeak: 0.2, glow: 0.3 } },
  flash: { duration: 8, intensity: 1, direction: "in", blur: 6, shake: 1, flash: 1, ease: "mrbeast",
    weights: { scale: 0.3, rotation: 0.1, camera: 0.2, perspective: 0.2, translate: 0.1, chromatic: 0.3, lensDistortion: 0.1, grain: 0.8, vignette: 0.2, lightLeak: 1, glow: 0.8 } },
  zoomPunch: { duration: 12, intensity: 1.6, direction: "in", blur: 18, shake: 5, flash: 0.3, ease: "impactOut",
    weights: { scale: 1.8, rotation: 0.2, camera: 1, perspective: 0.9, translate: 0.1, chromatic: 0.6, lensDistortion: 0.6, grain: 0.3, vignette: 0.8, lightLeak: 0.2, glow: 0.6 } },
  glitchCut: { duration: 10, intensity: 1.3, direction: "left", blur: 12, shake: 12, flash: 0.4, ease: "tiktok",
    weights: { scale: 0.4, rotation: 0.3, camera: 0.2, perspective: 0.3, translate: 0.8, chromatic: 1.6, lensDistortion: 0.2, grain: 1, vignette: 0.3, lightLeak: 0.1, glow: 0.2 } },
  softDissolve: { duration: 30, intensity: 0.7, direction: "in", blur: 8, shake: 0, flash: 0.05, ease: "apple",
    weights: { scale: 0.4, rotation: 0.1, camera: 0.4, perspective: 0.3, translate: 0.1, chromatic: 0.1, lensDistortion: 0.1, grain: 0.3, vignette: 0.5, lightLeak: 0.4, glow: 0.4 } },
};

// ============================================================================
// SECTION 4 — RESOLVE / IMPULSE HELPERS (pure, cheap)
// ============================================================================

function resolveTransition(cfg: TransitionConfig, index: number): ResolvedTransition {
  const preset = TRANSITION_PRESETS[cfg.type];
  const duration = cfg.duration ?? preset.duration;
  return {
    id: cfg.id ?? `${cfg.type}-${cfg.frame}-${index}`,
    type: cfg.type,
    frame: cfg.frame,
    duration,
    intensity: cfg.intensity ?? preset.intensity,
    direction: cfg.direction ?? preset.direction,
    blur: cfg.blur ?? preset.blur,
    shake: cfg.shake ?? preset.shake,
    flash: cfg.flash ?? preset.flash,
    startFrame: cfg.frame - duration / 2,
    endFrame: cfg.frame + duration / 2,
    ease: preset.ease,
    weights: preset.weights,
  };
}

function directionVector(direction: Direction): { x: number; y: number } {
  switch (direction) {
    case "left": return { x: -1, y: 0 };
    case "right": return { x: 1, y: 0 };
    case "up": return { x: 0, y: -1 };
    case "down": return { x: 0, y: 1 };
    default: return { x: 0, y: 0 };
  }
}

function impulseProgress(frame: number, t: ResolvedTransition): number {
  if (frame <= t.startFrame || frame >= t.endFrame) return 0;
  const half = t.duration / 2;
  const easeFn = EASE_LIBRARY[t.ease];
  if (frame <= t.frame) {
    const p = (frame - t.startFrame) / half;
    return easeFn(Math.min(1, Math.max(0, p)));
  }
  const p = 1 - (frame - t.frame) / half;
  return easeFn(Math.min(1, Math.max(0, p)));
}

// ============================================================================
// SECTION 5 — CORE HOOK
// ============================================================================

function useTransitionEngine(configs: TransitionConfig[] = [], quality: Quality): BlendedTransitionState {
  const frame = useCurrentFrame();

  const resolved = useMemo(
    () => (configs || []).map((c, i) => resolveTransition(c, i)),
    [configs]
  );

  return useMemo(() => {
    const active = resolved.filter((t) => frame > t.startFrame && frame < t.endFrame);

    const state: BlendedTransitionState = {
      scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0,
      translateX: 0, translateY: 0, cameraZ: 0, perspective: 1000,
      opacity: 1, brightness: 1, contrast: 1, saturate: 1,
      directionalBlur: 0, speedRampBlur: 0,
      chromaticAberration: 0, lensDistortion: 0,
      shakeX: 0, shakeY: 0, shakeRotate: 0,
      noiseFlash: 0, filmGrain: 0, glow: 0, vignette: 0, lightLeak: 0, flashFrame: 0,
      activeCount: active.length,
    };

    if (active.length === 0) return state;

    let scaleAccum = 1;
    const isPreview = quality === "preview";

    for (const t of active) {
      const p = impulseProgress(frame, t);
      const w = t.weights;
      const mag = t.intensity;
      const dir = directionVector(t.direction);

      const scaleDelta = 1 + (t.type === "zoomPunch" || t.type === "impact" ? p * 0.35 : p * 0.15) * w.scale * mag;
      scaleAccum *= scaleDelta;

      state.rotateX += p * 8 * w.rotation * mag * (dir.y || 0.3);
      state.rotateY += p * 14 * w.rotation * mag * (dir.x || 0.3);
      state.rotateZ += p * 4 * w.rotation * mag * (t.direction === "left" ? -1 : 1);

      const pushPull = t.type === "impact" || t.type === "zoomPunch" ? 1 : -1;
      state.cameraZ += p * 120 * w.camera * mag * pushPull;
      state.perspective = Math.min(state.perspective, 1000 - p * 400 * w.perspective * mag);

      state.translateX += p * 260 * w.translate * mag * dir.x;
      state.translateY += p * 260 * w.translate * mag * dir.y;

      if (t.type === "flash" || t.type === "softDissolve") {
        state.opacity = Math.min(state.opacity, 1 - p * 0.4);
      }

      state.brightness += p * t.flash * 1.6;
      state.contrast += p * t.flash * 0.5;
      state.saturate += p * t.flash * 0.7 - p * 0.15;

      // 👈 ማስተካከያ፦ በሉፕ ውስጥ የነበረውን የ shake ስሌት አስተማማኝ በሆነ ንጹህ ሂሳብ ተክተነዋል
      if (t.shake > 0) {
        const seed = `${t.id}-shake`;
        state.shakeX += (random(`${seed}-x-${frame}`) - 0.5) * t.shake * p * 2;
        state.shakeY += (random(`${seed}-y-${frame}`) - 0.5) * t.shake * p * 2;
        state.shakeRotate += (random(`${seed}-r-${frame}`) - 0.5) * t.shake * p * 0.4;
      }

      if (!isPreview) {
        state.directionalBlur = Math.max(state.directionalBlur, t.blur * p * (t.type === "whip" || t.type === "glitchCut" ? 1 : 0.5));
        const velocitySample = impulseProgress(frame + 1, t) - impulseProgress(frame - 1, t);
        state.speedRampBlur = Math.max(state.speedRampBlur, Math.abs(velocitySample) * 40 * mag);
        state.lensDistortion = Math.max(state.lensDistortion, p * w.lensDistortion * mag);
      }

      state.chromaticAberration = Math.max(state.chromaticAberration, p * 10 * w.chromatic * mag);
      state.glow = isPreview ? 0 : Math.max(state.glow, p * w.glow * mag);
      state.filmGrain = isPreview ? 0 : Math.max(state.filmGrain, 0.15 + p * 0.35 * w.grain);
      state.noiseFlash = Math.max(state.noiseFlash, p * t.flash * w.grain);
      state.vignette = Math.max(state.vignette, p * w.vignette);
      state.lightLeak = Math.max(state.lightLeak, p * w.lightLeak * mag);
      state.flashFrame = Math.max(state.flashFrame, t.type === "flash" ? p * t.flash : p * t.flash * 0.3);
    }

    state.scale = scaleAccum;
    state.brightness = Math.max(0, state.brightness);
    state.contrast = Math.max(0, state.contrast);
    state.saturate = Math.max(0, state.saturate);
    state.opacity = Math.min(1, Math.max(0, state.opacity));

    return state;
  }, [frame, resolved, quality]);
}

// ============================================================================
// SECTION 6 — VISUAL SUB-LAYERS
// ============================================================================

const ChromaticLayer: React.FC<{ children: React.ReactNode; offset: number }> = ({ children, offset }) => {
  if (offset < 0.15) return <>{children}</>;
  const channel = (color: string, tx: number): React.CSSProperties => ({
    position: "absolute", inset: 0, transform: `translateX(${tx}px)`,
  });
  const mask = (color: string): React.CSSProperties => ({
    position: "absolute", inset: 0, backgroundColor: color, mixBlendMode: "multiply",
  });
  return (
    <AbsoluteFill style={{ isolation: "isolate" }}>
      <AbsoluteFill style={{ mixBlendMode: "screen" }}>
        <div style={channel("red", -offset)}>
          {children}
          <div style={mask("rgb(255,0,0)")} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: "screen" }}>
        <div style={channel("blue", offset)}>
          {children}
          <div style={mask("rgb(0,0,255)")} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: "screen" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {children}
          <div style={mask("rgb(0,255,0)")} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const GRAIN_POOL_SIZE = 12;

function buildGrainPool(): string[] {
  return Array.from({ length: GRAIN_POOL_SIZE }, (_, i) => {
    const freq = 0.55 + random(`grain-pool-freq-${i}`) * 0.35;
    const seed = Math.floor(random(`grain-pool-seed-${i}`) * 1000);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' seed='${seed}'/><feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.85 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  });
}

const GRAIN_POOL = buildGrainPool();

const FilmGrainLayer: React.FC<{ strength: number }> = ({ strength }) => {
  const frame = useCurrentFrame();
  if (strength <= 0.01) return null;
  const dataUri = GRAIN_POOL[frame % GRAIN_POOL_SIZE];
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("${dataUri}")`,
        backgroundSize: "cover",
        opacity: strength,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

const VignetteLayer: React.FC<{ strength: number }> = ({ strength }) => {
  if (strength <= 0.01) return null;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, rgba(0,0,0,0) ${40 - strength * 20}%, rgba(0,0,0,${strength * 0.85}) 100%)`,
        pointerEvents: "none",
      }}
    />
  );
};

const LightLeakLayer: React.FC<{ strength: number; frame: number }> = ({ strength, frame }) => {
  if (strength <= 0.01) return null;
  
  // 👈 ማስተካከያ፦ በሉፕ ውስጥ የነበረውን interpolate እዚህ ጋር ብቻ እንዲሰራ በማድረግ ከውጭ አምጥተነዋል
  const sweep = interpolate(frame % 90, [0, 90], [-30, 130]);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(120deg, rgba(255,180,90,0) ${sweep - 25}%, rgba(255,190,120,${strength * 0.55}) ${sweep}%, rgba(255,140,80,0) ${sweep + 25}%)`,
        mixBlendMode: "screen",
        opacity: strength,
        pointerEvents: "none",
      }}
    />
  );
};

const FlashFrameLayer: React.FC<{ strength: number }> = ({ strength }) => {
  if (strength <= 0.02) return null;
  return <AbsoluteFill style={{ backgroundColor: "#fff", opacity: strength, pointerEvents: "none" }} />;
};

const GlowLayer: React.FC<{ children: React.ReactNode; strength: number }> = ({ children, strength }) => {
  if (strength <= 0.02) return <>{children}</>;
  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill
        style={{
          filter: `blur(${14 * strength}px) brightness(${1 + strength})`,
          opacity: strength * 0.45,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// SECTION 7 — MAIN COMPONENT
// ============================================================================

export interface TransitionProps {
  children: React.ReactNode;
  transitions?: TransitionConfig[];
  quality?: Quality;
}

export const Transition: React.FC<TransitionProps> = ({ children, transitions = [], quality = "final" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const s = useTransitionEngine(transitions, quality);

  const transformStyle = useMemo(() => {
    const tx = s.translateX + s.shakeX;
    const ty = s.translateY + s.shakeY;
    const rz = s.rotateZ + s.shakeRotate;
    return [
      `perspective(${s.perspective}px)`,
      `translate3d(${tx}px, ${ty}px, ${s.cameraZ}px)`,
      `rotateX(${s.rotateX}deg)`,
      `rotateY(${s.rotateY}deg)`,
      `rotateZ(${rz}deg)`,
      `scale(${s.scale})`,
    ].join(" ");
  }, [s.translateX, s.translateY, s.shakeX, s.shakeY, s.rotateX, s.rotateY, s.rotateZ, s.shakeRotate, s.perspective, s.cameraZ, s.scale]);

  const filterStyle = useMemo(() => {
    const parts = [
      `brightness(${s.brightness})`,
      `contrast(${s.contrast})`,
      `saturate(${s.saturate})`,
    ];
    const combinedBlur = s.directionalBlur + s.lensDistortion * 3;
    if (combinedBlur > 0.5) parts.push(`blur(${combinedBlur}px)`);
    return parts.join(" ");
  }, [s.brightness, s.contrast, s.saturate, s.directionalBlur, s.lensDistortion]);

  const content = (
    <AbsoluteFill
      style={{
        transform: transformStyle,
        filter: filterStyle,
        opacity: s.opacity,
        transformStyle: "preserve-3d",
        willChange: "transform, filter",
      }}
    >
      <GlowLayer strength={s.glow}>
        <ChromaticLayer offset={s.chromaticAberration}>{children}</ChromaticLayer>
      </GlowLayer>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ width, height, overflow: "hidden", backgroundColor: "#000" }}>
      {content}

      {quality === "final" && s.speedRampBlur > 1 && (
        <AbsoluteFill style={{ filter: `blur(${s.speedRampBlur}px)`, opacity: 0.35, pointerEvents: "none" }}>
          {children}
        </AbsoluteFill>
      )}

      <FilmGrainLayer strength={s.filmGrain} />
      {s.noiseFlash > 0.05 && (
        <AbsoluteFill style={{ opacity: s.noiseFlash, mixBlendMode: "overlay", pointerEvents: "none" }}>
          <FilmGrainLayer strength={1} />
        </AbsoluteFill>
      )}
      <VignetteLayer strength={s.vignette} />
      <LightLeakLayer strength={s.lightLeak} frame={frame} />
      <FlashFrameLayer strength={s.flashFrame} />
    </AbsoluteFill>
  );
};

import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { Float, useTexture } from "@react-three/drei";
import { useCurrentFrame, useVideoConfig } from "remotion";

// ============================================================
// Helpers
// ============================================================

function createRoundedRectShape(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();

  const w = width / 2;
  const h = height / 2;
  const r = Math.min(radius, w, h);

  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);

  return shape;
}

function remapUV(geometry: THREE.BufferGeometry, width: number, height: number) {
  const pos = geometry.attributes.position;
  const uv = new Float32Array(pos.count * 2);

  const halfW = width / 2;
  const halfH = height / 2;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);

    uv[i * 2] = (x + halfW) / width;
    uv[i * 2 + 1] = (y + halfH) / height;
  }

  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));

  return geometry;
}

function roundRect(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

// ============================================================
// Dimensions
// ============================================================

const BASE_WIDTH = 3.1;
const BASE_DEPTH = 2.05;
const BASE_THICKNESS = 0.06;

const LID_WIDTH = 3.1;
const LID_HEIGHT = 2.05;
const LID_THICKNESS = 0.05;

const HINGE_Z = -BASE_DEPTH / 2;

const CORNER_RADIUS = 0.07;

const SCREEN_WIDTH = 3.0;
const SCREEN_HEIGHT = 1.95;

// ============================================================
// Screen content type
// ============================================================

export type ScreenContent =
  | { type: "image"; src: string }
  | { type: "video"; src: string; muted?: boolean; loop?: boolean; startFrame?: number };

// ------------------------------------------------------------
// image ⇒ ScreenImage (mesh + texture)
// ------------------------------------------------------------

const ScreenImage: React.FC<{ src: string }> = ({ src }) => {
  const texture = useTexture(src);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  const geometry = useMemo(() => {
    const shape = createRoundedRectShape(SCREEN_WIDTH, SCREEN_HEIGHT, CORNER_RADIUS);
    const geo = new THREE.ShapeGeometry(shape);
    remapUV(geo, SCREEN_WIDTH, SCREEN_HEIGHT);
    return geo;
  }, []);

  return (
    <mesh position={[0, 0, LID_THICKNESS / 2 + 0.002]} geometry={geometry}>
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

// ------------------------------------------------------------
// video ⇒ ScreenVideo (Remotion Synced Frame-by-Frame)
// ------------------------------------------------------------
// ✅ ችግሩን ለመፍታት useVideoTextureን ትተን የራሳችንን sync logic እንጠቀማለን።

const ScreenVideo: React.FC<{
  src: string;
  muted?: boolean;
  loop?: boolean;
  startFrame?: number;
}> = ({ src, muted = true, loop = true, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  // 1. የቪዲዮ ኤለመንቱን እና ቴክስቸሩን አንዴ መፍጠር (Setup)
  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    video.muted = muted;
    video.loop = loop;
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    // autoplay ን አናበራም፣ እኛ በፈርም እንቆጣጠራለን።
    video.autoplay = false;
     
    // ለ iOS ዌብኪት አስፈላጊ ነው
    video.setAttribute("playsinline", "true");
    
    videoRef.current = video;

    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    setTexture(tex);

    // ✅ Cleanup function: Brollሉ ሲያልቅ ቪዲዮውን ለማቆም (ሁለተኛውን ችግር ይፈታል)
    return () => {
      video.pause();
      video.src = "";
      video.load();
      tex.dispose();
    };
  }, [src, muted, loop]);

  // 2. በየፍሬሙ ቪዲዮውን ከ Remotion frame ጋር ማመሳሰል (Sync)
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // አሁን ካለው የ composition ሬም ላይ የ Brollሉን መጀመሪያ ፍሬም በመቀነስ
    // በቪዲዮው ውስጥ ያለውን አንጻራዊ ሰከንድ እናሰላለን።
    const relativeFrame = Math.max(0, frame - startFrame);
    const seekTime = relativeFrame / fps;

    // ቪዲዮው መጫወት ያለበት ከሆነ (autoplay/loop logic እዚህ መግባት ይችላል)
    // ለ Remotion ግን "seek" ማድረግ የተሻለ ነው።
    
    // የቪዲዮው ርዝመት ካለቀ እና ሉፕ ካልሆነ ይቆማል።
    if (video.readyState >= 2) { // HAVE_CURRENT_DATA
        if (!loop && seekTime >= video.duration) {
            video.currentTime = video.duration;
        } else {
            // loop ከሆነ seekTime በ duration modulo ይደረጋል።
            const finalSeekTime = loop ? seekTime % video.duration : seekTime;
            video.currentTime = finalSeekTime;
        }
    }

  }, [frame, fps, startFrame, loop]);

  const geometry = useMemo(() => {
    const shape = createRoundedRectShape(SCREEN_WIDTH, SCREEN_HEIGHT, CORNER_RADIUS);
    const geo = new THREE.ShapeGeometry(shape);
    remapUV(geo, SCREEN_WIDTH, SCREEN_HEIGHT);
    return geo;
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, LID_THICKNESS / 2 + 0.002]} geometry={geometry}>
      <meshBasicMaterial map={texture} toneMapped={false} transparent/>
    </mesh>
  );
};

// ------------------------------------------------------------
// Router: picks image / video
// ------------------------------------------------------------

const ScreenTexture: React.FC<{ screenContent: ScreenContent }> = ({ screenContent }) => {
  switch (screenContent.type) {
    case "image":
      return <ScreenImage src={screenContent.src} />;
    case "video":
      return (
        <ScreenVideo
          src={screenContent.src}
          muted={screenContent.muted}
          loop={screenContent.loop}
          // እዚህ ጋርautoplay የሚለውን prop አስወግደነዋል፣ በፈርም ስለምንመራ።
          startFrame={screenContent.startFrame}
        />
      );
    default:
      return null;
  }
};

// ============================================================
// Camera notch
// ============================================================

const CameraNotch = () => {
  const notchWidth = 0.24;
  const notchHeight = 0.065;

  const geometry = useMemo(() => {
    const shape = createRoundedRectShape(notchWidth, notchHeight, CORNER_RADIUS);
    return new THREE.ShapeGeometry(shape);
  }, []);

  return (
    <mesh position={[0, 0.972, LID_THICKNESS / 2 + 0.004]} geometry={geometry}>
      <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

// ============================================================
// Apple logo
// ============================================================

let faBrandsFontPromise: Promise<FontFace> | null = null;

function loadFontAwesomeBrands() {
  if (!faBrandsFontPromise) {
    const font = new FontFace(
      "FA6BrandsCustom",
      "url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts/fa-brands-400.ttf)"
    );

    faBrandsFontPromise = font.load().then((loaded) => {
      document.fonts.add(loaded);
      return loaded;
    });
  }

  return faBrandsFontPromise;
}

const AppleLogo = () => {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadFontAwesomeBrands()
      .then(() => {
        if (cancelled) return;

        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, 256, 256);
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.font = "150px FA6BrandsCustom";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("\uf179", 128, 138);

        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;

        setTexture(tex);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, -LID_THICKNESS / 2 - 0.002]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[0.42, 0.42]} />
      <meshStandardMaterial
        map={texture}
        transparent
        alphaTest={0.3}
        roughness={0.5}
        metalness={0.2}
      />
    </mesh>
  );
};

// ============================================================
// LID
// ============================================================

interface LidGroupProps {
  screenContent: ScreenContent;
  openAngle: number;
}

const LidGroup: React.FC<LidGroupProps> = ({ screenContent, openAngle }) => {
  const lidGeometry = useMemo(() => {
    const shape = createRoundedRectShape(LID_WIDTH, LID_HEIGHT, CORNER_RADIUS);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: LID_THICKNESS,
      bevelEnabled: false,
    });

    remapUV(geo, LID_WIDTH, LID_HEIGHT);

    return geo;
  }, []);

  const bezelWidth = LID_WIDTH - 0.02;
  const bezelHeight = LID_HEIGHT - 0.02;

  const bezelGeometry = useMemo(() => {
    const shape = createRoundedRectShape(bezelWidth, bezelHeight, CORNER_RADIUS);
    const geo = new THREE.ShapeGeometry(shape);
    remapUV(geo, bezelWidth, bezelHeight);
    return geo;
  }, []);

  return (
    <group position={[0, BASE_THICKNESS, HINGE_Z]} rotation={[Math.PI / 2 - openAngle, 0, 0]}>
      <group position={[0, LID_HEIGHT / 2, 0]}>
        {/* Lid body */}
        <mesh geometry={lidGeometry} position={[0, 0, -LID_THICKNESS / 2]}>
          <meshStandardMaterial color="#c9cdd3" metalness={0.75} roughness={0.28} />
        </mesh>

        {/* Black bezel */}
        <mesh position={[0, 0, LID_THICKNESS / 2 + 0.001]} geometry={bezelGeometry}>
          <meshStandardMaterial color="#08090b" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Screen: image / video */}
        <React.Suspense fallback={null}>
          <ScreenTexture screenContent={screenContent} />
        </React.Suspense>

        {/* Camera */}
        <CameraNotch />

        {/* Apple logo on back */}
        <AppleLogo />
      </group>
    </group>
  );
};

// ============================================================
// Keyboard Deck
// ============================================================

const DeckTexture = () => {
  const deckGeometry = useMemo(() => {
    const shape = createRoundedRectShape(BASE_WIDTH - 0.016, BASE_DEPTH - 0.016, 0.092);
    const geo = new THREE.ShapeGeometry(shape);
    remapUV(geo, BASE_WIDTH, BASE_DEPTH);
    return geo;
  }, []);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 700;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Body
    ctx.fillStyle = "#c9cdd3";
    ctx.fillRect(0, 0, 1024, 700);

    // Keyboard
    const kbX = 80;
    const kbY = 34;
    const kbW = 864;
    const kbH = 336;
    const kbR = 18;

    ctx.fillStyle = "#33363b";
    roundRect(ctx, kbX, kbY, kbW, kbH, kbR);
    ctx.fill();

    const padX = 16;
    const padY = 14;
    const gapX = 5;
    const gapY = 6;

    const innerW = kbW - padX * 2;
    const innerH = kbH - padY * 2;

    type Row = {
      keys: string[];
      weights: number[];
      rowWeight: number;
      fontScale?: number;
    };

    const rows: Row[] = [
      {
        keys: ["esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "⏻"],
        weights: Array(14).fill(1),
        rowWeight: 0.72,
        fontScale: 0.34,
      },
      {
        keys: ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"],
        weights: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.9],
        rowWeight: 1,
      },
      {
        keys: ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
        weights: [1.5, ...Array(12).fill(1), 1.3],
        rowWeight: 1,
      },
      {
        keys: ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "return"],
        weights: [1.8, ...Array(11).fill(1), 2.2],
        rowWeight: 1,
      },
      {
        keys: ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "shift"],
        weights: [2.3, ...Array(9).fill(1), 2.3],
        rowWeight: 1,
      },
      {
        keys: ["fn", "ctrl", "opt", "cmd", "", "cmd", "opt", "◀", "▲▼", "▶"],
        weights: [1, 1, 1, 1.3, 5.4, 1.3, 1, 0.9, 0.9, 0.9],
        rowWeight: 1,
      },
    ];

    const totalRowWeight = rows.reduce((a, r) => a + r.rowWeight, 0);
    const totalGapY = gapY * (rows.length - 1);
    const rowUnit = (innerH - totalGapY) / totalRowWeight;

    let rowY = kbY + padY;

    rows.forEach((row) => {
      const rowH = row.rowWeight * rowUnit;
      const totalKeyWeight = row.weights.reduce((a, b) => a + b, 0);
      const totalGapX = gapX * (row.keys.length - 1);
      const unitW = (innerW - totalGapX) / totalKeyWeight;

      let cx = kbX + padX;

      row.keys.forEach((label, i) => {
        const kw = row.weights[i] * unitW;

        ctx.fillStyle = "#1a1b1e";

        roundRect(ctx, cx, rowY, kw, rowH, 4);
        ctx.fill();

        if (label) {
          ctx.fillStyle = "#cfd1d4";
          const fs = Math.min(rowH * (row.fontScale ?? 0.42), kw * 0.32, 22);
          ctx.font = `${fs}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, cx + kw / 2, rowY + rowH / 2 + 1);
        }

        cx += kw + gapX;
      });

      rowY += rowH + gapY;
    });

    // Trackpad
    ctx.fillStyle = "#919497";
    roundRect(ctx, 1024 / 2 - 220, kbY + kbH + 60, 440, 260, 16);
    ctx.fill();

    ctx.strokeStyle = "#9a9ea4";
    ctx.lineWidth = 2;
    roundRect(ctx, 1024 / 2 - 220, kbY + kbH + 60, 440, 260, 16);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;

    return tex;
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, BASE_THICKNESS + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} geometry={deckGeometry}>
      <meshStandardMaterial map={texture} metalness={0.5} roughness={0.5} />
    </mesh>
  );
};

// ============================================================
// SIDE PORTS (USB, Charge, Audio)
// ============================================================

const Ports = () => {
  const portMaterial = <meshStandardMaterial color="#050505" roughness={0.8} metalness={0.2} />;

  return (
    <group>
      {/* --- የግራ ጎን መሰኪያዎች --- */}
      <mesh position={[-1.558, 0.026, -0.7]}>
        <boxGeometry args={[0.02, 0.012, 0.1]} />
        {portMaterial}
      </mesh>

      <mesh position={[-1.558, 0.026, -0.45]}>
        <boxGeometry args={[0.02, 0.012, 0.06]} />
        {portMaterial}
      </mesh>

      <mesh position={[-1.558, 0.026, -0.3]}>
        <boxGeometry args={[0.02, 0.012, 0.06]} />
        {portMaterial}
      </mesh>

      {/* --- የቀኝ ጎን መሰኪያዎች --- */}
      <mesh position={[1.558, 0.026, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.02, 16]} />
        {portMaterial}
      </mesh>

      <mesh position={[1.558, 0.026, -0.2]}>
        <boxGeometry args={[0.02, 0.018, 0.1]} />
        {portMaterial}
      </mesh>
    </group>
  );
};

// ============================================================
// BASE
// ============================================================

const BaseGroup = () => {
  const baseGeometry = useMemo(() => {
    const shape = createRoundedRectShape(BASE_WIDTH, BASE_DEPTH, 0.1);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: BASE_THICKNESS - 0.008,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 4,
    });

    remapUV(geo, BASE_WIDTH, BASE_DEPTH);

    return geo;
  }, []);

  return (
    <group>
      {/* Main body */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={baseGeometry}>
        <meshStandardMaterial color="#c9cdd3" metalness={0.75} roughness={0.28} />
      </mesh>

      {/* Keyboard */}
      <DeckTexture />

      {/* Side Ports */}
      <Ports />

      {/* Bottom feet */}
      {[
        [-1.35, -0.01, -0.85],
        [1.35, -0.01, -0.85],
        [-1.35, -0.01, 0.85],
        [1.35, -0.01, 0.85],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

// ============================================================
// HINGE
// ============================================================

const Hinge = () => {
  return (
    <mesh position={[0, BASE_THICKNESS, HINGE_Z]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.065, 0.065, BASE_WIDTH - 0.07, 3]} />
      <meshStandardMaterial color="#cfd1d4" metalness={0.75} roughness={0.25} />
    </mesh>
  );
};

// ============================================================
// PUBLIC COMPONENT
// ============================================================

export interface Laptop3DProps {
  screenContent: ScreenContent;
  openAngle?: number;
  rotation?: [number, number, number];
  scale?: number;
}

export const Laptop3D: React.FC<Laptop3DProps> = ({
  screenContent,
  openAngle = 1.6,
  rotation = [0, 0, 0],
  scale = 0.9,
}) => {
  return (
    <Float speed={0} rotationIntensity={0} floatIntensity={0}>
      <group scale={scale} rotation={rotation}>
        <group position={[0, 0, 0]}>
          <BaseGroup />
          <Hinge />
          <LidGroup screenContent={screenContent} openAngle={openAngle} />
        </group>
      </group>
    </Float>
  );
};

export default Laptop3D;

import React from "react";
import * as THREE from "three";
import { Float, useTexture } from "@react-three/drei";

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

// ============================================================
// Screen
// ============================================================

const ScreenTexture: React.FC<{ screenImage: string }> = ({ screenImage }) => {
  const texture = useTexture(screenImage);

  React.useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <mesh position={[0, 0, LID_THICKNESS / 2 + 0.002]}>
      <planeGeometry args={[3.0, 1.95]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

// ============================================================
// Camera notch
// ============================================================

const CameraNotch = () => {
  return (
    <mesh position={[0, 0.91, LID_THICKNESS / 2 + 0.004]}>
      <planeGeometry args={[0.14, 0.045]} />
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
  const [texture, setTexture] = React.useState<THREE.CanvasTexture | null>(null);

  React.useEffect(() => {
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
  screenImage: string;
  openAngle: number;
}

const LidGroup: React.FC<LidGroupProps> = ({ screenImage, openAngle }) => {
  const lidGeometry = React.useMemo(() => {
    const shape = createRoundedRectShape(LID_WIDTH, LID_HEIGHT, 0.10);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: LID_THICKNESS,
      bevelEnabled: false,
    });

    remapUV(geo, LID_WIDTH, LID_HEIGHT);

    return geo;
  }, []);

  return (
    <group position={[0, BASE_THICKNESS, HINGE_Z]} rotation={[openAngle - Math.PI / 2, 0, 0]}>
      <group position={[0, LID_HEIGHT / 2, 0]}>
        {/* Lid body */}
        <mesh geometry={lidGeometry} position={[0, 0, -LID_THICKNESS / 2]}>
          <meshStandardMaterial color="#c9cdd3" metalness={0.75} roughness={0.28} />
        </mesh>

        {/* Black bezel */}
        <mesh position={[0, 0, LID_THICKNESS / 2 + 0.001]}>
          <planeGeometry args={[LID_WIDTH - 0.02, LID_HEIGHT - 0.02]} />
          <meshStandardMaterial color="#08090b" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Screen */}
        <React.Suspense fallback={null}>
          <ScreenTexture screenImage={screenImage} />
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
  const deckGeometry = React.useMemo(() => {
    const shape = createRoundedRectShape(BASE_WIDTH - 0.016, BASE_DEPTH - 0.016, 0.092);
    const geo = new THREE.ShapeGeometry(shape);
    remapUV(geo, BASE_WIDTH, BASE_DEPTH);
    return geo;
  }, []);

  const texture = React.useMemo(() => {
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
  const baseGeometry = React.useMemo(() => {
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
        <meshStandardMaterial color="#c9cdd3" metalness={0.5} roughness={0.5} />
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
  screenImage: string;
  openAngle?: number;
  rotation?: [number, number, number];
  scale?: number;
}

export const Laptop3D: React.FC<Laptop3DProps> = ({
  screenImage,
  openAngle = 1,
  rotation = [0, 0, 0],
  scale = 0.9,
}) => {
  return (
    <Float speed={0} rotationIntensity={0} floatIntensity={0}>
      <group scale={scale} rotation={rotation}>
        {/* Center whole laptop */}
        <group position={[0, -0.15, 0]}>
          <BaseGroup />
          <Hinge />
          <LidGroup screenImage={screenImage} openAngle={openAngle} />
        </group>
      </group>
    </Float>
  );
};

export default Laptop3D;

import React from "react";
import * as THREE from "three";
import { Float, RoundedBox, useTexture } from "@react-three/drei";

// Rounded rectangle shape ፈጣሪ function (Dynamic Island እና Screen pill/rounded shape ለመስራት)
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

// Extrude geometry ላይ image texture በትክክል እንዲለጠፍ UV ን በ shape's ልክ ስፋት/ቁመት remap የሚያደርግ function
function remapExtrudeUV(
  geometry: THREE.ExtrudeGeometry,
  width: number,
  height: number
) {
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

// ---- Screen texture: takes the image URL as a prop so it's not tied to Remotion ----
const ScreenTexture: React.FC<{ screenImage: string }> = ({ screenImage }) => {
  const texture = useTexture(screenImage);
  const screenWidth = 2.08;
  const screenHeight = 4.34;
  const screenRadius = 0.275;
  const screenDepth = 0.006;

  const geometry = React.useMemo(() => {
    const shape = createRoundedRectShape(screenWidth, screenHeight, screenRadius);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: screenDepth,
      bevelEnabled: false,
    });
    remapExtrudeUV(geo, screenWidth, screenHeight);
    return geo;
  }, []);

  return (
    <mesh position={[0, 0, 0.14]} geometry={geometry}>
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

const ScreenBase = () => {
  const baseWidth = 2.2;
  const baseHeight = 4.45;
  const baseRadius = 0.275;
  const baseDepth = 0.02;

  const geometry = React.useMemo(() => {
    const shape = createRoundedRectShape(baseWidth, baseHeight, baseRadius);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: baseDepth,
      bevelEnabled: false,
    });
    remapExtrudeUV(geo, baseWidth, baseHeight);
    return geo;
  }, []);

  return (
    <mesh position={[0, 0, 0.1]} geometry={geometry}>
      <meshStandardMaterial color="#000000" metalness={0.2} roughness={0.05} />
    </mesh>
  );
};

const ScreenBase2 = () => {
  const baseWidth = 2.2;
  const baseHeight = 4.45;
  const baseRadius = 0.275;
  const baseDepth = 0.02;

  const geometry = React.useMemo(() => {
    const shape = createRoundedRectShape(baseWidth, baseHeight, baseRadius);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: baseDepth,
      bevelEnabled: false,
    });
    remapExtrudeUV(geo, baseWidth, baseHeight);
    return geo;
  }, []);

  return (
    <mesh position={[0, 0, -0.146]} geometry={geometry}>
      <meshStandardMaterial color="#2f3a52" metalness={0.6} roughness={0.5} />
    </mesh>
  );
};

const ScreenBase3 = () => {
  const baseWidth = 2;
  const baseHeight = 2.9;
  const baseRadius = 0.3;
  const baseDepth = 0.02;

  const geometry = React.useMemo(() => {
    const shape = createRoundedRectShape(baseWidth, baseHeight, baseRadius);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: baseDepth,
      bevelEnabled: false,
    });
    remapExtrudeUV(geo, baseWidth, baseHeight);
    return geo;
  }, []);

  return (
    <mesh position={[0, -0.67, -0.147]} geometry={geometry}>
      <meshStandardMaterial color="#252f45" metalness={0} roughness={1} />
    </mesh>
  );
};

const ScreenBase4 = () => {
  const baseWidth = 2.1;
  const baseHeight = 1.2;
  const baseRadius = 0.3;
  const baseDepth = 0.12;

  const geometry = React.useMemo(() => {
    const shape = createRoundedRectShape(baseWidth, baseHeight, baseRadius);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: baseDepth,
      bevelEnabled: false,
    });
    remapExtrudeUV(geo, baseWidth, baseHeight);
    return geo;
  }, []);

  return (
    <mesh position={[0, 1.5, -0.2]} geometry={geometry}>
      <meshStandardMaterial color="#2f3a52" metalness={0.2} roughness={0.5} />
    </mesh>
  );
};

const ScreenBase5 = () => {
  const baseWidth = 2;
  const baseHeight = 1.15;
  const baseRadius = 0.3;
  const baseDepth = 0.12;

  const geometry = React.useMemo(() => {
    const shape = createRoundedRectShape(baseWidth, baseHeight, baseRadius);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: baseDepth,
      bevelEnabled: false,
    });
    remapExtrudeUV(geo, baseWidth, baseHeight);
    return geo;
  }, []);

  return (
    <mesh position={[0, 1.5, -0.21]} geometry={geometry}>
      <meshStandardMaterial color="#2f3a52" metalness={0.5} roughness={0.5} />
    </mesh>
  );
};

const DynamicIsland = () => {
  const shape = React.useMemo(
    () => createRoundedRectShape(0.55, 0.16, 0.08),
    []
  );

  const extrudeSettings = React.useMemo(
    () => ({
      depth: 0.03,
      bevelEnabled: false,
    }),
    []
  );

  return (
    <mesh position={[0, 1.98, 0.13]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color="#000000" metalness={0.1} roughness={0.01} />
    </mesh>
  );
};

// ---- Charging port (USB-C style slot) - flat/inset decal on the bottom edge, no longer protruding ----
const ChargingPort = () => {
  const shape = React.useMemo(
    () => createRoundedRectShape(0.34, 0.12, 0.05),
    []
  );

  const extrudeSettings = React.useMemo(
    () => ({
      depth: 0.006, // very thin so it stays flat / doesn't poke out of the frame
      bevelEnabled: false,
    }),
    []
  );

  return (
    <mesh
      position={[0, -2.248, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color="#050505" metalness={0.5} roughness={0.4} />
    </mesh>
  );
};

// ---- Status bar overlay (signal bars + battery %) drawn on a canvas and placed on top of the screen ----
const StatusBarOverlay = () => {
  const texture = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 900, 100);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";

    // Signal bars (left side)
    const barBaseX = 30;
    const barBaseY = 68;
    const barWidths = 10;
    const barGap = 6;
    const barHeights = [18, 28, 38, 48];
    barHeights.forEach((h, i) => {
      ctx.fillRect(barBaseX + i * (barWidths + barGap), barBaseY - h, barWidths, h);
    });

    // Wi-Fi icon (next to signal bars)
    const wifiX = 160;
    const wifiY = 55;
    ctx.lineWidth = 6;
    for (let r = 14; r <= 34; r += 10) {
      ctx.beginPath();
      ctx.arc(wifiX, wifiY, r, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(wifiX, wifiY + 4, 5, 0, Math.PI * 2);
    ctx.fill();

    // Battery percentage text
    ctx.font = "600 34px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText("82%", 790, 50);

    // Battery icon (body + nub)
    const battX = 810;
    const battY = 30;
    const battW = 60;
    const battH = 40;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(battX, battY, battW, battH);
    ctx.fillRect(battX + battW + 4, battY + 11, 6, 18); // nub
    const chargeLevel = 0.82;
    ctx.fillRect(
      battX + 4,
      battY + 4,
      (battW - 8) * chargeLevel,
      battH - 8
    );

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, 1.78, 0.141]}>
      <planeGeometry args={[1.95, 0.22]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
};

// ---- Apple logo: loads the real Font Awesome Brands "apple" glyph (\uf179) and draws it to a canvas texture ----
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
        ctx.fillStyle = "rgba(0,0,0,0.32)";
        ctx.font = "190px FA6BrandsCustom";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Font Awesome 6 Brands "apple" glyph
        ctx.fillText("\uf179", 128, 140);

        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        setTexture(tex);
      })
      .catch(() => {
        // Silently skip the logo if the font fails to load (e.g. no network)
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, -0.3, -0.148]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[0.7, 0.7]} />
      <meshStandardMaterial
        map={texture}
        transparent
        alphaTest={0.3}
        roughness={0.6}
        metalness={0.1}
        color="#ffffff"
      />
    </mesh>
  );
};

export interface IPhone3DProps {
  /** Screen ላይ የሚታየው image/texture URL (Remotion staticFile ወይም ማንኛውም URL) */
  screenImage: string;
  /** [rotationX, rotationY, rotationZ] በ radians */
  rotation?: [number, number, number];
  /** የ phone ጠቅላላ scale */
  scale?: number;
}

// ---- Reusable, self-contained iPhone 3D model. No Remotion dependency. ----
export const IPhone3D: React.FC<IPhone3DProps> = ({
  screenImage,
  rotation = [0, 0, 0],
  scale = 0.9,
}) => {
  return (
    <Float speed={0} rotationIntensity={0} floatIntensity={0}>
      <group scale={scale} rotation={rotation} position={[0, 0, 0]}>
        {/* Phone body (frame) */}
        <RoundedBox args={[2.27, 4.5, 0.29]} radius={0.27} smoothness={6}>
          <meshStandardMaterial color="#2f3a52" metalness={0.6} roughness={0.5} />
        </RoundedBox>

        {/* Screen base - bezel, 2D rounded-rectangle extrude shape */}
        <ScreenBase />
        <ScreenBase2 />
        <ScreenBase3 />     
        <ScreenBase4 />       
        <ScreenBase5 />          

        <React.Suspense fallback={null}>
          <ScreenTexture screenImage={screenImage} />
        </React.Suspense>

        {/* Status bar overlay - signal bars + wifi + battery % on top of the screen */}
        <StatusBarOverlay />

        {/* Dynamic Island */}
        <DynamicIsland />

        {/* Charging port (bottom edge) */}
        <ChargingPort />

        {/* Camera lenses */}
        {[
          [-0.73, 1.80],
          [-0.73, 1.23],
          [-0.20, 1.55],
        ].map(([x, y], i) => (
          <group key={i} position={[x, y, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh position={[0, -0.015, 0]}>
              <cylinderGeometry args={[0.27, 0.25, 0.18, 32]} />
              <meshStandardMaterial color="#2f3a52" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.40, 0.16, 0.30, 32]} />
              <meshStandardMaterial color="#111111" metalness={0.7} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.01, 32]} />
              <meshStandardMaterial
                color="#2a4a6a"
                metalness={0.9}
                roughness={0.05}
                emissive="#1a3a5c"
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        ))}

        {/* Flash */}
        <mesh position={[0.7, 1.85, -0.175]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.055, 0.11, 32]} />
          <meshStandardMaterial color="#f5ede0" metalness={0.2} roughness={0.5} />
        </mesh>
        <mesh position={[0.7, 1.85, -0.175]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.035, 0.1, 32]} />
          <meshStandardMaterial color="#a7a3a3" metalness={0.3} roughness={0.4} />
        </mesh>        

        {/* Sensor dot */}
        <mesh position={[0.7, 1.25, -0.175]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.055, 0.16, 32]} />
          <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.4} />
        </mesh>

        {/* Apple logo - Font Awesome brand glyph */}
        <AppleLogo />

        {/* Power button */}
        <RoundedBox args={[0.13, 0.5, 0.11]} radius={0.04} smoothness={4} position={[1.1, 0.6, 0]}>
          <meshStandardMaterial color="#2f3a52" metalness={0.2} roughness={1} />
        </RoundedBox>

        {/* Volume buttons */}
        <RoundedBox args={[0.13, 0.35, 0.11]} radius={0.04} smoothness={4} position={[-1.1, 0.9, 0]}>
          <meshStandardMaterial color="#2f3a52" metalness={0.2} roughness={1} />
        </RoundedBox>
        <RoundedBox args={[0.13, 0.35, 0.11]} radius={0.04} smoothness={4} position={[-1.1, 0.45, 0]}>
          <meshStandardMaterial color="#2f3a52" metalness={0.2} roughness={1} />
        </RoundedBox>

        {/* Mute switch */}
        <RoundedBox args={[0.13, 0.2, 0.11]} radius={0.03} smoothness={4} position={[-1.1, 1.5, 0]}>
          <meshStandardMaterial color="#2f3a52" metalness={0.2} roughness={1} />
        </RoundedBox>
      </group>
    </Float>
  );
};

export default IPhone3D;
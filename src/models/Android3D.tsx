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

// ---- Screen texture ----
const ScreenTexture: React.FC<{ screenImage: string }> = ({ screenImage }) => {
  const texture = useTexture(screenImage);

  React.useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  const screenWidth = 2.13;
  const screenHeight = 4.59;
  const screenRadius = 0.2;
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
    <mesh position={[0, 0, 0.12]} geometry={geometry}>
      {/* 👇 እዚህ ጋር ነው የተስተካከለው! 
          emissive እና emissiveIntensity በመጠቀም ስክሪኑ እውነተኛ የጀርባ ብርሃን (Backlight) እንዲኖረው ተደርጓል */}
      <meshStandardMaterial 
        map={texture} 
        emissiveMap={texture}
        emissive="#ffffff"
        emissiveIntensity={0.5} // የብርሃኑን መጠን ይጨምራል
        roughness={0.15} // ስክሪኑ እንደ መስተዋት እንዲያንፀባርቅ ያደርጋል
        metalness={0.5}
        toneMapped={false} 
      />
    </mesh>
  );
};


const ScreenBase = () => {
  const baseWidth = 2.2;
  const baseHeight = 4.68;
  const baseRadius = 0.2;
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
  const baseWidth = 2.27;
  const baseHeight = 4.7;
  const baseRadius = 0.2;
  const baseDepth = 0.23;

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
    <mesh position={[0, 0, -0.14]} geometry={geometry}>
      <meshStandardMaterial color="#59595c" metalness={0.7} roughness={2} />
    </mesh>
  );
};

const ScreenBase3 = () => {
  const baseWidth = 0.7;
  const baseHeight = 1.8;
  const baseRadius = 0.4;
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
    <mesh position={[0.7, 1.35, -0.20]} geometry={geometry}>
      <meshStandardMaterial color="#63636c" metalness={0.5} roughness={1} />
    </mesh>
  );
};

const ScreenBase4 = () => {
  const baseWidth = 0.65;
  const baseHeight = 1.7;
  const baseRadius = 0.4;
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
    <mesh position={[0.7, 1.35, -0.21]} geometry={geometry}>
      <meshStandardMaterial color="#59595c" metalness={0.65} roughness={1} />
    </mesh>
  );
};

const DynamicIsland = () => {
  const shape = React.useMemo(
    () => createRoundedRectShape(0.12, 0.12, 0.06),
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
    <mesh position={[0, 2.16, 0.10]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color="#000000" metalness={0.1} roughness={0.01} />
    </mesh>
  );
};

// 2D Charging Port
const ChargingPort = () => {
  const shape = React.useMemo(
    () => createRoundedRectShape(0.34, 0.12, 0.05),
    []
  );

  const extrudeSettings = React.useMemo(
    () => ({
      depth: 0.006, 
      bevelEnabled: false,
    }),
    []
  );

  return (
    <mesh
      position={[0, -2.35, 0]} 
      rotation={[Math.PI / 2, 0, 0]}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color="#050505" metalness={0.5} roughness={0.4} />
    </mesh>
  );
};

// ---- Home Indicator (የታችኛው መስመር ብቻ) ----
const HomeIndicator = () => {
  const shape = React.useMemo(
    () => createRoundedRectShape(0.8, 0.02, 0.01),
    []
  );

  const extrudeSettings = React.useMemo(
    () => ({
      depth: 0.005,
      bevelEnabled: false,
    }),
    []
  );

  return (
    <mesh position={[0, -2.18, 0.126]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshBasicMaterial color="#ffffff" opacity={0.7} transparent={true} />
    </mesh>
  );
};

// ---- Android Status Bar Overlay (Time, Network, WiFi, Battery) ----
let faSolidFontPromise: Promise<FontFace> | null = null;
function loadFontAwesomeSolid() {
  if (!faSolidFontPromise) {
    const font = new FontFace(
      "FA6SolidCustom",
      "url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts/fa-solid-900.ttf)"
    );
    faSolidFontPromise = font.load().then((loaded) => {
      document.fonts.add(loaded);
      return loaded;
    });
  }
  return faSolidFontPromise;
}

const StatusBarOverlay = () => {
  const [texture, setTexture] = React.useState<THREE.CanvasTexture | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    loadFontAwesomeSolid()
      .then(() => {
        if (cancelled) return;

        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, 1024, 128);
        ctx.fillStyle = "#ffffff";
        ctx.textBaseline = "middle";
        
        // ---- የግራ በኩል (ሰዓት) ----
        ctx.font = "bold 34px Arial";
        ctx.textAlign = "left";
        ctx.fillText("15:56", 60, 64);

        // ---- የቀኝ በኩል (WiFi, Signal, Battery) ----
        ctx.font = "32px FA6SolidCustom";
        ctx.textAlign = "right";
        ctx.fillText("\uf1eb  \uf012  \uf240", 964, 64); 

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
    <mesh position={[0, 2.13, 0.13]}>
      <planeGeometry args={[2.08, 0.26]} />
      {/* የ Status Bar አዶዎችም ብርሃን እንዲኖራቸው ተስተካክሏል */}
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={1.5} transparent={true} opacity={2} depthWrite={false} toneMapped={false} />
    </mesh>
  );
};

export interface Android3DProps {
  /** Screen ላይ የሚታየው image/texture URL (Remotion staticFile ወይም ማንኛውም URL) */
  screenImage: string;
  /** [rotationX, rotationY, rotationZ] በ radians */
  rotation?: [number, number, number];
  /** የ phone ጠቅላላ scale */
  scale?: number;
}

// ---- Reusable, self-contained Android 3D model. ----
export const Android3D: React.FC<Android3DProps> = ({
  screenImage,
  rotation = [0, 0, 0],
  scale = 0.9,
}) => {
  return (
    <Float speed={0} rotationIntensity={0} floatIntensity={0}>
      <group scale={scale} rotation={rotation} position={[0, 2.35, 0]}>
        {/* Phone body (frame) */}
        <RoundedBox args={[2.25, 4.7, 0.25]} radius={0.2} smoothness={6}>
          <meshStandardMaterial color="#59595c" metalness={0.7} roughness={2} />
        </RoundedBox>

        {/* Screen base - bezel, 2D rounded-rectangle extrude shape */}
        <ScreenBase />
        <ScreenBase2 />
        <ScreenBase3 />        
        <ScreenBase4 />           

        <React.Suspense fallback={null}>
          <ScreenTexture screenImage={screenImage} />
        </React.Suspense>

        <StatusBarOverlay />
        <HomeIndicator />

        {/* Dynamic Island (Front Camera) */}
        <DynamicIsland />
        
        {/* Charging Port */}
        <ChargingPort />

        {/* Camera lenses */}
        {[
          [0.70, 1.90],
          [0.70, 1.33],
          [0.70, 0.8],
        ].map(([x, y], i) => (
          <group key={i} position={[x, y, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh position={[0, -0.015, 0]}>
              <cylinderGeometry args={[0.27, 0.25, 0.18, 32]} />
              <meshStandardMaterial color="#59595c" metalness={0.65} roughness={0.4} />
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
        <mesh position={[0.15, 1.62, -0.175]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 32]} />
          <meshStandardMaterial color="#d2d2d2" metalness={0.2} roughness={0.5} />
        </mesh>

        {/* Sensor dot */}
        <mesh position={[0.15, 1.35, -0.175]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.07, 32]} />
          <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.4} />
        </mesh>
        
        {/* Sensor dot */}
        <mesh position={[0.15, 1.9, -0.175]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.07, 32]} />
          <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.4} />
        </mesh>        

        {/* buttons */}
        <RoundedBox args={[0.1, 0.6, 0.11]} radius={0.04} smoothness={4} position={[1.1, 1.1, 0]}>
          <meshStandardMaterial color="#59595c" metalness={0.6} roughness={1} />
        </RoundedBox>
        <RoundedBox args={[0.1, 0.35, 0.11]} radius={0.04} smoothness={4} position={[1.1, 0.4, 0]}>
          <meshStandardMaterial color="#59595c" metalness={0.6} roughness={1} />
        </RoundedBox>
      </group>
    </Float>
  );
};

export default Android3D;

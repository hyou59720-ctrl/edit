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
  const screenHeight = 4.54;
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
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

const ScreenBase = () => {
  const baseWidth = 2.13;
  const baseHeight = 4.61;
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
  const baseWidth = 2.2;
  const baseHeight = 4.65;
  const baseRadius = 0.2;
  const baseDepth = 0.1;

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
    <mesh position={[-0.7, 1.35, -0.20]} geometry={geometry}>
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
    <mesh position={[-0.7, 1.35, -0.21]} geometry={geometry}>
      <meshStandardMaterial color="#59595c" metalness={0.65} roughness={1} />
    </mesh>
  );
};
const DynamicIsland = () => {
  const shape = React.useMemo(
    () => createRoundedRectShape(0.12, 0.12, 0.08),
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
    <mesh position={[0, 2.1, 0.10]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color="#000000" metalness={0.1} roughness={0.01} />
    </mesh>
  );
};

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
    <mesh position={[0, 0.2, -0.148]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[0.55, 0.55]} />
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

export interface Android3DProps {
  /** Screen ላይ የሚታየው image/texture URL (Remotion staticFile ወይም ማንኛውም URL) */
  screenImage: string;
  /** [rotationX, rotationY, rotationZ] በ radians */
  rotation?: [number, number, number];
  /** የ phone ጠቅላላ scale */
  scale?: number;
}

// ---- Reusable, self-contained iPhone 3D model. No Remotion dependency. ----
export const Android3D: React.FC<Android3DProps> = ({
  screenImage,
  rotation = [0, 0, 0],
  scale = 0.9,
}) => {
  return (
    <Float speed={0} rotationIntensity={0} floatIntensity={0}>
      <group scale={scale} rotation={rotation} position={[0, 0, 0]}>
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

        {/* Dynamic Island */}
        <DynamicIsland />


        {/* Camera lenses */}
        {[
          [-0.70, 1.90],
          [-0.70, 1.33],
          [-0.70, 0.8],
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
        <mesh position={[-0.15, 1.62, -0.175]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 32]} />
          <meshStandardMaterial color="#d2d2d2" metalness={0.2} roughness={0.5} />
        </mesh>

        {/* Sensor dot */}
        <mesh position={[-0.15, 1.35, -0.175]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.07, 32]} />
          <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.4} />
        </mesh>
        
        {/* Sensor dot */}
        <mesh position={[-0.15, 1.9, -0.175]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.07, 32]} />
          <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.4} />
        </mesh>        

        {/* buttons */}
        <RoundedBox args={[0.13, 0.6, 0.11]} radius={0.04} smoothness={4} position={[-1.1, 1.1, 0]}>
          <meshStandardMaterial color="#59595c" metalness={0.6} roughness={1} />
        </RoundedBox>
        <RoundedBox args={[0.13, 0.35, 0.11]} radius={0.04} smoothness={4} position={[-1.1, 0.4, 0]}>
          <meshStandardMaterial color="#59595c" metalness={0.6} roughness={1} />
        </RoundedBox>
      </group>
    </Float>
  );
};

export default Android3D;

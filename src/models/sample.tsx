import React from "react";
import * as THREE from "three";
import { Float, useTexture } from "@react-three/drei";

// Rounded rectangle shape ፈጣሪ function
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

// Extrude geometry ላይ image texture በትክክል እንዲለጠፍ UV ን remap የሚያደርግ
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

// 1. ስክሪኑ (Screen Texture)
const ScreenTexture: React.FC<{ screenImage: string }> = ({ screenImage }) => {
  const texture = useTexture(screenImage);
  
  React.useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  const screenWidth = 2.08;
  const screenHeight = 4.34;
  const screenRadius = 0.4;
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
      <meshStandardMaterial 
        map={texture} 
        emissiveMap={texture}
        emissive="#ffffff"
        emissiveIntensity={0.5}
        roughness={0.15}
        metalness={0.5}
        toneMapped={false} 
      />
    </mesh>
  );
};

// 2. የስክሪኑ ውስጠኛ ጥቁር ፍሬም (Screen Base)
const ScreenBase = () => {
  const baseWidth = 2.2;
  const baseHeight = 4.45;
  const baseRadius = 0.4;
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

// 3. አጠቃላይ የስልኩ ቦዲ (Screen Base 2)
const ScreenBase2 = () => {
  const baseWidth = 2.25;
  const baseHeight = 4.49;
  const baseRadius = 0.4;
  const baseDepth = 0.23; 

  const geometry = React.useMemo(() => {
    const shape = createRoundedRectShape(baseWidth, baseHeight, baseRadius);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: baseDepth,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.0015,
      bevelSegments: 4,
    });
    remapExtrudeUV(geo, baseWidth, baseHeight);
    return geo;
  }, []);

  return (
    <mesh position={[0, 0, -0.13]} geometry={geometry}>
      <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} emissive="#e0e0e0" emissiveIntensity={0.2} />
    </mesh>
  );
};

export interface Sample3DProps {
  screenImage: string;
  rotation?: [number, number, number];
  scale?: number;
}

// አጠቃላይ የተገጣጠመው ቀላል 3D ሞዴል
export const Sample3D: React.FC<Sample3DProps> = ({
  screenImage,
  rotation = [0, 0, 0],
  scale = 0.9,
}) => {
  return (
    <Float speed={0} rotationIntensity={0} floatIntensity={0}>
      <group scale={scale} rotation={rotation} position={[0, 2.25, 0]}>
        
        {/* የቦዲው ዋና ክፍል */}
        <ScreenBase2 />
        
        {/* የስክሪኑ ጥቁር ፍሬም */}
        <ScreenBase />
        
        {/* ምስሉ የሚታይበት ስክሪን */}
        <React.Suspense fallback={null}>
          <ScreenTexture screenImage={screenImage} />
        </React.Suspense>

      </group>
    </Float>
  );
};

export default Sample3D;

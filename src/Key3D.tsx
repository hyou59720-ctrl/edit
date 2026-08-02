import React from "react";
import * as THREE from "three";
import { Float } from "@react-three/drei";

// ============================================================
// Material - Antique Brass/Gold
// ============================================================

const BRASS_COLOR = "#a8842f";

const brassMaterial = (
  <meshStandardMaterial
    color={BRASS_COLOR}
    metalness={0.85}
    roughness={0.45}
  />
);

// ============================================================
// Helper: Ring (Torus) - camera-facing, front view
// ============================================================

interface RingProps {
  position: [number, number, number];
  radius: number;
  tubeRadius: number;
}

const Ring: React.FC<RingProps> = ({ position, radius, tubeRadius }) => {
  return (
    <mesh position={position}>
      <torusGeometry args={[radius, tubeRadius, 16, 48]} />
      {brassMaterial}
    </mesh>
  );
};


// ============================================================
// Key Bow (the decorative head with 4 rings + diamond + small loop)
// ============================================================

const KeyBow: React.FC = () => {
  const tube = 0.04;
  const tube1 = 0.042;
  const bigs = 0.10;
  const big = 0.14;
  const bigR = 0.12;
  const smallR = 0.08;

  return (
    <group position={[0, 0.9, 0]}>
      {/* Top-left large ring */}
      <Ring position={[-0.22, 0.22, 0]} radius={big} tubeRadius={tube} />
      {/* Top-right large ring */}
      <Ring position={[0.22, 0.22, 0]} radius={big} tubeRadius={tube} />
      {/* Bottom-left large ring */}
      <Ring position={[0, 0.43, 0]} radius={bigR} tubeRadius={tube} />
      {/* Bottom-right large ring */}
      <Ring position={[0, 0.21, 0]} radius={bigs} tubeRadius={tube1} />
      <Ring position={[0, 0, 0]} radius={bigR} tubeRadius={tube} />
      {/* Small hanging ring, top-right */}
      <Ring position={[0, 0.61, 0]} radius={smallR} tubeRadius={0.035} />

        <cylinderGeometry args={[0.06, 0.06, 0.22, 12]} />
        {brassMaterial}
    </group>
  );
};

// ============================================================
// Shaft (with decorative collar rings)
// ============================================================

const Shaft: React.FC = () => {
  return (
    <group position={[0,-0.25, 0]}>
      {/* Main shaft cylinder */}
      <mesh>
        <cylinderGeometry args={[0.055, 0.055, 2, 20]} />
        {brassMaterial}
      </mesh>

      {/* Decorative collar rings along shaft */}
      {[0.55, 0.35, 0.15].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.05, 20]} />
          {brassMaterial}
        </mesh>
      ))}

      {/* Lower collar rings near the bit */}
      {[-0.35, -0.55].map((y, i) => (
        <mesh key={`low-${i}`} position={[0, y, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.05, 20]} />
          {brassMaterial}
        </mesh>
      ))}
    </group>
  );
};

// ============================================================
// Key Bit (the notched teeth at the bottom)
// ============================================================

function createBitShape() {
  const shape = new THREE.Shape();

  
  shape.lineTo(0.005, 0.35);
  shape.lineTo(0.005, 0.1);
  shape.lineTo(0.16, 0.1);
  shape.lineTo(0.16, 0.02);
  shape.lineTo(0.08, 0.02);
  shape.lineTo(0.08, -0.12);
  shape.lineTo(0.18, -0.12);
  shape.lineTo(0.18, -0.22);
  shape.lineTo(0.02, -0.22);
  shape.lineTo(0.02, -0.02);
  shape.lineTo(0.06, -0.02);
  shape.lineTo(0.06, 0.1);
  
  shape.closePath();

  return shape;
}

const KeyBit: React.FC = () => {
  const geometry = React.useMemo(() => {
    const shape = createBitShape();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.09,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.008,
      bevelSegments: 2,
    });
  }, []);

  return (
    <mesh position={[0, -0.95, -0.045]} geometry={geometry}>
      {brassMaterial}
    </mesh>
  );
};

// ============================================================
// PUBLIC COMPONENT
// ============================================================

export interface Key3DProps {
  rotation?: [number, number, number];
  scale?: number;
}

export const Key3D: React.FC<Key3DProps> = ({
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  return (
    <Float speed={0} rotationIntensity={0} floatIntensity={0}>
      <group scale={scale} rotation={rotation}>
        <KeyBow />
        <Shaft />
        <KeyBit />
      </group>
    </Float>
  );
};

export default Key3D;
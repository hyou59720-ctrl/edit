import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  staticFile,
  Easing,
} from "remotion";
import { Floor, FLOOR_Y } from "./Floor";

const SHOW_MESH_NAMES =false;

const MODEL_SCALE = 0.4;
const MODEL_POSITION: [number, number, number] = [0, -1.5, 0];

const TARGET_MESH = "";
const HIDE_MESH = "Plane";

// ካሜራው ርቀትና ቁመት
const CAMERA_RADIUS_HORIZONTAL = 8;
const CAMERA_RADIUS_VERTICAL = 10;
// ==========================================

const SceneBackgroundCleaner = () => {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = null;
    scene.environment = null;
  }, [scene]);
  return null;
};

const AmbulanceCar = ({ onLoadedNames, ...props }: any) => {
  const { scene } = useGLTF(staticFile("/3D/Airbus.glb"));

  useEffect(() => {
    const names: string[] = [];
    const target = TARGET_MESH.toLowerCase();
    const hide = HIDE_MESH.toLowerCase();

    scene.traverse((child: any) => {
      if (child.isMesh) {
        names.push(child.name);
        const meshName = child.name.toLowerCase();

        child.castShadow = true;
        child.receiveShadow = true;

        if (target !== "") {
          if (!meshName.includes(target)) {
            child.visible = false;
            if (child.material) {
              child.material.transparent = true;
              child.material.opacity = 0;
              child.material.depthWrite = false;
            }
          } else {
            child.visible = true;
          }
        } else if (hide !== "" && meshName.includes(hide)) {
          child.visible = false;
          if (child.material) {
            child.material.transparent = true;
            child.material.opacity = 0;
            child.material.depthWrite = false;
          }
        } else {
          child.visible = true;
        }
      }
    });

    if (onLoadedNames) {
      onLoadedNames(names);
    }
  }, [scene, onLoadedNames]);

  return <primitive object={scene} {...props} />;
};

// Object አሁን አይንቀሳቀስም - ቋሚ ቦታ ላይ ብቻ ተቀምጦ ይታያል
const CarRig: React.FC<{ onLoadedNames: (names: string[]) => void }> = ({
  onLoadedNames,
}) => {
  return (
    <group position={MODEL_POSITION}>
      <AmbulanceCar
        onLoadedNames={onLoadedNames}
        rotation={[0, 0, 0]}
        scale={MODEL_SCALE}
      />
    </group>
  );
};

// ካሜራው መኪናውንና ወለሉን አካቶ በዙሪያቸው የሚዞርበት ክፍል
const CameraOrbit: React.FC = () => {
  const frame = useCurrentFrame();
  const { camera } = useThree();
  const { width, height } = useVideoConfig();

  const isVertical = height > width;
  const radius = isVertical ? CAMERA_RADIUS_VERTICAL : CAMERA_RADIUS_HORIZONTAL;

  const frames = [
    0, 50, 80, 110, 140, 170, 200, 230, 260, 290, 320, 350, 380, 400,
  ];

  const angle = interpolate(frame, [0, 400], [0, Math.PI * 2], {
    extrapolateRight: "clamp",
  });

  const camHeight = interpolate(
    frame,
    frames,
    [1.2, 1.2, 1.2, 1.2, 4, 4, 0.5, 0.5, 0.8, 0.8, 0.8, 0.8, 1.2, 1.2],
    { easing: Easing.inOut(Easing.ease), extrapolateRight: "clamp" },
  );

  const wobble = Math.sin(frame / 20) * 0.15;

  camera.position.set(
    Math.sin(angle) * radius,
    camHeight + wobble,
    Math.cos(angle) * radius,
  );
  camera.lookAt(0, FLOOR_Y + 0.5, 0);
  camera.updateProjectionMatrix();

  return null;
};

const BackgroundAndUI: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at center, #0a0a12 0%, #0a0a12 55%, #0a0a12 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          width: "100%",
          textAlign: "center",
          color: "black",
          fontFamily: "Arial",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: "clamp(70px, 8vw, 120px)",
            fontWeight: 800,
            letterSpacing: -3,
          }}
        >
          3D MODEL
        </div>
        <div
          style={{
            marginTop: 15,
            fontSize: "clamp(14px, 3vw, 24px)",
            opacity: 0.6,
          }}
        >
          DYNAMIC VIEW
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CarScene: React.FC = () => {
  const { width, height } = useVideoConfig();
  const [meshNames, setMeshNames] = useState<string[]>([]);

  const isVertical = height > width;
  const cameraZ = isVertical ? 9 : 8;
  const fov = isVertical ? 55 : 50;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {SHOW_MESH_NAMES && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 100,
            background: "rgba(0,0,0,0.8)",
            color: "lime",
            padding: "10px",
            borderRadius: "8px",
            maxWidth: "90%",
            maxHeight: "200px",
            overflow: "auto",
            fontSize: "12px",
            pointerEvents: "none",
          }}
        >
          <b style={{ color: "white" }}>በሞዴሉ ውስጥ ያሉ ክፍሎች (Meshes)፡</b>
          <br />
          {meshNames.length > 0 ? meshNames.join(" | ") : "እየፈለገ ነው..."}
        </div>
      )}

      <Canvas
        shadows
        gl={{ alpha: true, antialias: true }}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          display: "block",
          background: "transparent",
        }}
        camera={{ position: [0, 0, cameraZ], fov: fov }}
        dpr={1}
      >
        <ambientLight intensity={1.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={4}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight
          position={[-5, -5, 5]}
          intensity={0.5}
          color="#aaddff"
        />

        <SceneBackgroundCleaner />

        <Suspense fallback={null}>
          <CarRig onLoadedNames={setMeshNames} />
          <Floor />
        </Suspense>

        <CameraOrbit />

        <ContactShadows
          position={[0, FLOOR_Y + 0.02, 0]}
          opacity={0.6}
          scale={15}
          blur={2.5}
          far={10}
          color="#000000"
        />
      </Canvas>
    </div>
  );
};

export const ThreeDPhone: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} name="Background & UI">
        <BackgroundAndUI />
      </Sequence>
      <Sequence
        from={0}
        name="3D Scene Model"
        style={{ width: "100%", height: "100%" }}
      >
        <CarScene />
      </Sequence>
    </AbsoluteFill>
  );
};

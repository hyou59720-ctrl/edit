import React, { Suspense, useEffect, useState, ComponentType } from "react";
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
  delayRender,
  continueRender,
} from "remotion";
import { Floor, FLOOR_Y } from "./Floor";
import { CharacterAnimation } from "./Animation";

const SHOW_MESH_NAMES = false;
// 1. ስልኩ በደንብ ጎልቶ እንዲታይ መጠኑን (Scale) አሳድጌዋለሁ
const MODEL_SCALE = 1.3; 
// 2. ስልኩ/ላፕቶፑ መሬት (Grid) እና ጥላው ላይ በትክክል እንዲያርፍ ተስተካክሏል
const MODEL_POSITION: [number, number, number] = [0, FLOOR_Y, 0]; 

const MODEL_TYPE = "tsx"; // "glb" ወይም "tsx"
const MODEL_NAME = "IPhone3D";

// ✅ screenImage 
const SCREEN_IMAGE = staticFile("image.png");

const SceneBackgroundCleaner = () => {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = null;
    scene.environment = null;
  }, [scene]);
  return null;
};

// TSX ብቻ ይጠቀም
const TSXModel = ({ onLoadedNames }: any) => {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [handle] = useState(() => delayRender("ሞዴሉን እያመጣሁ ነው..."));

  useEffect(() => {
    const loadTSXModel = async () => {
      try {
        const imported = await import(`./models/${MODEL_NAME}`);
        const Comp = imported.default || imported[MODEL_NAME];
        setComponent(() => Comp);
        continueRender(handle);
      } catch (error) {
        console.error(`Failed to load ${MODEL_NAME}.tsx:`, error);
        setError(`Failed to load ${MODEL_NAME}.tsx`);
        continueRender(handle);
      }
    };

    loadTSXModel();
  }, [handle]);

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  if (!Component) {
    return null;
  }

  return (
    <group position={MODEL_POSITION} scale={MODEL_SCALE}>
      <Suspense fallback={null}>
        <Component 
          onLoadedNames={onLoadedNames}
          screenImage={SCREEN_IMAGE}
        />
      </Suspense>
    </group>
  );
};

// GLB ብቻ ይጠቀም - ወደ አላ ፋይል ውስጥ ወሰደ
const GLBModel = ({ onLoadedNames }: any) => {
  const { scene, animations } = useGLTF(staticFile(`/3D/${MODEL_NAME}.glb`));

  useEffect(() => {
    if (!scene) return;
    const names: string[] = [];
    scene.traverse((child: any) => {
      if (child.isMesh) {
        names.push(child.name);
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    if (onLoadedNames) onLoadedNames(names);
  }, [scene, onLoadedNames]);

  if (!scene) return null;

  return (
    <group position={MODEL_POSITION} scale={MODEL_SCALE}>
      <primitive object={scene} />
      {animations.length > 0 && (
        <CharacterAnimation animations={animations} scene={scene} />
      )}
    </group>
  );
};

const ModelLoader: React.FC<{
  onLoadedNames: (names: string[]) => void;
}> = ({ onLoadedNames }) => {
  return MODEL_TYPE === "tsx" ? (
    <TSXModel onLoadedNames={onLoadedNames} />
  ) : (
    <GLBModel onLoadedNames={onLoadedNames} />
  );
};

const CameraOrbit: React.FC = () => {
  const frame = useCurrentFrame();
  const { camera } = useThree();
  const { width, height } = useVideoConfig();

  const isVertical = height > width;
  const radius = isVertical ? 10 : 8;

  const frames = [
    0, 50, 80, 110, 140, 170, 200, 230, 260, 290, 320, 350, 380, 400,
  ];

  const angle = interpolate(frame, [0, 400], [0, Math.PI * 2], {
    extrapolateRight: "clamp",
  });

  // 👉 3. የካሜራው መመልከቻ (Target) እንደ ሞዴሉ ይለያያል
  // ላፕቶፕ ሲሆን መሃሉን እንዲያይ (1.0)፣ ስልክ ሲሆን ከፍ ብሎ (2.8) እንዲያይ ተስተካክሏል
  const isLaptop = MODEL_NAME.includes("Laptop");
  const targetY = FLOOR_Y + (isLaptop ? 1.0 : 2.8);

  // 👉 4. የካሜራው ቁመት (camHeight) ሁሌም ከመመልከቻው (targetY) ጋር እኩል እንዲሆን
  const camHeight = interpolate(
    frame,
    frames,
    [targetY, targetY, targetY, targetY, targetY + 1.5, targetY + 1.5, targetY, targetY, targetY, targetY, targetY, targetY, targetY, targetY],
    { easing: Easing.inOut(Easing.ease), extrapolateRight: "clamp" },
  );

  const wobble = Math.sin(frame / 20) * 0.15;

  camera.position.set(
    Math.sin(angle) * radius,
    camHeight + wobble,
    Math.cos(angle) * radius,
  );
  
  // 👉 5. ካሜራው ቀጥታ ማዕከሉን እንዲመለከት
  camera.lookAt(0, targetY, 0);
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
            color: "white",
          }}
        >
          3D MODEL
        </div>
        <div
          style={{
            marginTop: 15,
            fontSize: "clamp(14px, 3vw, 24px)",
            opacity: 0.6,
            color: "white",
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
  const cameraZ = isVertical ? 7.5 : 7; 
  const fov = isVertical ? 55 : 55;

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
          <b style={{ color: "white" }}>በሞዴሉ ውስጥ ያሉ ክፍሎች:</b>
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
        <fog attach="fog" args={["#0a0a12", 10, 30]} />

        <ambientLight intensity={2.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={3}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight
          position={[-5, 5, 5]}
          intensity={2.5}
          color="#aaddff"
        />

        <SceneBackgroundCleaner />

        <Suspense fallback={null}>
          <ModelLoader onLoadedNames={setMeshNames} />
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

export default ThreeDPhone;

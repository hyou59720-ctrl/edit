import React from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  staticFile,
  Easing,
} from "remotion";
import { IPhone3D } from "./IPhone3D";

const PhoneRig: React.FC = () => {
  const frame = useCurrentFrame();

  const openAngle = interpolate(
    frame,
    [0, 15, 55, 400],
    [0, 0, 1.6, 1.6],
    { easing: Easing.bezier(0.25, 0.1, 0.25, 1), extrapolateRight: "clamp" }
  );

  const frames = [0, 50, 80, 110, 140, 170, 200, 230, 260, 290, 320, 350, 380, 400];

  const rotationXBase = interpolate(
    frame,
    frames,
    [0.15, 0.15, 0.15, 0.15, 1.4, 1.4, -1.2, -1.2, 0.1, 0.1, 0.1, 0.1, 0.15, 0.15],
    { easing: Easing.inOut(Easing.ease), extrapolateRight: "clamp" }
  );

  const rotationY = interpolate(
    frame,
    frames,
    [0, 0, Math.PI, Math.PI, 0, 0, 0, 0, Math.PI / 2, Math.PI / 2, -Math.PI / 2, -Math.PI / 2, -Math.PI / 6, -Math.PI / 6],
    { easing: Easing.inOut(Easing.ease), extrapolateRight: "clamp" }
  );

  const scaleBase = interpolate(
    frame,
    frames,
    [1.3, 1.3, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.2, 1.2, 1.2, 1.2, 1.5, 1.5],
    { easing: Easing.inOut(Easing.ease), extrapolateRight: "clamp" }
  );

  const rotationX = rotationXBase + Math.sin(frame / 20) * 0.03;
  const rotationZ = Math.sin(frame / 35) * 0.02;

  return (
    <group position={[0, -0.2, 0]}>
      <IPhone3D
        screenImage={staticFile("image.png")}
        openAngle={openAngle} 
        rotation={[rotationX, rotationY, rotationZ]}
        scale={scaleBase}
      />
    </group>
  );
};

const BackgroundAndUI: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at center, #525d6a 0%, #b7d1f9 55%, #ffffff 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          width: "100%",
          textAlign: "center",
          color: "white",
          fontFamily: "Arial",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: "clamp(40px, 8vw, 70px)", fontWeight: 800, letterSpacing: -3 }}>
          FUTURE
        </div>
        <div style={{ marginTop: 15, fontSize: "clamp(14px, 3vw, 24px)", opacity: 0.6 }}>
          SINGLE IMAGE, DYNAMIC VIEW
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PhoneScene: React.FC = () => {
  // useVideoConfig() ከ Remotion composition (Root.tsx) ትክክለኛ width/height ይሰጣል
  // ይህ ሁልጊዜ ወጥ (consistent) ነው - Studio, render, ስልክ, desktop ላይ ተመሳሳይ ውጤት ይሰጣል
  const { width, height } = useVideoConfig();

  // Responsive camera distance and FOV based on COMPOSITION aspect ratio
  const isVertical = height > width;
  const cameraZ = isVertical ? 9 : 8;
  const fov = isVertical ? 55 : 50;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <Canvas
        style={{ width: "100%", height: "100%", display: "block" }}
        camera={{ position: [0, 0, cameraZ], fov: fov }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={4} color="#ffffff" />
        <directionalLight position={[-5, -5, 5]} intensity={2} color="#aaddff" />
        <PhoneRig />
        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.9}
          scale={15}
          blur={2.5}
          far={4}
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
        name="3D Laptop Model"
        style={{ width: "100%", height: "100%" }}
      >
        <PhoneScene />
      </Sequence>
    </AbsoluteFill>
  );
};
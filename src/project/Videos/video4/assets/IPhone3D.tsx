import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { Float, RoundedBox, useTexture } from "@react-three/drei";
import { useCurrentFrame, useVideoConfig } from "remotion";

// ============================================================
// Helpers
// ============================================================

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

// ============================================================
// Screen Configuration & Types
// ============================================================

const SCREEN_WIDTH = 2.08;
const SCREEN_HEIGHT = 4.34;
const SCREEN_RADIUS = 0.35;
const SCREEN_DEPTH = 0.006;

export type ScreenContent =
  | { type: "image"; src: string }
  | { type: "video"; src: string; muted?: boolean; loop?: boolean; startFrame?: number };

// ------------------------------------------------------------
// 1. Screen (Image)
// ------------------------------------------------------------

const ScreenImage: React.FC<{ src: string }> = ({ src }) => {
  const texture = useTexture(src);
  
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  const geometry = useMemo(() => {
    const shape = createRoundedRectShape(SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_RADIUS);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: SCREEN_DEPTH,
      bevelEnabled: false,
    });
    remapExtrudeUV(geo, SCREEN_WIDTH, SCREEN_HEIGHT);
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

// ------------------------------------------------------------
// 2. Screen (Video - Synced with Remotion)
// ------------------------------------------------------------

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

  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    video.muted = muted;
    video.loop = loop;
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    video.autoplay = false;
    video.setAttribute("playsinline", "true");
    
    videoRef.current = video;

    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    setTexture(tex);

    return () => {
      video.pause();
      video.src = "";
      video.load();
      tex.dispose();
    };
  }, [src, muted, loop]);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const relativeFrame = Math.max(0, frame - startFrame);
    const seekTime = relativeFrame / fps;

    if (video.readyState >= 2) { 
        if (!loop && seekTime >= video.duration) {
            video.currentTime = video.duration;
        } else {
            const finalSeekTime = loop ? seekTime % video.duration : seekTime;
            video.currentTime = finalSeekTime;
        }
    }
  }, [frame, fps, startFrame, loop]);

  const geometry = useMemo(() => {
    const shape = createRoundedRectShape(SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_RADIUS);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: SCREEN_DEPTH,
      bevelEnabled: false,
    });
    remapExtrudeUV(geo, SCREEN_WIDTH, SCREEN_HEIGHT);
    return geo;
  }, []);

  if (!texture) return null;

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
          startFrame={screenContent.startFrame}
        />
      );
    default:
      return null;
  }
};

// ============================================================
// iPhone Components
// ============================================================

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

const ScreenBase3 = () => {
  const baseWidth = 2;
  const baseHeight = 3;
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
    <mesh position={[0, -0.67, -0.147]} geometry={geometry}>
      <meshStandardMaterial color="#f0f2f5" metalness={0.2} roughness={0.2} />
    </mesh>
  );
};

const ScreenBase4 = () => {
  const baseWidth = 2.1;
  const baseHeight = 1.2;
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
    <mesh position={[0, 1.55, -0.2]} geometry={geometry}>
      <meshStandardMaterial color="#e2e4e7" metalness={0.3} roughness={0.6} />
    </mesh>
  );
};

const ScreenBase5 = () => {
  const baseWidth = 2;
  const baseHeight = 1.15;
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
    <mesh position={[0, 1.55, -0.21]} geometry={geometry}>
      <meshStandardMaterial color="#ffffff" metalness={0.6} roughness={0.2} emissive="#e0e0e0" emissiveIntensity={0.2} />
    </mesh>
  );
};

const DynamicIsland = () => {
  const shape = React.useMemo(
    () => createRoundedRectShape(0.6, 0.16, 0.08),
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
    <mesh position={[0, 2.06, 0.13]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color="#000000" metalness={0.1} roughness={0.01} />
    </mesh>
  );
};

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
      position={[0, -2.248, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color="#050505" metalness={0.5} roughness={0.4} />
    </mesh>
  );
};

const HomeIndicator = () => {
  const shape = React.useMemo(
    () => createRoundedRectShape(0.8, 0.03, 0.015),
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
    <mesh position={[0, -2.08, 0.144]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshBasicMaterial color="#ffffff" opacity={0.7} transparent={true} />
    </mesh>
  );
};

const AntennaBands = () => {
  const bandMaterial = <meshStandardMaterial color="#b5b7b9" roughness={0.9} metalness={0.1} />;
  return (
    <group>
      <mesh position={[-1.135, 1.8, 0]}><boxGeometry args={[0.002, 0.04, 0.24]} />{bandMaterial}</mesh>
      <mesh position={[-1.135, -1.8, 0]}><boxGeometry args={[0.002, 0.04, 0.24]} />{bandMaterial}</mesh>
      <mesh position={[1.135, 1.8, 0]}><boxGeometry args={[0.002, 0.04, 0.24]} />{bandMaterial}</mesh>
      <mesh position={[1.135, -1.8, 0]}><boxGeometry args={[0.002, 0.04, 0.24]} />{bandMaterial}</mesh>
      <mesh position={[-0.6, 2.25, 0]}><boxGeometry args={[0.002, 0.002, 0.24]} />{bandMaterial}</mesh>
      <mesh position={[0.6, 2.25, 0]}><boxGeometry args={[0.002, 0.002, 0.24]} />{bandMaterial}</mesh>
      <mesh position={[-0.6, -2.25, 0]}><boxGeometry args={[0.04, 0.002, 0.24]} />{bandMaterial}</mesh>
      <mesh position={[0.6, -2.25, 0]}><boxGeometry args={[0.002, 0.002, 0.24]} />{bandMaterial}</mesh>
    </group>
  );
};

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

        ctx.font = "36px FA6SolidCustom"; 
        ctx.textAlign = "left";
        ctx.fillText("\uf012  \uf1eb", 80, 64);
        
        ctx.textAlign = "right";
        ctx.font = "bold 36px Arial"; 
        const percentageText = "70%";
        const percentageTextWidth = ctx.measureText(percentageText).width;
        
        ctx.font = "36px Arial"; 
        const spaceText = " ";
        const spaceWidth = ctx.measureText(spaceText).width;
        
        ctx.font = "36px FA6SolidCustom"; 
        const batteryFullIcon = "\uf240"; 
        const batteryFullIconWidth = ctx.measureText(batteryFullIcon).width;
        
        const totalRightWidth = percentageTextWidth + spaceWidth + batteryFullIconWidth;
        const startX_R = 1024 - 80 - totalRightWidth; 

        ctx.textAlign = "left"; 

        ctx.font = "bold 36px Arial"; 
        ctx.fillText(percentageText, startX_R, 64);
        
        ctx.font = "36px Arial"; 
        ctx.fillText(spaceText, startX_R + percentageTextWidth, 64);
        
        ctx.font = "36px FA6SolidCustom"; 
        ctx.fillText(batteryFullIcon, startX_R + percentageTextWidth + spaceWidth, 64); 

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
    <mesh position={[0, 1.98, 0.15]}>
      <planeGeometry args={[2.08, 0.26]} />
      <meshStandardMaterial 
        map={texture} 
        emissiveMap={texture} 
        emissive="#ffffff" 
        emissiveIntensity={1.5} 
        transparent={true} 
        opacity={2} 
        depthWrite={false} 
        toneMapped={false} 
      />
    </mesh>
  );
};

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
        ctx.fillText("\uf179", 128, 140);

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
  screenContent: ScreenContent;
  rotation?: [number, number, number];
  scale?: number;
}

export const IPhone3D: React.FC<IPhone3DProps> = ({
  screenContent,
  rotation = [0, 0, 0],
  scale = 0.9,
}) => {
  return (
    <Float speed={0} rotationIntensity={0} floatIntensity={0}>
      <group scale={scale} rotation={rotation} position={[0, 2.25, 0]}>
        
        <AntennaBands />

        <ScreenBase />
        <ScreenBase2 />
        <ScreenBase3 />     
        <ScreenBase4 />       
        <ScreenBase5 />          

        <React.Suspense fallback={null}>
          <ScreenTexture screenContent={screenContent} />
        </React.Suspense>

        <StatusBarOverlay />
        <HomeIndicator />
        <DynamicIsland />
        <ChargingPort />

        {/* Camera lenses */}
        {[
          [0.73, 1.85],
          [0.73, 1.28],
          [0.20, 1.6],
        ].map(([x, y], i) => (
          <group key={i} position={[x, y, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh position={[0, -0.015, 0]}>
              <cylinderGeometry args={[0.27, 0.25, 0.18, 32]} />
              <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} emissive="#e0e0e0" emissiveIntensity={0.2} />
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
        <mesh position={[-0.7, 1.85, -0.175]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.055, 0.11, 32]} />
          <meshStandardMaterial color="#ffffff" metalness={0} roughness={0.5} />
        </mesh>
        <mesh position={[0.7, 1.85, -0.175]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.035, 0.1, 32]} />
          <meshStandardMaterial color="#a7a3a3" metalness={0.3} roughness={0.4} />
        </mesh>        

        {/* Sensor dot */}
        <mesh position={[-0.7, 1.25, -0.175]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.055, 0.16, 32]} />
          <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.4} />
        </mesh>

        <AppleLogo />

        {/* Power button */}
        <RoundedBox args={[0.1, 0.5, 0.11]} radius={0.04} smoothness={4} position={[1.1, 0.6, 0]}>
          <meshStandardMaterial color="#d8d9db" metalness={0.6} roughness={0.15} />
        </RoundedBox>

        {/* Volume buttons */}
        <RoundedBox args={[0.1, 0.35, 0.11]} radius={0.04} smoothness={4} position={[-1.1, 0.9, 0]}>
          <meshStandardMaterial color="#d8d9db" metalness={0.6} roughness={0.15} />
        </RoundedBox>
        <RoundedBox args={[0.1, 0.35, 0.11]} radius={0.04} smoothness={4} position={[-1.1, 0.45, 0]}>
          <meshStandardMaterial color="#d8d9db" metalness={0.6} roughness={0.15} />
        </RoundedBox>

        {/* Mute switch */}
        <RoundedBox args={[0.1, 0.2, 0.11]} radius={0.03} smoothness={4} position={[-1.1, 1.5, 0]}>
          <meshStandardMaterial color="#d8d9db" metalness={0.6} roughness={0.15} />
        </RoundedBox>
      </group>
    </Float>
  );
};

export default IPhone3D;

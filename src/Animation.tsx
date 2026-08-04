import React, { useEffect, useState } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";

// ==========================================
// Animation ማስተካከያዎች
// ==========================================
const CLIP_NAME = ""; // ስም ካለው እዚህ ማስገባት ትችላለህ
const ANIMATION_SPEED = 1; 
// ==========================================

interface CharacterAnimationProps {
  animations: THREE.AnimationClip[];
  scene: THREE.Object3D;
}

export const CharacterAnimation: React.FC<CharacterAnimationProps> = ({
  animations,
  scene,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Custom Mixer እንጠቀማለን (Build እንዳያቆም ይረዳል)
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));
  const [clipDuration, setClipDuration] = useState(1);

  useEffect(() => {
    if (!animations || animations.length === 0) return;

    let clip = animations[0];
    if (CLIP_NAME !== "") {
      const found = animations.find((a) => a.name === CLIP_NAME);
      if (found) clip = found;
    }

    if (clip) {
      const action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.play();
      
      setClipDuration(clip.duration);
    } else {
      console.warn("Animation clip አልተገኘም።");
    }
  }, [animations, mixer]);

  // ዋናው መፍትሄ፡ useFrame ትተን በ useEffect እናስተካክላለን
  // ይህ ማለት ቪዲዮው build በሚደረግበት የ Remotion frame ልክ ብቻ አኒሜሽኑ ይንቀሳቀሳል ማለት ነው
  useEffect(() => {
    if (mixer && clipDuration > 0) {
      const timeInSeconds = (frame / fps) * ANIMATION_SPEED;
      const loopedTime = timeInSeconds % clipDuration;
      
      mixer.setTime(loopedTime);
    }
  }, [frame, fps, mixer, clipDuration]);

  return null;
};

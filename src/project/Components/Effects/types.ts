import React from "react";

export type EffectType = "glow" | "lensFlare" | "blur" | "lightRays";

export interface EffectProps {
  effect?: EffectType;
  children: React.ReactNode;
  fullScreen?: boolean;
  color?: string;       
  intensity?: number;   
  maxBlur?: number;     
  borderRadius?: number | string; 
}

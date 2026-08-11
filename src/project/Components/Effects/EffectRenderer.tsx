import React from "react";
import { Glow, LensFlare, LightRays } from "./index";
import { EffectProps } from "./types";

export const EffectRenderer = ({
  effect,
  children,
  fullScreen = false,
  color,
  intensity,
  maxBlur,
  borderRadius, // 1. borderRadius እዚህ እንቀበላለን
}: EffectProps) => {
  switch (effect) {
    case "glow":
      return (
        <Glow fullScreen={fullScreen} color={color} intensity={intensity}>
          {children}
        </Glow>
      );

    case "lensFlare":
      return (
        <LensFlare fullScreen={fullScreen} intensity={intensity}>
          {children}
        </LensFlare>
      );

    case "lightRays":
      return (
        // 2. borderRadius ወደ LightRays እናሳልፋለን
        <LightRays 
          fullScreen={fullScreen} 
          color={color} 
          intensity={intensity} 
          borderRadius={borderRadius}
        >
          {children}
        </LightRays>
      );

    default:
      return <>{children}</>;
  }
};

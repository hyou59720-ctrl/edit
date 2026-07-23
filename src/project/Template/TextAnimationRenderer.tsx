import React from "react";
import type { TextAnimationProps } from "../Components/TextAnimations/types";
import {
  AnimatedText,
  GlitchText,
  PulsingText,
  Typewriter,
  Highlight,
  CircleMarker,
  FadeText,
  SlideUpText,
  SlideLeftText,
  ZoomInText,
  BounceText,
  WaveText,
  ScrambleText,
  BlurRevealText,
  RotateRevealText,
  NeonGlowText,
  SmoothRevealText,
} from "../Components/TextAnimations";

interface TextAnimationRendererProps extends TextAnimationProps {
  animation?: string;
}

export const TextAnimationRenderer: React.FC<TextAnimationRendererProps> = ({
  animation,
  ...props
}) => {
  switch (animation) {
    case "Typewriter":
      return <Typewriter {...props} />;
    case "AnimatedText":
      return <AnimatedText {...props} />;
    case "Glitch":
      return <GlitchText {...props} />;
    case "Pulse":
      return <PulsingText {...props} />;
    case "Highlight":
      return <Highlight {...props} />;
    case "Circle":
      return <CircleMarker {...props} />;
    case "FadeText":
      return <FadeText {...props} />;
    case "SlideUpText":
      return <SlideUpText {...props} />;
    case "SlideLeftText":
      return <SlideLeftText {...props} />;
    case "ZoomInText":
      return <ZoomInText {...props} />;
    case "BounceText":
      return <BounceText {...props} />;
    case "WaveText":
      return <WaveText {...props} />;
    case "ScrambleText":
      return <ScrambleText {...props} />;
    case "BlurRevealText":
      return <BlurRevealText {...props} />;
    case "RotateRevealText":
      return <RotateRevealText {...props} />;
    case "NeonGlowText":
      return <NeonGlowText {...props} />;
    case "SmoothRevealText":
      return <SmoothRevealText {...props} />;
    default:
      return <FadeText {...props} />;
  }
};


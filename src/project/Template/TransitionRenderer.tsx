import React from "react";
import { BlurTransition } from "../Components/Transitions/BlurTransition";
import { TransitionProps } from "../Components/Transitions/types";

interface TransitionRendererProps extends TransitionProps {
  transition?: string;
  duration?: number;
  maxBlur?: number;
}

export const TransitionRenderer: React.FC<TransitionRendererProps> = ({
  transition,
  ...props
}) => {
  switch (transition) {
    case "BlurTransition":
      return <BlurTransition {...props} />;
    default:
      return <>{props.children}</>;
  }
};

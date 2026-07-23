import React from "react";

export interface TransitionProps {
  children: React.ReactNode;
  duration?: number;
  maxBlur?: number;
  progress?: number;
}

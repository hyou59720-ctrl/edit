import React from "react";

export interface TransitionProps {
  children: React.ReactNode;
  progress?: number;
  duration?: number;
  maxBlur?: number;
}
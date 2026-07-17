import React from "react";
import { staticFile } from "remotion";

export const FontStyles: React.FC = () => {
  return (
    <style>
      {`
        @font-face {
          font-family: 'HabeshaStencil';
          src: url('${staticFile("font/Waldba_Yebse_Regular_299c8ff034.ttf")}') format('truetype');
          font-display: swap;
        }

        @font-face {
          font-family: 'Akira Expanded Demo';
          src: url('${staticFile("font/Nueva Std/Nueva Std Bold Extended/Nueva Std Bold Extended.otf")}') format('opentype');
          font-display: swap;
        }
      `}
    </style>
  );
};


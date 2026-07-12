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
          font-family: 'AkiraExpanded';
          src: url('${staticFile("font/Akira Expanded Demo.otf")}') format('opentype');
          font-display: swap;
        }
      `}
    </style>
  );
};

"use client";

import React from "react";
import type { TextEffectProps } from "./types";

export default function Layered3DText({
  children,
  colors = ["#0b192c", "#00e5ff", "#ffffff"],
}: TextEffectProps) {
  const [
    mainColor = "#0b192c",     // የቴክስቱ ዋና ጥቁር/ሰማያዊ ከለር
    shadowColor = "#00e5ff",   // የ 3D ጥልቀቱ እና የብርሃን ከለር (Cyan)
    strokeColor = "#ffffff",   // የጠርዝ ከለር
  ] = colors ?? [];

  return (
    <>
      <style>{`
        .layered-3d-text-effect,
        .layered-3d-text-effect * {
          color: ${mainColor} !important;
          -webkit-text-fill-color: ${mainColor} !important;
          -webkit-text-stroke: 1.5px ${strokeColor};
          
          /* ባለብዙ ንብርብር ጥላ በመጠቀም እውነተኛ የ 3D ውፍረት መፍጠር */
          text-shadow:
            2px 2px 0 ${shadowColor},
            4px 4px 0 ${shadowColor},
            6px 6px 0 ${mainColor},
            8px 8px 0 ${shadowColor},
            10px 10px 0 ${shadowColor},
            12px 12px 15px rgba(0, 0, 0, 0.6);
        }
      `}</style>

      <div className="layered-3d-text-effect">
        {children}
      </div>
    </>
  );
}


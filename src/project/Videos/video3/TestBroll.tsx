import React from "react";
import { AbsoluteFill } from "remotion";
import { EffectRenderer } from "../../Components/Effects/EffectRenderer";

export const TestBroll = () => {
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #111, #333)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* የሳጥኑን ቀለም (#bd4343) እዚህ ጋር color ብለህ ስጠው! */}
      <EffectRenderer effect="lightRays" intensity={10} color="#bd4343" borderRadius="30px">
        <div
          style={{
            width: 600,
            height: 400,
            background: "#bd4343",
            borderRadius: "30px",
          }}
        />
      </EffectRenderer>
    </AbsoluteFill>
  );
};

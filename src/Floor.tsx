import React from "react";
import { Grid } from "@react-three/drei";

// ==========================================
// Floor ማስተካከያዎች
// ==========================================
// ወለሉ ምን ያክል ቁመት ላይ እንደሆነ - መኪናው ጎማ ወለሉ ላይ በትክክል እንዲያርፍ ከ MODEL_POSITION Y
// ትንሽ ዝቅ ብሎ መስተካከል አለበት (ጎማ ወደ ወለል እንዳይሰምጥ)
export const FLOOR_Y = -2;

const FLOOR_SIZE = 40;

// reflective ወለል ቀለም
const FLOOR_COLOR = "#d6d6d6";

// Grid መስመሮች ቀለም (ግላዊ/ኒዮን ስሜት)
const GRID_COLOR_MAIN = "#000000";
const GRID_COLOR_SECTION = "#ff2ea6";

interface FloorProps {
  y?: number;
  size?: number;
}

export const Floor: React.FC<FloorProps> = ({
  y = FLOOR_Y,
  size = FLOOR_SIZE,
}) => {
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color={FLOOR_COLOR} />
      </mesh>

      {/* ኒዮን grid effect - synthwave / tron ስሜት ይሰጣል */}
      <Grid
        position={[0, 0.01, 0]}
        args={[size, size]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor={GRID_COLOR_MAIN}
        sectionSize={3}
        sectionThickness={1.4}
        sectionColor={GRID_COLOR_SECTION}
        fadeDistance={26}
        fadeStrength={1.5}
        infiniteGrid
      />
    </group>
  );
};

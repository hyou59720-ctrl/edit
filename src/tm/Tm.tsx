import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  Solid,
} from "remotion";
import { Background, Particles } from "./Helpers";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";
import { Scene3 } from "./Scene3";
import { Scene4 } from "./Scene4";

export const Tm: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill className="font-sans">
      <Background />
      <Particles />
      <Sequence
        from={0}
        durationInFrames={112}
        style={{
          scale: interpolate(frame, [0, 63], ["3 1", 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Scene1 />
      </Sequence>
      <Sequence from={112} durationInFrames={112}>
        <Scene2 />
      </Sequence>
      <Sequence from={224} durationInFrames={112}>
        <Scene3 />
      </Sequence>
      <Sequence from={336} durationInFrames={114}>
        <Scene4 />
      </Sequence>
    </AbsoluteFill>
  );
};

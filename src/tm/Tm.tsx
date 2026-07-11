import { AbsoluteFill, Sequence } from "remotion";
import { Background, Particles } from "./Helpers";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";
import { Scene3 } from "./Scene3";
import { Scene4 } from "./Scene4";

export const Tm: React.FC = () => {
  return (
    <AbsoluteFill className="font-sans">
      <Background />
      <Particles />
      <Sequence
        from={0}
        durationInFrames={112}
        style={{
          translate: "-2.5px 91.3px",
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

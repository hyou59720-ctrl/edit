import { AbsoluteFill, Sequence } from "remotion";
// እያንዳንዱን ትዕይንት (Scene) ከየራሱ ፋይል Import እናደርጋለን
import { LogoIntro } from "./LogoIntro";
import { ProblemScene } from "./ProblemScene";
import { FeaturesScene } from "./FeaturesScene";
import { CTAScene } from "./CTAScene";
import { OutroLogo } from "./OutroLogo";

// ፩. አዲሱን ዘመናዊ ጀርባ እዚህ ጋር Import እናደርጋለን
import { ModernBackground } from "./ModernBackground";

export const TelebirrAd: React.FC = () => {
  return (
    // ፪. ፍሬሞቹን ሳንነካ ሁሉንም Sequence በ ModernBackground ብቻ ጠቅልለነዋል
    <ModernBackground>
      <Sequence from={0} durationInFrames={150}>
        <LogoIntro />
      </Sequence>
      <Sequence
        from={145}
        durationInFrames={90}
        style={{
          translate: "5.4px -4.8px",
        }}
      >
        <ProblemScene />
      </Sequence>
      <Sequence from={235} durationInFrames={180}>
        <FeaturesScene />
      </Sequence>
      <Sequence from={415} durationInFrames={85}>
        <CTAScene />
      </Sequence>
      <Sequence from={500} durationInFrames={100}>
        <OutroLogo />
      </Sequence>
    </ModernBackground>
  );
};

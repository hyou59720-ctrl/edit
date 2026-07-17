import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

export const SoundEffects: React.FC = () => {
  return (
    <>
      {/* 
        ማሳሰቢያ፦ የጀርባ ሙዚቃ (BGM) ፋይል በአሁኑ ሰዓት በ public/audio ውስጥ ስላልታየ 
        ለጊዜው አጥፍቼዋለሁ። ሙዚቃ ስትጨምር ከታች ያለውን ኮድ ከፈት አድርገህ መጠቀም ትችላለህ።
      */}
      {/* 
      <Sequence from={0} durationInFrames={512}>
        <Audio
          src={staticFile("audio/background_music.mp3")} 
          volume={0.15}
          loop
        />
      </Sequence> 
      */}

      {/* 1. ለ B-Roll 1 የሚሆን የድምፅ ሽግግር (Whoosh SFX) */}
      <Sequence from={50} durationInFrames={50}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.4} />
      </Sequence>


      {/* 3. ለ B-Roll 3 የሚሆን የድምፅ ሽግግር */}
      <Sequence from={295} durationInFrames={50}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.4} />
      </Sequence>

      {/* 4. ለ B-Roll 4 የሚሆን የድምፅ ሽግግር */}
      <Sequence from={350} durationInFrames={50}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.4} />
      </Sequence>

      {/* 5. ለቴሌግራም አኒሜሽን የሚሆን ብቅ የማለት ድምፅ (Telegram Pop SFX) */}
      {/* በ public/audio/pop.mp3 ላይ ያለውን ድምፅ ይጠቀማል */}
      <Sequence from={450} durationInFrames={40}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.8} />
      </Sequence>
      {/* በ public/audio/pop.mp3 ላይ ያለውን ድምፅ ይጠቀማል */}
      <Sequence from={425} durationInFrames={50}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.4} />
      </Sequence>      
    </>
  );
};

import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

export const SoundEffects: React.FC = () => {
  return (
    <>
      {/* 
      <Sequence from={0} durationInFrames={512}>
        <Audio
          src={staticFile("audio/background_music.mp3")} 
          volume={0.15}
          loop
        />
      </Sequence> 
      */}
      <Sequence from={20} durationInFrames={50}>
        <Audio src={staticFile("audio/swoosh.mp3")} volume={0.8} />
      </Sequence>    
      
      <Sequence from={50} durationInFrames={50}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.6} />
      </Sequence>

      <Sequence from={295} durationInFrames={50}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.6} />
      </Sequence>

      <Sequence from={350} durationInFrames={50}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.6} />
      </Sequence>

      <Sequence from={450} durationInFrames={40}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.8} />
      </Sequence>

      <Sequence from={425} durationInFrames={50}>
        <Audio src={staticFile("audio/whoosh.mp3")} volume={0.6} />
      </Sequence>      
    </>
  );
};

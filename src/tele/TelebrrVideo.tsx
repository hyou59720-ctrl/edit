import { AbsoluteFill, Audio, Sequence } from 'remotion';
// ከታች ባለው መስመር ላይ የነበሩትን { } ቅንፎች አጥፍተናቸዋል
import Scene1_Question from './scenes/Scene1_Question'; 
import { TelebirrCommercial } from './scenes/Scene2_Intro';
import { Scene3_NoQueue } from './scenes/Scene3_NoQueue';
import { Scene4_TapScan } from './scenes/Scene4_TapScan';
import { Scene5_Outro } from './scenes/Scene5_Outro';

export const TelebrrVideo = () => {
  return (
    <AbsoluteFill className="bg-black">
      <Audio src={require('./telebrr.wav')} volume={1.0} />

      <Sequence from={0} durationInFrames={115}><Scene1_Question /></Sequence>
      <Sequence from={115} durationInFrames={218}><TelebirrCommercial /></Sequence>
      <Sequence from={333} durationInFrames={80}><Scene3_NoQueue /></Sequence>
      <Sequence from={413} durationInFrames={94}><Scene4_TapScan /></Sequence>
      <Sequence from={507} durationInFrames={150}><Scene5_Outro /></Sequence>
    </AbsoluteFill>
  );
};

import React from 'react';
import { IdeationBroll } from './IdeationBroll';
import { InfographicBroll } from './InfographicBroll';
import { FilmingBroll } from './FilmingBroll';
import { TimelineBroll } from './TimelineBroll';
import { MoneyBroll } from './MoneyBroll';

export const videoData = {
  title: "MrBeast Dynamic Custom TSX Brolls",

  // 1. ዋናው የ MrBeast A-roll ቪዲዮ ፋይል
  mainVideo: require("./MrBeastRaw.mp4"),

  // 2. የ B-roll ኮዶች (TSX) ከነ ፍሬማቸው — 5 broll
  brolls: [
  {
    component: IdeationBroll,
    startFrame: 115,
    endFrame: 200,
  },
  {
    component: InfographicBroll,
    startFrame: 316,
    endFrame: 382,
  },
  {
    component: FilmingBroll,
    startFrame: 457,
    endFrame: 556,

    transition: "BlurTransition",

    transitionDuration: 16,
    transitionBlur: 28,
  },
  {
    component: TimelineBroll,
    startFrame: 556,
    endFrame: 620,
  },
  {
    component: MoneyBroll,
    startFrame: 646,
    endFrame: 700,
  },
],

  // 3. እያንዳንዱ ቃል ሳይሳሳት የተዘጋጀው ሙሉ የሰብታይትል ዝርዝር
  subtitles: [
    {
      text: "We work on videos probably", 
      startFrame: 0, 
      endFrame: 49, 
      animation: "SmoothRevealText", 
      effect: "ChromeText",
      speed: 20, 
      stagger: 2, 
      fontSize: 72,
      colors: ["#ffffff", "#0e69c6", "#287bfa"]
      
    },
    { text: "three to four months in advance.", startFrame: 49, endFrame: 114, animation: "NeonGlowText", speed: 5, stagger: 1, fontSize: 63, 
    },
    { text: "But before that, like, there's an ideation", startFrame: 115, endFrame: 180 },
    { text: "where we brainstorm what they are", startFrame: 181, endFrame: 225 },
    { text: "for a month or two.", startFrame: 226, endFrame: 255 },
    { text: "So from start to when they get uploaded,", startFrame: 256, endFrame: 315 },
    { text: "it's probably like one to two months", startFrame: 316, endFrame: 372 },
    { text: "coming up with the idea,", startFrame: 373, endFrame: 405 },
    { text: "three to four months working on the idea,", startFrame: 406, endFrame: 456 },
    { text: "and then a couple weeks filming,", startFrame: 457, endFrame: 495 },
    { text: "and then like three weeks editing.", startFrame: 496, endFrame: 555 },
    { text: "So probably five months from start to finish.", startFrame: 556, endFrame: 612 },
    { text: "Two years ago we were spending", startFrame: 613, endFrame: 645 },
    { text: "$100k a video, now we're spending probably...", startFrame: 646, endFrame: 700 },
  ],
};
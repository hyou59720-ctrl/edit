import React from 'react';
import { IdeationBroll } from './IdeationBroll';
import { InfographicBroll } from './InfographicBroll';
import { FilmingBroll } from './FilmingBroll';
import { TimelineBroll } from './TimelineBroll';
import { MoneyBroll } from './MoneyBroll';

export const videoData = {
  title: "MrBeast Dynamic Custom TSX Brolls",

  mainVideo: require("./MrBeastRaw.mp4"),
  
  mainVideoVolume: 1, 

  brolls: [
    { component: IdeationBroll, startFrame: 115, endFrame: 200 },
    { component: InfographicBroll, startFrame: 316, endFrame: 383 },
    {
      component: FilmingBroll,
      startFrame: 457,
      endFrame: 556,
      transitionType: "filmBurn",
      transitionVideoSrc: "filmBurn9",
    },
    { component: TimelineBroll, startFrame: 556, endFrame: 615 },
    { component: MoneyBroll, startFrame: 615, endFrame: 700 },
  ],

  subtitles: [
    // ==========================================
    // 1. "We work on videos"
    // ==========================================
    {
      text: "We",
      startFrame: 0, 
      endFrame: 49, 
      animation: "FadeText", 
      speed: 15, 
      fontSize: 45, 
      bottomOffset: 620, 
      fontFamilyName: "Poppins",
    },
    {
      text: "WORK",
      startFrame: 8, 
      endFrame: 49, 
      animation: "SmoothRevealText", 
      effect: "ChromeText", 
      // 👈 ወርቃማ (Gold) ቀለማት ለዋናው ቃል
      colors: ["#FFDF00", "#FFB300", "#FF8C00"], 
      speed: 20, 
      stagger: 2,
      fontSize: 160, 
      bottomOffset: 440, 
      fontFamilyName: "Montserrat",
    },
    {
      text: "on videos",
      startFrame: 16, 
      endFrame: 49, 
      animation: "FadeText", 
      speed: 15, 
      fontSize: 45, 
      bottomOffset: 400, 
      fontFamilyName: "Poppins",
    },
    
    // ==========================================
    // 2. "3 to 4 months in advance."
    // ==========================================
    {
      text: "3 TO 4",
      startFrame: 49, 
      endFrame: 114, 
      animation: "SmoothRevealText", 
      effect: "ChromeText",
      speed: 20, 
      stagger: 2,
      fontSize: 140, 
      // 👈 ወርቃማ (Gold) ቀለማት
      colors: ["#FFDF00", "#FFB300", "#FF8C00"], 
      bottomOffset: 520, 
      fontFamilyName: "Montserrat",
    },
    {
      text: "MONTHS",
      startFrame: 57, 
      endFrame: 114, 
      animation: "SmoothRevealText", 
      speed: 20, 
      fontSize: 65, 
      bottomOffset: 430, 
      fontFamilyName: "Montserrat", // ምንም color ስለሌለው ነጭ ይሆናል
    },
    {
      text: "in advance.",
      startFrame: 65, 
      endFrame: 114, 
      animation: "FadeText", 
      speed: 15, 
      fontSize: 40, 
      bottomOffset: 350, 
      fontFamilyName: "Poppins",
    },

    // ==========================================
    // 3. "For 1 to 2 months"
    // ==========================================
    {
      text: "For",
      startFrame: 226, 
      endFrame: 255, 
      animation: "FadeText", 
      speed: 15,
      fontSize: 45, 
      bottomOffset: 620, 
      fontFamilyName: "Poppins",
    },
    {
      text: "1 TO 2",
      startFrame: 232, 
      endFrame: 255, 
      animation: "SmoothRevealText", 
      effect: "ChromeText", 
      // 👈 ወርቃማ (Gold) ቀለማት
      colors: ["#FFDF00", "#FFB300", "#FF8C00"], 
      speed: 20,
      stagger: 2,
      fontSize: 150, 
      bottomOffset: 440, 
      fontFamilyName: "Montserrat",
    },
    {
      text: "months",
      startFrame: 238, 
      endFrame: 255, 
      animation: "FadeText", 
      speed: 15,
      fontSize: 45, 
      bottomOffset: 400, 
      fontFamilyName: "Poppins",
    },

    // ==========================================
    // 4. "From start to upload"
    // ==========================================
    {
      text: "From start",
      startFrame: 256, 
      endFrame: 315, 
      animation: "FadeText", 
      speed: 15,
      fontSize: 50, 
      bottomOffset: 550,
      fontFamilyName: "Poppins",
    },
    {
      text: "to",
      startFrame: 264, 
      endFrame: 315, 
      animation: "FadeText", 
      speed: 15,
      fontSize: 35, 
      bottomOffset: 500,
      fontFamilyName: "Poppins",
    },
    {
      text: "UPLOAD",
      startFrame: 270, 
      endFrame: 315, 
      animation: "SmoothRevealText", 
      effect: "ChromeText",
      // 👈 ወርቃማ (Gold) ቀለማት
      colors: ["#FFDF00", "#FFB300", "#FF8C00"], 
      speed: 20,
      stagger: 2,
      fontSize: 130, 
      bottomOffset: 350,
      fontFamilyName: "Montserrat",
    },

    // ==========================================
    // 5. "3 to 4 months working on it"
    // ==========================================
    {
      text: "3 to 4 months",
      startFrame: 406, 
      endFrame: 456, 
      animation: "FadeText", 
      speed: 15,
      fontSize: 50, 
      bottomOffset: 620,
      fontFamilyName: "Poppins",
    },
    {
      text: "WORKING",
      startFrame: 414, 
      endFrame: 456, 
      animation: "SmoothRevealText", 
      effect: "ChromeText",
      // 👈 ወርቃማ (Gold) ቀለማት
      colors: ["#FFDF00", "#FFB300", "#FF8C00"], 
      speed: 20,
      stagger: 2,
      fontSize: 140, 
      bottomOffset: 460,
      fontFamilyName: "Montserrat",
    },
    {
      text: "on it",
      startFrame: 422, 
      endFrame: 456, 
      animation: "FadeText", 
      speed: 15,
      fontSize: 40, 
      bottomOffset: 420,
      fontFamilyName: "Poppins",
    }
  ],
};

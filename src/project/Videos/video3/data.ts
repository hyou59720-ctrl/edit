import { TestBroll } from "./TestBroll";
import { CircleBroll } from "./CircleBroll"; 

export const videoData = {
  title: "Test",
  mainVideo: null,
  audio: null,

  brolls: [
    {
      startFrame: 0,
      endFrame: 200,
      uiType: "balanceCard",
      uiProps: { balance: "$500", width:700, height:400, accountHolder: "Tm Kalayu" },
    },
    {
      startFrame: 200,
      endFrame: 400,
      component: CircleBroll,
      effect: "glow", 
      color: "#1b36f6"
    },
  ],

  subtitles: [],
};

import React from "react";
import { Composition } from "remotion";
import { SubtitledVideo } from "./youtub/SubtitledVideo";
import { TelebirrAd } from "./Telebirr/TelebirrAd";
import { RofiVideo } from "./rofi/rofi";
import { Tm } from "./tm/Tm";
import { Scene } from "./paper/Scene";
import { MainVideo } from "./video/MainVideo";
import { TiktokSynchronizedVideo } from "./tiktok/TiktokSynchronizedVideo";

// 🚀 አዲሱ እና ፍጹም እውር የሆነው የቪዲዮ መገጣጠሚያ
import { VideoComposition } from './project/Template/VideoComposition';

// አኒሜሽኖቹን ከ sample ፎልደር ውስጥ Import የተደረጉ
import CircularProgress100 from "./sample/100%";
import { ThreeDPhone } from "./ThreeDPhone";
import { AppleCinematicHero } from './sample/graph'; 


const SHOW = {
  TikTokMainVideo: false,
  TiktokSynchronizedVideo: false,
  Tm: false,
  PaperScene: false,
  CircularProgress100: false,
  AppleCinematicHero: false,
  TelebirrAdvertisement: false,
  RofiVideo: false,
  MySubtitledVideo: false,
  ThreeDPhone: false,
  MrBeastVericentric: true, 
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 🚀 አዲሱ የቲክቶክ ቪዲዮ Composition (ከ B-roll እና Subtitles ጋር) */}
      {SHOW.TikTokMainVideo && (
        <Composition  
          id="TikTokMainVideo"  
          component={MainVideo}  
          durationInFrames={1135}    
          fps={30}                   
          width={1080}               
          height={1920}  
        />
      )}

      {/* 🚀 የተመሳሰለ የቲክቶክ ሰብስቲትል ቪዲዮ */}
      {SHOW.TiktokSynchronizedVideo && (
        <Composition  
          id="TiktokSynchronizedVideo"  
          component={TiktokSynchronizedVideo}  
          durationInFrames={740}    
          fps={25}
          width={1080}               
          height={1920}  
        />
      )}

      {/* 1. የ Tm Composition */}
      {SHOW.Tm && (
        <Composition  
          id="Tm"  
          component={Tm}  
          durationInFrames={450}  
          fps={30}  
          width={1080}  
          height={1920}  
        />
      )}

      {/* New Paper Scene Composition */}
      {SHOW.PaperScene && (
        <Composition  
          id="PaperScene"  
          component={Scene}  
          durationInFrames={300}  
          fps={25}  
          width={1080}  
          height={1920}  
        />
      )}

      {/* 2. ለ 100%.tsx የተሰራ አዲስ Composition */}  
      {SHOW.CircularProgress100 && (
        <Composition  
          id="CircularProgress100"  
          component={CircularProgress100}  
          durationInFrames={150}      
          fps={30}                   
          width={1080}               
          height={1920}  
        />  
      )}

      {/* 3. ለ graph.tsx የተሰራ አዲስ Composition */}  
      {SHOW.AppleCinematicHero && (
        <Composition
          id="AppleCinematicHero"
          component={AppleCinematicHero}
          durationInFrames={400}
          fps={60}
          width={1920}
          height={1080}
        />
      )}

      {/* 4. የቴሌብር ማስታወቂያ */}  
      {SHOW.TelebirrAdvertisement && (
        <Composition  
          id="TelebirrAdvertisement"  
          component={TelebirrAd}  
          durationInFrames={600}  
          fps={30}  
          width={1080}  
          height={1920}  
        />  
      )}

      {/* 5. አዲሱ የ TelebrrVideo Composition */}  
      {SHOW.RofiVideo && (
        <Composition  
          id="RofiVideo"  
          component={RofiVideo}  
          durationInFrames={509}  
          fps={30}  
          width={1080}               
          height={1920}  
        />  
      )}

      {/* የድሮው ሰብስቲትል ቪዲዮ (Landscape) */}
      {SHOW.MySubtitledVideo && (
        <Composition
          id="MySubtitledVideo"
          component={SubtitledVideo}
          durationInFrames={590}   
          fps={25}                 
          width={1920}
          height={1080}
        />
      )}

      {/* 3D ስልክ (ከባድ ስለሆነ ሲያስፈልግህ ብቻ true አድርገው) */}
      {SHOW.ThreeDPhone && (
        <Composition
          id="ThreeDPhone"
          component={ThreeDPhone}
          durationInFrames={400}
          fps={30}
          width={1080}
          height={1920}
        /> 
      )}     
      
      {/* 🎯 አዲሱ ሙሉ በሙሉ በባዶ የሚነሳው የMrBeast መቆጣጠሪያ */}
      {SHOW.MrBeastVericentric && (
        <Composition
          id="MrBeast-Vericentric-Video"
          component={VideoComposition}
          durationInFrames={701}
          fps={30}
          width={1080}
          height={1920}
        />
      )}
    </>
  );
};

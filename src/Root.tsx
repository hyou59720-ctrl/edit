import React from "react";
import { Composition } from "remotion";
import { SubtitledVideo } from "./youtub/SubtitledVideo";
import { RofiVideo } from "./rofi/rofi";
import { MainVideo } from "./video/MainVideo";
import { VideoComposition } from './project/Template/VideoComposition';
import { videoData as mrBeastData } from "./project/Videos/video1/data";
import { videoData as telebirrData } from "./project/Videos/video2/data";
import { videoData as testData } from "./project/Videos/video3/data";
import { videoData as rofiData } from "./project/Videos/video4/data";
import { ThreeDPhone } from "./ThreeDPhone";

const SHOW = {
  TikTokMainVideo: false,
  RofiVideo: false,
  MySubtitledVideo: false,
  ThreeDPhone: false,
  MrBeastVericentric: false, 
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
       
      <Composition
        id="Telebirr"
        component={() =>
          <VideoComposition videoData={telebirrData}/>
        }
        durationInFrames={808}
        fps={30}
        width={1920}
        height={1080}
       />   
       
        <Composition
        id="Test"
        component={() =>
          <VideoComposition videoData={testData}/>
        }
        durationInFrames={400}
        fps={30}
        width={1080}
        height={1920}
       />          

        <Composition
        id="Rofi"
        component={() =>
          <VideoComposition videoData={rofiData}/>
        }
        durationInFrames={1990}
        fps={25}
        width={1080}
        height={1920}
       />          
       
      {/* 🎯 አዲሱ ሙሉ በሙሉ በባዶ የሚነሳው የMrBeast መቆጣጠሪያ */}
      {SHOW.MrBeastVericentric && (
        <Composition
          id="MrBeast"
          component={() => (
            <VideoComposition videoData={mrBeastData}/>
          )}
          durationInFrames={701}
          fps={30}
          width={1080}
          height={1920}
        />
      )}
    </>
  );
};

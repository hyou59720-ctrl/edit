import { Composition } from "remotion";
import { SubtitledVideo } from "./youtub/SubtitledVideo";
import { TelebirrAd } from "./Telebirr/TelebirrAd";
import { RofiVideo } from "./rofi/rofi";
import { Tm } from "./tm/Tm";
import { Scene } from "./paper/Scene";

// 🔥 አዲሱን ዋና የቲክቶክ ቪዲዮ መቆጣጠሪያ component import አደረግነው
import { MainVideo } from "./video/MainVideo";
import { TiktokSynchronizedVideo } from "./tiktok/TiktokSynchronizedVideo";

// አኒሜሽኖቹን ከ sample ፎልደር ውስጥ Import የተደረጉ
import CircularProgress100 from "./sample/100%";
import GraphAnimation from "./sample/graph";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 🚀 አዲሱ የቲክቶክ ቪዲዮ Composition (ከ B-roll እና Subtitles ጋር) */}
      <Composition  
        id="TikTokMainVideo"  
        component={MainVideo}  
        durationInFrames={1135}    // ~37 ሰከንድ (37 × 30fps = 1110)
        fps={30}                   // ለቲክቶክ 30fps
        width={1080}               // TikTok Portrait Size
        height={1920}  
      />

      {/* 🚀 የተመሳሰለ የቲክቶክ ሰብስቲትል ቪዲዮ */}
      <Composition  
        id="TiktokSynchronizedVideo"  
        component={TiktokSynchronizedVideo}  
        durationInFrames={740}    // ~25 ሰከንድ (740 frames / 30 fps)
        fps={25}
        width={1080}               // TikTok Portrait Size
        height={1920}  
      />

      {/* 1. የ Tm Composition */}
      <Composition  
        id="Tm"  
        component={Tm}  
        durationInFrames={450}  
        fps={30}  
        width={1080}  
        height={1920}  
      />

      {/* New Paper Scene Composition */}
      <Composition  
        id="PaperScene"  
        component={Scene}  
        durationInFrames={300}  
        fps={25}  
        width={1080}  
        height={1920}  
      />

      {/* 2. ለ 100%.tsx የተሰራ አዲስ Composition */}  
      <Composition  
        id="CircularProgress100"  
        component={CircularProgress100}  
        durationInFrames={150}     // 5 ሰከንድ (150 ፍሬም በ 30fps)  
        fps={30}                   
        width={1080}               
        height={1920}  
      />  

      {/* 3. ለ graph.tsx የተሰራ አዲስ Composition */}  
      <Composition  
        id="GraphAnimation"  
        component={GraphAnimation}  
        durationInFrames={150}     
        fps={30}  
        width={1080}  
        height={1920}  
      />  

      {/* 4. የቴሌብር ማስታወቂያ */}  
      <Composition  
        id="TelebirrAdvertisement"  
        component={TelebirrAd}  
        durationInFrames={600}  
        fps={30}  
        width={1080}  
        height={1920}  
      />  

      {/* 5. አዲሱ የ TelebrrVideo Composition */}  
      <Composition  
        id="RofiVideo"  
        component={RofiVideo}  
        durationInFrames={512}  
        fps={30}  
        width={1080}               
        height={1920}  
      />  

      {/* የድሮው ሰብስቲትል ቪዲዮ (Landscape) */}
      <Composition
        id="MySubtitledVideo"
        component={SubtitledVideo}
        durationInFrames={590}   
        fps={25}                 
        width={1920}
        height={1080}
      />
    </>
  );
};

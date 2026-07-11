import { Composition } from "remotion";
import { SubtitledVideo } from "./youtub/SubtitledVideo";
import { TelebirrAd } from "./Telebirr/TelebirrAd";
// 👇 አዲሱን TelebrrVideo component ከነበረበት ፎልደር import አደረግነው
import { TelebrrVideo } from "./tele/TelebrrVideo";
import { Tm } from "./tm/Tm";

// አኒሜሽኖቹን ከ sample ፎልደር ውስጥ Import የተደረጉ
import CircularProgress100 from "./sample/100%";
import GraphAnimation from "./sample/graph";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 1. የ Tm Composition */}
      <Composition  
        id="Tm"  
        component={Tm}  
        durationInFrames={450}  
        fps={30}  
        width={1080}  
        height={1920}  
      />

      {/* 2. ለ 100%.tsx የተሰራ አዲስ Composition */}  
      <Composition  
        id="CircularProgress100"  
        component={CircularProgress100}  
        durationInFrames={150}     // 5 ሰከንድ (150 ፍሬም በ 30fps)  
        fps={30}                   // ለቲቶክ 30fps ይመረጣል
        width={1080}               // Shorts/TikTok Portrait
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

      {/* 🔥 5. አዲሱ የ TelebrrVideo Composition (ለ TikTok ዲዛይን የተደረገ) */}  
      <Composition  
        id="TelebrrVideo"  
        component={TelebrrVideo}  
        durationInFrames={657}  // 20 ሰከንድ (በ 30fps) - እንደ ቪዲዮህ ርዝመት መቀየር ትችላለህ
        fps={30}  
        width={1080}               // TikTok Size (Portrait)
        height={1920}  
      />  

         {/* የድሮው ሰብስቲትል ቪዲዮ (Landscape) — fps ከ video ጋር እንዲመሳሰል ተስተካክሏል */}
      <Composition
        id="MySubtitledVideo"
        component={SubtitledVideo}
        durationInFrames={590}   // 23.56s × 25fps
        fps={25}                 // ቪዲዮው በ25fps ስለሆነ ከዚያ ጋር ማዛመድ አለበት
        width={1920}
        height={1080}
      />
    </>
  );
};

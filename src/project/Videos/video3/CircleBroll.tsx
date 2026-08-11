import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { UiRenderer } from "../../Components/UI/UiRenderer"; 
import myImage from "./image.jpg"; // የፋይሉ ትክክለኛ ዱካ መሆኑን አረጋግጥ

export const CircleBroll = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. የ Size (Scale) አኒሜሽን፦ ካርዱን ድንገት ብቅ (Pop-up) እንዲል ያደርገዋል
  const scale = spring({
    fps,
    frame,
    config: { damping: 12, mass: 0.5 }, // አኒሜሽኑ ምን ያህል እንደሚዘል (Bounce) እዚህ ማስተካከል ትችላለህ
  });

  // 2. የ Opacity አኒሜሽን፦ ከ 0 እስከ 15 ፍሬም ቀስ ብሎ እንዲበራ (Fade-in) ያደርገዋል
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 3. ወደ ላይ የመውጣት (Slide up) አኒሜሽን፦ ከታች ወደ ላይ ቀስ ብሎ ይንሸራተታል
  const translateY = interpolate(frame, [0, 15], [50, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 1. image.jpg ሙሉውን ስክሪን እንደ ባክግራውንድ ይሸፍናል */}
      <Img 
        src={myImage} 
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* 2. GlassCard/PaymentCard በአኒሜሽን ታጅቦ ይገባል */}
      <div 
        style={{ 
          zIndex: 1,
          // አኒሜሽኑ እዚህ የካርዱ መጠቅለያ (div) ላይ ይተገበራል
          opacity: opacity,
          transform: `scale(${scale}) translateY(${translateY}px)`
        }}
      >
        <UiRenderer 
          type="paymentCard" 
          amount="2,000,000 ETB" // ማስታወሻ፡ ለ PaymentCard 'balance' ሳይሆን 'amount' ነው የሚሰራው 
          recipient="Tm Kalayu"
          width={700}
          height={400}
        />
      </div>
    </AbsoluteFill>
  );
};

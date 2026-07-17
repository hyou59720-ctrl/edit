import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

export const TelegramGlassReveal: React.FC = () => {
  const frame = useCurrentFrame();

  // 1. የቴሌግራም አዶ (Icon) ብቅ ማለት (Intro) እና መጥፋት (Outro)
  const iconScale = interpolate(
    frame,
    [0, 10, 240, 255], // Intro (0-10 frames), Outro (240-255 frames)
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.175, 0.885, 0.32, 1.275), // Bounce back effect
    }
  );

  const iconRotate = interpolate(frame, [0, 12], [-15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // 2. የተጠቃሚ ስም መግለጫ ሳጥን (Apple Glass Bar) መዘርጋት እና መሰብሰብ
  const barWidth = interpolate(
    frame,
    [12, 35, 220, 240], // መዘርጋት (12-35), መልሶ መሰብሰብ (220-240)
    [0, 520, 520, 0],   
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1), // Ultra smooth ease-out
    }
  );

  // 3. የጽሑፍ (@Username) ብቅ ማለት
  const textOpacity = interpolate(
    frame,
    [30, 45, 210, 220], // ሳጥኑ ከተዘረጋ በኋላ ጽሑፉ ይበራል፣ ከመሰብሰቡ በፊት ይጠፋል
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const textX = interpolate(
    frame,
    [30, 45],
    [-25, 0], // ከግራ ወደ ቀኝ በትንሹ እየተንሸራተተ ይገባል
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const planePath =
    "M21.5 3.5 2.7 10.8c-1.3.5-1.3 1.2-.2 1.6l4.8 1.5 1.8 5.6c.2.6.4.8.8.8.4 0 .6-.2.8-.4l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.8-.8l3.2-15.4c.4-1.4-.4-2-1.5-1.5z";

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: "transparent", // ለቪዲዮ ኤዲቲንግ እንዲመች ጀርባው ግልጽ ነው
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 700,
          height: 200,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* 1. የ Apple ስታይል መስተዋት ሳጥን (Apple Glassmorphic Bar) */}
        <div
          style={{
            position: "absolute",
            left: 80, // ከአዶው ጀርባ ይጀምራል
            height: 130,
            width: barWidth,
            
            // የ Glassmorphic ዋና ምስጢሮች፡
            background: "rgba(255, 255, 255, 0.12)", // ቀጭን ነጭ የመስታወት ቀለም
            backdropFilter: "blur(25px) saturate(180%)", // የጀርባ ማደብዘዣ እና የከለር ማጉያ (Apple style)
            WebkitBackdropFilter: "blur(25px) saturate(180%)", // ለ Safari ማሰሻዎች ድጋፍ
            border: "1px solid rgba(255, 255, 255, 0.24)", // የሚያብረቀርቅ ቀጭን ጠርዝ
            borderRadius: "0 30px 30px 0",
            
            display: "flex",
            alignItems: "center",
            paddingLeft: 90, // ጽሑፉ ከአዶው ጋር እንዳይጋጭ
            boxSizing: "border-box",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)", // ለስላሳ ጥላ
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          {/* ጽሑፍ (Username Text) */}
          <div
            style={{
              color: "#ffffff",
              fontSize: 50,
              fontWeight: 600, // የ Apple ጽሑፍ ውፍረት
              letterSpacing: "-0.5px",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)", // ጽሑፉ በነጭ ጀርባ ላይም በደንብ እንዲታይ
              opacity: textOpacity,
              transform: `translateX(${textX}px)`,
              whiteSpace: "nowrap",
            }}
          >
            @Rofi_edit
          </div>
        </div>

        {/* 2. የቴሌግራም አዶ (Apple-Style Glassy Telegram Icon) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 150,
            height: 150,
            borderRadius: 38,
            
            // ለአዶውም እንዲሁ የመስታወት ዲዛይን ተደርጎለታል፡
            background: "linear-gradient(135deg, rgba(56, 189, 248, 0.85), rgba(2, 132, 199, 0.85))",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            
            boxShadow: "0 15px 35px rgba(2, 132, 199, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${iconScale}) rotate(${iconRotate}deg)`,
            transformOrigin: "center",
            zIndex: 2, // ሁልጊዜ ከላይ እንዲሆን
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={80}
            height={80}
            style={{
              transform: "translateX(-4px) translateY(2px)", // አውሮፕላኑን መሃል ለማድረግ
              filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.15))",
            }}
          >
            <path d={planePath} fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
};

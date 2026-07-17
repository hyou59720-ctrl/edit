import React from "react";
import { staticFile } from "remotion";

// 🖼️ ምስሎቹን ከ src/rofi/icon/ ላይ በቀጥታ import እናደርጋቸዋለን
import img1 from "../icon/1.png";
import img2 from "../icon/2.png";
import img3 from "../icon/3.png";
import img4 from "../icon/4.png";
import img5 from "../icon/5.png";

// የዩቲዩብ ሎጎም በዚያው ፎልደር ውስጥ ካለ በቀጥታ መጠቀም ይቻላል
import youtubeLogo from "../icon/youtube-logo.png";

const CARD_HEIGHT = 180; 
const CARD_GAP = 28;
const CARD_COUNT = 5;
const LOOP_HEIGHT = (CARD_HEIGHT + CARD_GAP + 60) * CARD_COUNT; 

const IMAGES = [img1, img2, img3, img4, img5];

export const YouTubeFeed: React.FC<{ frame: number }> = ({ frame }) => {
  const scrollY = (frame * 3) % LOOP_HEIGHT;
  const cards = Array.from({ length: CARD_COUNT }, (_, i) => i);

  const videoDetails = [
    { title: "RED DEAD REDEMPTION 3 (CHAPTER 4)", channel: "TAT", views: "207 watching" },
    { title: "GOOGLE Omni can make ADVANCED motion graphics - NO WATERMARK", channel: "Ankit Sharma", views: "8.6K views • 9 days ago" },
    { title: "እንዴት በቀላሉ ምርጥ B-roll ማግኘት እንችላለን?", channel: "Habesha Edit", views: "15K views • 2 weeks ago" },
    { title: "Premiere Pro ሙሉ መማሪያ ለጀማሪዎች", channel: "Rofi Tutorial", views: "34K views • 1 month ago" },
    { title: "ከ 0 ተነስተን በቪዲዮ ኤዲቲንግ ገንዘብ መስራት", channel: "Ethio Creator", views: "50K views • 3 days ago" }
  ];

  const renderCards = (pass: number) =>
    cards.map((i) => {
      const details = videoDetails[i % videoDetails.length];
      return (
        <div key={`${pass}-${i}`} style={{ width: "100%", marginBottom: CARD_GAP, background: "#ffffff" }}>
          {/* የቪዲዮው Thumbnail (ያለ ምንም የሰዓት ወይም የ Live ምልክት) */}
          <div
            style={{
              width: "100%",
              height: CARD_HEIGHT,
              overflow: "hidden",
              background: "#f0f0f0",
              position: "relative"
            }}
          >
            <img
              src={IMAGES[i % IMAGES.length]} // የኢምፖርት የተደረጉትን ምስሎች እዚህ እንጠቀማለን
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* የቪዲዮ መረጃዎች (ቻናል ፕሮፋይል፣ ርዕስ፣ ቪው) */}
          <div style={{ display: "flex", gap: 12, marginTop: 10, padding: "0 8px", position: "relative" }}>
            {/* የቻናል ፕሮፋይል ምስል */}
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e0e0e0", flexShrink: 0, overflow: "hidden" }}>
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(45deg, #ec4899, #8b5cf6)" }} />
            </div>

            {/* ርዕስ እና እይታዎች */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, paddingRight: 20 }}>
              <span style={{ color: "#0f0f0f", fontWeight: 600, fontSize: 13, lineHeight: "1.4em", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {details.title}
              </span>
              <span style={{ color: "#606060", fontSize: 11 }}>
                {details.channel} • {details.views}
              </span>
            </div>

            {/* ባለ ሶስት ነጥብ ምልክት */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, justifyContent: "center", height: 20, cursor: "pointer" }}>
              <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#0f0f0f" }} />
              <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#0f0f0f" }} />
              <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#0f0f0f" }} />
            </div>
          </div>
        </div>
      );
    });

  return (
    <div style={{ width: "100%", height: "100%", background: "#ffffff", fontFamily: "sans-serif" }}>
      {/* 1. የላይኛው ዋና ባር */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "between",
          padding: "42px 16px 10px 16px", 
          background: "#ffffff",
        }}
      >
        {/* የዩቲዩብ ሎጎና ስም */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
          <img
            src={youtubeLogo} // የኢምፖርት የተደረገው ሎጎ
            style={{ width: 28, height: 20, objectFit: "contain" }}
            onError={(e) => {
              // ሎጎው በ src ውስጥ ከሌለ ወደ staticFile fallback እንዲያደርግ
              (e.target as HTMLImageElement).src = staticFile("icon/youtube-logo.png");
            }}
          />
          <span style={{ color: "#000000", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>YouTube</span>
        </div>

        {/* የማሳወቂያ ደወል እና የፍለጋ ምልክቶች */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ position: "relative" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span style={{ position: "absolute", top: -4, right: -6, background: "#ff0000", color: "#ffffff", fontSize: 9, fontWeight: "bold", borderRadius: "50%", width: 15, height: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
              5
            </span>
          </div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {/* 2. የካቴጎሪ ታጎች ባር */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 14px 10px 14px",
          background: "#ffffff",
          borderBottom: "1px solid #f0f0f0",
          overflow: "hidden"
        }}
      >
        <div style={{ background: "#f2f2f2", padding: "6px 10px", borderRadius: 8, display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 14 }}>🧭</span>
        </div>
        <div style={{ background: "#0f0f0f", color: "#ffffff", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500 }}>
          All
        </div>
        <div style={{ background: "#f2f2f2", color: "#0f0f0f", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>
          Video editing software
        </div>
        <div style={{ background: "#f2f2f2", color: "#0f0f0f", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500 }}>
          AI
        </div>
      </div>

      {/* 3. የሚንሸራተቱ ቪዲዮዎች */}
      <div style={{ height: "calc(100% - 105px)", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: -scrollY, left: 0, right: 0, padding: "12px 0" }}>
          {renderCards(0)}
          {renderCards(1)}
        </div>
      </div>
    </div>
  );
};

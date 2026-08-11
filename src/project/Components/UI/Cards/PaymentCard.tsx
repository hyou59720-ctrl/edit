// src/project/Components/UI/Cards/PaymentCard.tsx
import React from "react";

export const PaymentCard = ({
  bankName = "BANK",
  accountNumber = "8888 8888 8888 8888",
  date = "11/26",
  accountHolder = "CARDHOLDER NAME",
  width = 500,
  height = 310,
  borderRadius = 24,
}: {
  bankName?: string;
  accountNumber?: string;
  date?: string;
  accountHolder?: string;
  width?: number;
  height?: number;
  borderRadius?: number | string;
}) => {
  return (
    <div
      style={{
        width,
        height,
        // በምስሉ ላይ እንዳለው ክላሲክ የሆነ ሰማያዊ የባንክ ካርድ ግራዲየንት
        background: "linear-gradient(135deg, #5786c9 0%, #355b9a 100%)",
        borderRadius,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "30px 40px",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 1. የላይኛው ክፍል: የባንኩ ስም እና የዋይፋይ (Contactless) ምልክት */}
      <div style={{ display: "flex", justifyContent: "flex-end", flexDirection: "column", alignItems: "flex-end" }}>
        <span 
          style={{ 
            fontSize: 26, 
            fontWeight: 700, 
            letterSpacing: "3px", 
            textShadow: "1px 1px 3px rgba(0,0,0,0.3)" 
          }}
        >
          {bankName}
        </span>
        {/* የ Contactless (Wifi) ምልክት ልክ እንደ ምስሉ */}
        <div style={{ marginTop: 5 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(90deg)" }}>
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        </div>
      </div>

      {/* 2. ወርቃማው የባንክ ቺፕ (EMV Chip) */}
      <div
        style={{
          width: 55,
          height: 40,
          background: "linear-gradient(135deg, #e0b976 0%, #c59747 100%)",
          borderRadius: 8,
          position: "relative",
          border: "1px solid rgba(0,0,0,0.3)",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.4)",
          marginTop: -20, // ወደ ላይ ከፍ እንዲል
        }}
      >
        {/* የቺፑ ውስጣዊ መስመሮች */}
        <div style={{ position: "absolute", top: "25%", left: 0, right: 0, height: "1px", background: "rgba(0,0,0,0.25)" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "rgba(0,0,0,0.25)" }} />
        <div style={{ position: "absolute", top: "75%", left: 0, right: 0, height: "1px", background: "rgba(0,0,0,0.25)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "30%", width: "1px", background: "rgba(0,0,0,0.25)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, right: "30%", width: "1px", background: "rgba(0,0,0,0.25)" }} />
      </div>

      {/* 3. የመሃል የካርድ ቁጥሮች (በፕላስቲክ ላይ የታተመ እንዲመስል Embossed text shadow ተጠቅመናል) */}
      <div 
        style={{ 
          fontSize: 34, 
          fontWeight: 600, 
          letterSpacing: "4px", 
          textShadow: "1px 1px 2px rgba(0,0,0,0.6), -1px -1px 1px rgba(255,255,255,0.2)",
          marginTop: 15,
        }}
      >
        {accountNumber}
      </div>

      {/* 4. የታችኛው ክፍል: Valid Thru እና የካርድ ባለቤት ስም */}
      <div style={{ display: "flex", flexDirection: "column", marginTop: 5 }}>
        
        {/* Valid Thru */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "40%" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 8, lineHeight: 1.2, opacity: 0.8 }}>
            <span>VALID</span>
            <span>THRU</span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: "1px", textShadow: "1px 1px 2px rgba(0,0,0,0.4)" }}>
            {date}
          </span>
        </div>

        {/* Cardholder Name */}
        <div 
          style={{ 
            fontSize: 22, 
            fontWeight: 500, 
            letterSpacing: "2px", 
            textTransform: "uppercase",
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            marginTop: 10,
          }}
        >
          {accountHolder}
        </div>
        
      </div>
    </div>
  );
};

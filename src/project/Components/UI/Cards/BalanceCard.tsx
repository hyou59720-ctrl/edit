// src/project/Components/UI/Cards/BalanceCard.tsx
import React from "react";

export const BalanceCard = ({
  balance = "$24,580.50",
  accountNumber = "**** **** **** 4892",
  accountHolder = "Tm Kalayu",
  width = 500,
  height = 280,
  borderRadius = 30,
}: {
  balance?: string;
  accountNumber?: string;
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
        // የፊንቴክ (Fintech) የባንክ ካርዶች የሚኖራቸው ውብ የግራዲየንት ጀርባ
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius,
        border: "1.5px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 35,
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* የካርዱ ላይኛው ክፍል (አርማ እና ቺፕ ምልክት) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "1px", opacity: 0.8 }}>
          TOTAL BALANCE
        </span>
        {/* የባንክ ቺፕ ንድፍ (Simulated Chip) */}
        <div
          style={{
            width: 45,
            height: 35,
            background: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)",
            borderRadius: 6,
            boxShadow: "inset 0 0 5px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      {/* የመሃል ክፍል (ሂሳብ ሚዛን - Balance Amount) */}
      <div>
        <h1 style={{ margin: 0, fontSize: 42, fontWeight: 800, letterSpacing: "1px" }}>
          {balance}
        </h1>
      </div>

      {/* የታችኛው ክፍል (የካርድ ቁጥር እና ባለቤቱ) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 14, opacity: 0.6, marginBottom: 4 }}>Card Number</div>
          <div style={{ fontSize: 18, fontFamily: "monospace", letterSpacing: "2px" }}>
            {accountNumber}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 14, opacity: 0.6, marginBottom: 4 }}>Card Holder</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            {accountHolder}
          </div>
        </div>
      </div>
    </div>
  );
};

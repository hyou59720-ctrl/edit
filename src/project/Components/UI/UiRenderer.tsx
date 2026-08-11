import React from "react";
import { GlassCard, BalanceCard, PaymentCard } from "./index";
import { UiRendererProps } from "./types"; // ታይፖቹን ከ types.ts ጠራን


export const UiRenderer = ({
  type,
  title,
  subtitle,
  balance,
  accountNumber,
  accountHolder,
  amount,
  recipient,
  date,
  status,
  width,
  height,
  borderRadius,
}: UiRendererProps) => {
  switch (type) {
    case "glassCard":
      return (
        <GlassCard 
          title={title} 
          subtitle={subtitle} 
          width={width} 
          height={height} 
          borderRadius={borderRadius} 
        />
      );

    case "balanceCard":
      return (
        <BalanceCard 
          balance={balance} 
          accountNumber={accountNumber} 
          accountHolder={accountHolder} 
          width={width} 
          height={height} 
          borderRadius={borderRadius} 
        />
      );

    case "paymentCard":
      return (
        <PaymentCard 
          amount={amount}
          recipient={recipient}
          date={date}
          status={status}
          width={width} 
          height={height} 
          borderRadius={borderRadius} 
        />
      );

    default:
      return (
        <GlassCard 
          title={title} 
          subtitle={subtitle} 
          width={width} 
          height={height} 
          borderRadius={borderRadius} 
        />
      );
  }
};

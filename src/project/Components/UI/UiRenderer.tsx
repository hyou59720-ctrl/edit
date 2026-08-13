import React from "react";
import {
  GlassCard,
  BalanceCard,
  PaymentCard,
  MoneyHook,
  CircleTimer, 
  NumberPop,
  GrowthTrend,
  CheckBadge, 
  OnlineBadge, 
  IconReveal,
  FreeBadge
} from "./index";
import { UiRendererProps } from "./types";

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
  scale,
  color,
  text,
  imageSrc,
  durationInFrames,
  seconds,          // 🆕 CircleTimer-ን ለማንቀሳቀስ ያስፈልጋሉ
  countDirection,   // 🆕
  size,             // 🆕
  strokeWidth,      // 🆕
  bgColor,          // 🆕
  items,
  suffix,
  staggerFrames,
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

    case "moneyHook":
      return (
        <MoneyHook
          text={text}
          width={width}
          height={height}
          borderRadius={borderRadius}
          scale={scale}
          color={color}
          durationInFrames={durationInFrames}
        />
      );

    case "circleTimer":
      return (
        <CircleTimer
          seconds={seconds}
          countDirection={countDirection}
          size={size}
          strokeWidth={strokeWidth}
          color={color}
          bgColor={bgColor}
          scale={scale}
          text={text} 
          durationInFrames={durationInFrames}
        />
      );
      
 case "growthTrend":
  return <GrowthTrend text={text} size={size} color={color} scale={scale} durationInFrames={durationInFrames} />;
case "checkBadge":
  return <CheckBadge text={text} color={color} scale={scale} durationInFrames={durationInFrames} />;
case "onlineBadge":
  return <OnlineBadge text={text} size={size} color={color} scale={scale} durationInFrames={durationInFrames} />;
case "freeBadge":
  return <FreeBadge text={text} color={color} scale={scale} durationInFrames={durationInFrames} />;
  
    case "numberPop":
      return (
        <NumberPop
          items={items}
          suffix={suffix}
          color={color}
          scale={scale}
          staggerFrames={staggerFrames}
          durationInFrames={durationInFrames}
        />
      );
      
      case "iconReveal":
        return (
          <IconReveal
            text={text}
            imageSrc={imageSrc}
            color={color}
            scale={scale}
            size={size}
            durationInFrames={durationInFrames}
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
export interface UiRendererProps {
  type: string;
  title?: string;
  subtitle?: string;
  balance?: string;
  accountNumber?: string;
  accountHolder?: string;
  amount?: string;
  recipient?: string;
  date?: string;
  status?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  scale?: number;
  color?: string;
  text?: string;
  durationInFrames?: number;
  seconds?: number;
  countDirection?: "up" | "down";
  size?: number;
  strokeWidth?: number;
  imageSrc?: string; // 🆕
  bgColor?: string;
  items?: string[];        // 🆕 NumberPop-ን ለ
  suffix?: string;          // 🆕
  staggerFrames?: number;   // 🆕
}
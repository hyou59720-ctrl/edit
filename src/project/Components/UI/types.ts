// src/project/Components/UI/types.ts

export type UIType = 
  | "glassCard" 
  | "balanceCard" 
  | "paymentCard"
  | "moneyHook"    // አዲስ: ለ 20,000 ETB
  | "timerHook"    // አዲስ: ለ 30 ሰከንድ ቆጣሪው
  | "numberPopup"  // አዲስ: ለ 10, 20, 50
  | "lowerThird";  // አዲስ: ለ Rofi Edits ብራንድ ስም

export interface UiRendererProps {
  type?: UIType;
  // የድሮዎቹ...
  title?: string;
  subtitle?: string;
  balance?: string;
  accountNumber?: string;
  accountHolder?: string;
  amount?: string;
  recipient?: string;
  date?: string;
  status?: string;

  // 🌟 አዳዲሶቹ (ለ Pop-ups)
  text?: string;       // ለ MoneyHook እና NumberPopup
  seconds?: number;    // ለ TimerHook
  brandName?: string;  // ለ LowerThird

  // የጋራ (Common)
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  scale?: number;
}

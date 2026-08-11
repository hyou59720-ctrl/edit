export type UIType = "glassCard" | "balanceCard" | "paymentCard";

export interface UiRendererProps {
  type?: UIType;
  // ለ GlassCard
  title?: string;
  subtitle?: string;
  // ለ BalanceCard
  balance?: string;
  accountNumber?: string;
  accountHolder?: string;
  // ለ PaymentCard
  amount?: string;
  recipient?: string;
  date?: string;
  status?: string;
  // የጋራ (Common)
  width?: number;
  height?: number;
  borderRadius?: number | string;
}

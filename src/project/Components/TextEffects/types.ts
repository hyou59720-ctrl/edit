export interface TextEffectProps {
  text?: string;
  children?: React.ReactNode;

  fontSize?: number;
  fontWeight?: number;
  tracking?: string;

  color?: string;
  colors?: string[];
}
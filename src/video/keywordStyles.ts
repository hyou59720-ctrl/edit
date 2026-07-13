export type KeywordStyle = {
  textClass: string;
};

export const KEYWORD_STYLES: Record<string, KeywordStyle> = {
  MOTIVATION: { textClass: "bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent" },
  POTENTIAL: { textClass: "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent" },
  AGENCY: { textClass: "bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent" },
  INSPIRATION: { textClass: "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent" },
  PROGRESS: { textClass: "bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent" },
  STEP: { textClass: "bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent" },
  TEMPLATE: { textClass: "bg-gradient-to-r from-red-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent" },
  INSPIRE: { textClass: "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent" },
  MODEL: { textClass: "bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent" },
  EDIT: { textClass: "bg-gradient-to-r from-violet-400 via-pink-500 to-red-400 bg-clip-text text-transparent" },
};

export const findKeyword = (word: string): string | null => {
  const upper = word.toUpperCase();

  if (upper.includes("POTENTIAL") || upper.includes("ፖቴንሻል")) {
    return "POTENTIAL";
  }

  for (const key of Object.keys(KEYWORD_STYLES)) {
    if (upper.includes(key)) return key;
  }
  return null;
};

export interface Subtitle {
  text: string;
  startFrame: number;
  endFrame: number;
}

export const subtitles: Subtitle[] = [
  // 0s - 3s
  { text: "ብዙ ሰው በጀመረው ነገር", startFrame: 1, endFrame: 50 },
  { text: "የሚፈልገው ቦታ ያልደረሰው", startFrame: 51, endFrame: 90 },

  // 3s - 6s (B-roll 1)
  { text: "ባጭር ጊዜ  MOTIVATION  ተነሳስተው", startFrame: 91, endFrame: 150 },
  { text: "ስራ ስለምንጀምሩ ነው", startFrame: 151, endFrame: 185 },

  // 6s - 9s
  { text: "MOTIVATION  ሳይሆን INSPIRATION  ነው", startFrame: 186, endFrame: 245 },
  { text: "የሚያስፈልጋችሁ", startFrame: 246, endFrame: 270 },

  // 9s - 12s (B-roll 2)
  { text: "አንድ ቪዲዮ  EDIT  የሚያደርግ ሰው", startFrame: 271, endFrame: 305 },
  { text: "እንዲህ ማድረግ ትችላለህ  AGENCY  መክፈት", startFrame: 306, endFrame: 345 },
  { text: "ትችላለህ እያልኩ", startFrame: 346, endFrame: 365 },

  // 12s - 15s
  { text: "ከምነግረው  MOTIVATION", startFrame: 366, endFrame: 415 },
  { text: "ከማሳየው ይልቅ", startFrame: 416, endFrame: 450 },

  // 15s - 18s (B-roll 3)
  { text: "የሆነ  TEMPLATE  ሰጥቼ ወይም የሆነ", startFrame: 451, endFrame: 505 },
  { text: "INSPIRATION  ሰጥቼ ይህንን አድርገው ብለው", startFrame: 506, endFrame: 560 },

  // 18s - 24s
  { text: "የሚሻለው ሁለተኛው ነው", startFrame: 561, endFrame: 620 },
  { text: "SO ምንጊዜም የተሻሉ ሰዎችን", startFrame: 621, endFrame: 680 },
  { text: "ስትመለከቱ", startFrame: 681, endFrame: 720 },

  // 24s - 29s (B-roll 4)
  { text: "1. INSPIRE", startFrame: 721, endFrame: 795 },
  { text: "2. MODEL", startFrame: 796, endFrame: 870 },

  // 29s - 37s
  { text: "እንድታደርጉት ነው ማድመጥ ያለባችሁ", startFrame: 871, endFrame: 930 },
  { text: "ካለሆን ግን ጊዜያዊ መነሳሳት", startFrame: 931, endFrame: 990 },
  { text: "ቀጣዩ STEP ምን እንደሆነ", startFrame: 991, endFrame: 1020 },
  { text: "ካላወቃችሁበት ስሜቱ ይጠፋል", startFrame: 1021, endFrame: 1080 },
  { text: "PROGRESS አችሁ ይቆማል!", startFrame: 1081, endFrame: 1110 }
];

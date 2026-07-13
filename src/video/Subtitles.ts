export interface Subtitle {
  text: string;
  startFrame: number;
  endFrame: number;
}

export const subtitles: Subtitle[] = [
  // 0s - 3s (መግቢያውን በማጣመር ረዘም ላለ ጊዜ እንዲታይ)
  { text: "ብዙ ሰው በጀመረው ነገር", startFrame: 1, endFrame: 50 },
  { text: "የሚፈልገው ቦታ ያልደረሰው", startFrame: 51, endFrame: 90 },

  // 3s - 6s (B-roll 1) -> "ባጭር ጊዜ" እና "ስራ" የሚሉትን ፍላሽ አጥፍተን ለ MOTIVATION ረጅም ጊዜ ሰጥተናል
  { text: "MOTIVATION ተነሳስተው", startFrame: 91, endFrame: 150 },
  { text: "ስለምንጀምሩ ነው", startFrame: 151, endFrame: 185 },

  // 6s - 9s -> ሁለቱን ቃላት በአንድ መስመር በማድረግ ረዘም ላለ ጊዜ እንዲቆዩ ተደርጓል
  { text: "MOTIVATION ሳይሆን INSPIRATION ነው", startFrame: 186, endFrame: 245 },
  { text: "የሚያስፈልጋችሁ", startFrame: 246, endFrame: 270 },

  // 9s - 12s (B-roll 2) -> "እያልኩ" "እንዲህ ማድረግ" የሚሉትን በመቀነስ ለ EDIT እና AGENCY ሰፊ ፍሬም ተሰጥቷል
  { text: "ቪዲዮ EDIT የሚያደርግ ሰው", startFrame: 271, frame: 271, endFrame: 315 },
  { text: "AGENCY መክፈል ትችላለህ", startFrame: 316, endFrame: 365 },

  // 12s - 15s -> ለ POTENTIAL ብቻ 50 ሙሉ ፍሬም ሰጥተነዋል!
  { text: "ከምነግረው POTENTIAL", startFrame: 366, endFrame: 415 },
  { text: "ከማሳየው በላይ", startFrame: 416, endFrame: 450 },

  // 15s - 18s (B-roll 3) -> "ወይም የሆነ" የሚለውን በማጥፋት TEMPLATE እና INSPIRATION እኩል እንዲቆዩ ተደርጓል
  { text: "TEMPLATE ሰጥቼ", startFrame: 451, endFrame: 505 },
  { text: "INSPIRATION ሰጥቼ", startFrame: 506, endFrame: 560 },

  // 18s - 24s -> ፈጣን ፍላሽ የነበሩትን በማጣመር ንባቡን ማቀዝቀዝ
  { text: "የሚሻለው ሁለተኛው ነው", startFrame: 561, endFrame: 620 },
  { text: "ምንጊዜም የተሻሉ ሰዎችን", startFrame: 621, endFrame: 680 },
  { text: "ስትመለከቱ", startFrame: 681, endFrame: 720 },

  // 24s - 29s (B-roll 4) -> እነዚህ አስቀድሞም ቆይታቸው ጥሩ ነበር
  { text: "1. INSPIRE", startFrame: 752, endFrame: 800 },
  { text: "2. MODEL", startFrame: 810, endFrame: 870 },

  // 29s - 37s -> አላስፈላጊ ቃላትን ቀንሰን ለ STEP እና PROGRESS ረጅም ሰከንድ ሰጥተናል
  { text: "ማድመጥ ያለባችሁ", startFrame: 871, endFrame: 930 },
  { text: "ካለበለዚያ ጊዜያዊ መነሳሳት", startFrame: 931, endFrame: 980 },
  { text: "ቀጣዩ STEP", startFrame: 982, endFrame: 1035 },
  { text: "ስሜቱ ይጠፋል", startFrame: 1036, endFrame: 1080 },
  { text: "PROGRESS አችሁ ይቆማል!", startFrame: 1081, endFrame: 1135 }
];

export interface Subtitle {
  startFrame: number;
  endFrame: number;
  text: string;
}

export const subtitleData: Subtitle[] = [
  // 0:00 - 0:01 (0 - 40)
  { startFrame: 0, endFrame: 40, text: "EDITOR ዎች" },
  
  // 0:01 - 0:02 (41 - 70)
  { startFrame: 41, endFrame: 70, text: "TUTORIAL ይወዳሉ" },

  // 0:02 - 0:03 (71 - 105)
  { startFrame: 71, endFrame: 105, text: "ሳይለማመዱ መዋል" },

  // 0:03 - 0:06 (106 - 185) -> ይበልጥ ትርጉም ያላቸው ቃላት ብቻ
  { startFrame: 106, endFrame: 145, text: "እድገትም ሆነ" },
  { startFrame: 146, endFrame: 185, text: "ገንዘብ አያመጣም" },

  // 0:06 - 0:07 (186 - 235)
  { startFrame: 186, endFrame: 210, text: "አንድ VIDEO" },
  { startFrame: 211, endFrame: 235, text: "EDIT ማድረግ" },

  // 0:07 - 0:10 (236 - 300)
  { startFrame: 236, endFrame: 268, text: "20 TUTORIAL" },
  { startFrame: 269, endFrame: 300, text: "ይበልጣል" },

  // 0:10 - 0:12 (301 - 380)
  { startFrame: 301, endFrame: 340, text: "አሁኑኑ ተነሱ" },
  { startFrame: 341, endFrame: 380, text: "EDIT ጀምሩ" },

  // 0:12 - 0:14 (381 - 438)
  { startFrame: 381, endFrame: 438, text: "RAW VIDEO" },

];

import OnlineWorkBroll from './broll/OnlineWorkBroll';
import EditingTimelineBroll from './broll/EditingTimelineBroll';
import SocialMediaScrollBroll from './broll/SocialMediaScrollBroll';
import GlobalClientsBroll from './broll/GlobalClientsBroll';
import PracticalEditingBroll from './broll/PracticalEditingBroll';
import TelegramScreenRecordBroll from './broll/TelegramScreenRecordBroll';
import PdfCoverAnimationBroll from './broll/PdfCoverAnimationBroll';
import TypingCommentBroll from './broll/TypingCommentBroll';

export const videoData = {
  title: "Rofi",
  showVideo: true,
  mainVideo: require("./Rofi.mp4"),
  brolls: [
    { component: OnlineWorkBroll, startFrame: 150, endFrame: 262 },
    { component: EditingTimelineBroll, startFrame: 300, endFrame: 350 },
    { component: SocialMediaScrollBroll, startFrame: 525, endFrame: 646 },
    { component: GlobalClientsBroll, startFrame: 1030, endFrame: 1130 },
    { component: PracticalEditingBroll, startFrame: 1250, endFrame: 1390 },
    { component: TelegramScreenRecordBroll, startFrame: 1590, endFrame: 1765 },
    { component: PdfCoverAnimationBroll, startFrame: 1790, endFrame: 1846 },
    { component: TypingCommentBroll, startFrame: 1890, endFrame: 1950 }
  ],
  subtitles: [
    { text: "በወር ተጨማሪ 20 ሺህ ብር እንኳን", startFrame: 0, endFrame: 35 },
    { text: "የማታገኙ ከሆነ", startFrame: 35, endFrame: 55 },
    { text: "30 seconds ብቻ ስጡኝና አናስተካክለው።", startFrame: 55, endFrame: 112 },
    { text: "በወር ተጨማሪ ገንዘቦችን ለመስራት", startFrame: 112, endFrame: 150 },
    { text: "በዚህ ዘመን መጠቀም ያለባችሁ", startFrame: 150, endFrame: 187 },
    { text: "online ላይ ያሉ ስራዎችን ነው።", startFrame: 187, endFrame: 212 },
    { text: "ለእሱ ደግሞ የተለያዩ ስራዎች አሉ።", startFrame: 212, endFrame: 262 },
    { text: "ከእነዚህ ስራዎች መካከል ደግሞ", startFrame: 262, endFrame: 300 },
    { text: "ከላይ የሚቀመጠው Video Editing ነው።", startFrame: 300, endFrame: 350 },
    { text: "ቆይ እዚህ ጋር አንድ ጥያቄ ልጠይቃችሁ።", startFrame: 350, endFrame: 400 },
    { text: "ዛሬ ምን ያህል videos ተመልክታችኋል?", startFrame: 400, endFrame: 450 },
    { text: "10፣ 20፣ 50?", startFrame: 450, endFrame: 487 },
    { text: "መልሱን ለእናንተ ልተወውና፣", startFrame: 487, endFrame: 525 },
    { text: "እነዛ ሁላ videos", startFrame: 525, endFrame: 550 },
    { text: "ያለ Video Editor አልተሰሩም።", startFrame: 550, endFrame: 587 },
    { text: "ከዚህም በኋላም ደግሞ", startFrame: 587, endFrame: 616 },
    { text: "በጣም ብዙ videos ይሰራሉ፣", startFrame: 616, endFrame: 646 },
    { text: "ይህ ማለት ደግሞ Video Editors", startFrame: 646, endFrame: 693 },
    { text: "የበለጠ ተፈላጊ እየሆኑ ይመጣሉ ማለት ነው።", startFrame: 693, endFrame: 745 },
    { text: "እናንተም ከእነሱ መካከል እንድትሆኑ በማሰብ", startFrame: 745, endFrame: 797},
    { text: "እኛ Rofi Edits ለእናንተ", startFrame:797, endFrame: 850 },
    { text: "የ Video Editing program አዘጋጅተንላችኋል።", startFrame: 850, endFrame: 912 },
    { text: "በዚህ program ከዜሮ ጀምራችሁ", startFrame: 912, endFrame: 945 },
    { text: "እንዴት በ Video Editing", startFrame: 945, endFrame: 970 },
    { text: "clients ማግኘት እንደምትችሉ ትማሩበታላችሁ።", startFrame: 970, endFrame: 1030 },
    { text: "እኛ ላለፉት አራት አመታት", startFrame: 1030, endFrame: 1060 },
    { text: "ከተለያዩ ከአገር ውስጥ", startFrame: 1060, endFrame: 1090 },
    { text: "እንዲሁም ደግሞ ከውጭ አገር clients ጋር ስንሰራ", startFrame: 1090, endFrame: 1130 },
    { text: "የተማርናቸውን ነገሮች በሙሉ", startFrame: 1130, endFrame: 1165 },
    { text: "በዚህ program ላይ እንሰጣችኋለን።", startFrame: 1167, endFrame: 1200 },
    { text: "በዚህ program ላይ theory ሳይሆን የምትማሩት", startFrame: 1200, endFrame: 1250 },
    { text: "የተለያዩ assignments እየሰጠናችሁ", startFrame: 1250, endFrame: 1295 },
    { text: "editing-ን practically እንድትማሩና", startFrame: 1295, endFrame: 1332 },
    { text: "በሚቀጥሉት ከ 3 እስከ 6 ወራት ውስጥ", startFrame: 1332, endFrame: 1390 },
    { text: "የራሳችሁን client ይዛችሁ መስራት የምትችሉ", startFrame: 1390, endFrame: 1440 },
    { text: "editors እንድትሆኑ እናደርጋችኋለን።", startFrame: 1440, endFrame: 1475 },
    { text: "program ሙሉ ለሙሉ የሚሰጠው በ online ነው፣", startFrame: 1475, endFrame: 1525 },
    { text: "ስለዚህ program ተጨማሪ መረጃዎችን የምትፈልጉ ከሆነ", startFrame: 1525, endFrame: 1590 },
    { text: "ከ 10 ሺህ በላይ members ያለውን", startFrame: 1590, endFrame: 1625 },
    { text: "የ Telegram ቻናላችንን check ማድረግ ትችላላችሁ።", startFrame: 1625, endFrame: 1673 },
    { text: "Telegram ላይ ሄዳችሁ", startFrame: 1673, endFrame: 1697 },
    { text: "Rofi Edits ብላችሁ search ብታደርጉ ታገኙታላችሁ።", startFrame: 1697, endFrame: 1765 },
    { text: "ከዜሮ ጀምራችሁ በ Video Editing", startFrame: 1765, endFrame: 1790 },
    { text: "እንዴት client እንደምታገኙ የሚያሳይ PDF", startFrame: 1790, endFrame: 1846 },
    { text: "በነጻ እንድለቅላችሁ የምትፈልጉ ከሆነ", startFrame: 1846, endFrame: 1890 },
    { text: "comment ላይ Video Editing ብላችሁ ጻፉልኝ፣", startFrame: 1890, endFrame: 1933 },
    { text: "ብዛታችሁን አይቼ የምለቅላችሁ ይሆናል", startFrame: 1933, endFrame: 1980 }
  ],
};

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';

// 🌟 1. የሰዎቹ ኮመንት ዝርዝር (አዳዲስ ሰዎች ተጨምረዋል)
const commentsData = [
  { id: 1, user: 'kaleab', text: 'Video Editing', likes: '373', time: '1d', color: '#525252' },
  { id: 2, user: 'Leul', text: 'Video Editing 🔥', likes: '9', time: '1d', color: '#ef4444' },
  { id: 3, user: 'ÃMAN ♑', text: 'Video Editing', likes: '8', time: '1d', color: '#3b82f6' },
  { id: 4, user: 'sami_k', text: 'Video Editing እፈልጋለሁ', likes: '0', time: '2h', color: '#10b981' },
  { id: 5, user: 'dani.tech', text: 'Video Editing', likes: '1', time: '3h', color: '#f59e0b' },
  { id: 6, user: 'biniyam', text: 'Video Editing', likes: '3', time: '4h', color: '#8b5cf6' },
  { id: 7, user: 'soliana', text: 'Video Editing 👏', likes: '3', time: '5h', color: '#ec4899' },
  { id: 8, user: 'kirubel.x', text: 'Video Editing', likes: '26', time: '6h', color: '#14b8a6' },
  { id: 9, user: 'marcus', text: 'Video Editing bro', likes: '55', time: '8h', color: '#f43f5e' },
  { id: 10, user: 'samuel_t', text: 'Video Editing', likes: '88', time: '10h', color: '#eab308' },
];

const TypingCommentBroll: React.FC = () => {
  const frame = useCurrentFrame();

  // 🌟 2. አጠቃላይ Fade In & Fade Out (ለ 60 ፍሬሞች ተስተካክሏል)
  const globalOpacity = interpolate(frame, [0, 5, 55, 60], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 🌟 3. UI ከታች ወደ ላይ ብቅ እንዲል (Bottom Sheet Animation)
  const slideUp = interpolate(frame, [0, 12], [100, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 🌟 4. ኮመንቶቹ ወደ ላይ Scroll እንዲያደርጉ (ርዝመቱ 60 ፍሬም ስለሆነ እና ሰዎች ስለጨመሩ ርቀቱ አድጓል)
  const scrollY = interpolate(frame, [10, 60], [0, -850], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    // 🌟 ጀርባውን transparent አድርገነዋል ዋናው ቪዲዮ (A-roll) በደንብ እንዲታይ
    <AbsoluteFill style={{ justifyContent: 'flex-end', backgroundColor: 'transparent', opacity: globalOpacity }}>
      
      {/* 🌟 ግማሽ ስክሪን የሚሸፍነው የ Comment UI */}
      <div
        style={{
          height: '50%', 
          width: '100%',
          backgroundColor: '#121212',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          transform: `translateY(${slideUp}%)`,
          boxShadow: '0 -10px 40px rgba(0,0,0,0.6)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        
        {/* 🌟 Header: 932 comments */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', borderBottom: '1px solid #2a2a2a' }}>
          <div style={{ width: '32px' }} />
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            932 comments 
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="21" y1="10" x2="3" y2="10"></line>
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="14" x2="3" y2="14"></line>
              <line x1="21" y1="18" x2="3" y2="18"></line>
            </svg>
          </div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        {/* 🌟 Comments List */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <div style={{ transform: `translateY(${scrollY}px)`, display: 'flex', flexDirection: 'column' }}>
            {commentsData.map((comment, index) => (
              <div key={index} style={{ display: 'flex', padding: '20px 24px', gap: '20px' }}>
                
                {/* 🌟 User Avatar */}
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: comment.color, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '32px', flexShrink: 0 }}>
                  {comment.user.charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                  {/* 🌟 Username */}
                  <div style={{ color: '#a3a3a3', fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                    {comment.user}
                  </div>
                  {/* 🌟 Comment Text */}
                  <div style={{ color: 'white', fontSize: '28px', marginBottom: '12px' }}>
                    {comment.text}
                  </div>
                  {/* 🌟 Time & Reply */}
                  <div style={{ color: '#737373', fontSize: '20px', display: 'flex', gap: '25px', fontWeight: '600' }}>
                    <span>{comment.time}</span>
                    <span>Reply</span>
                  </div>
                </div>

                {/* 🌟 Like Button */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingTop: '10px' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span style={{ color: '#a3a3a3', fontSize: '20px' }}>{comment.likes}</span>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* 🌟 Bottom Input Bar (እንዳለ ነው የተቀመጠው) */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px 20px 16px', borderTop: '1px solid #2a2a2a', gap: '12px', backgroundColor: '#181818' }}>
          
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e5e5e5', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="#a3a3a3">
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M12 14c-4.42 0-8 2.69-8 6v1h16v-1c0-3.31-3.58-6-8-6z"></path>
            </svg>
          </div>
          
          {/* መጻፊያ ሳጥን እና አዶዎች */}
          <div style={{ flex: 1, backgroundColor: '#2a2a2a', borderRadius: '25px', padding: '10px 16px', color: '#a3a3a3', fontSize: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Add comment...</span>
            
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', color: '#a3a3a3' }}>
              
              {/* Image / Gallery Icon */}
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>

              {/* Emoji / Sticker Icon */}
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>

              {/* @ Mention Icon */}
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
              </svg>

            </div>
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};

export default TypingCommentBroll;

import React, { useState, useRef, useEffect } from 'react';

const LinkedInMockup = ({ hook, draft }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const textRef = useRef(null);
  
  // Combine hook and draft
  const fullContent = `${hook ? hook + '\n\n' : ''}${draft}`;
  
  // Check if content needs truncation (more than ~3 lines or ~200 chars)
  useEffect(() => {
    if (textRef.current) {
      // Rough approximation for LinkedIn's "See more" triggers
      const hasManyLines = fullContent.split('\n').length > 4;
      const isLongText = fullContent.length > 210;
      
      setNeedsTruncation(hasManyLines || isLongText);
    }
  }, [fullContent]);

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      padding: '16px',
      maxWidth: '550px', // Standard LinkedIn feed width
      margin: '0 auto',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: 'var(--text-main)',
      textAlign: 'left' // Reset text alignment for the mockup
    }}>
      {/* Header Profile Area */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          backgroundImage: 'linear-gradient(135deg, var(--primary) 0%, #005582 100%)',
          marginRight: '12px',
          flexShrink: 0
        }} />
        <div>
          <div style={{ fontWeight: '600', fontSize: '14px', lineHeight: '1.2' }}>Antigravity User</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Your chosen Persona goes here • 1st</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <span>Just now • </span>
            <svg style={{ marginLeft: '4px' }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div style={{ fontSize: '14px', lineHeight: '1.5', position: 'relative' }}>
        <div 
          ref={textRef}
          style={{ 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: (!isExpanded && needsTruncation) ? '4.5em' : 'none',
            overflow: (!isExpanded && needsTruncation) ? 'hidden' : 'visible',
            // Fade out effect for truncated text
            WebkitMaskImage: (!isExpanded && needsTruncation) ? 'linear-gradient(to bottom, black 50%, transparent 100%)' : 'none',
            maskImage: (!isExpanded && needsTruncation) ? 'linear-gradient(to bottom, black 50%, transparent 100%)' : 'none',
          }}
        >
          {fullContent}
        </div>
        
        {needsTruncation && !isExpanded && (
          <button 
            onClick={() => setIsExpanded(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: '600',
              padding: '0',
              cursor: 'pointer',
              position: 'absolute',
              bottom: '0',
              right: '0',
              backgroundColor: 'var(--bg-card)', // Match background to cover text underneath
              paddingLeft: '8px'
            }}
          >
            ...see more
          </button>
        )}
      </div>

      {/* Engagement Mock Area */}
      {isExpanded && (
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '12px' }}>👍 Like</div>
          <div style={{ fontSize: '12px' }}>💬 Comment</div>
          <div style={{ fontSize: '12px' }}>🔄 Repost</div>
          <div style={{ fontSize: '12px' }}>✈️ Send</div>
        </div>
      )}
    </div>
  );
};

export default LinkedInMockup;

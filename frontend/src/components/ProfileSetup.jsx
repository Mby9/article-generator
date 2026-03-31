import React from 'react';

const ProfileSetup = ({
  userContext, setUserContext,
  tone, setTone,
  format, setFormat,
  articleLength, setArticleLength,
  onNext
}) => {
  const formats = [
    { id: 'LinkedIn Post', icon: '👔', label: 'LinkedIn Post' },
    { id: 'LinkedIn Article', icon: '📝', label: 'LinkedIn Article' },
    { id: 'Twitter Thread', icon: '🐦', label: 'Twitter Thread' },
    { id: 'Blog Post', icon: '🌐', label: 'Blog Post' },
    { id: 'Custom', icon: '⚙️', label: 'Custom' },
  ];

  return (
    <div className="card fade-in">
      <h2 className="card-title">1. Profile & Setup</h2>
      <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
        
        {/* Profile */}
        <div>
          <label className="form-label">Who are you? (Paste your About section or Resume Summary)</label>
          <textarea 
            rows="3"
            value={userContext} 
            onChange={(e) => setUserContext(e.target.value)} 
            placeholder="Your persona/background..."
          />
        </div>

        {/* Tone */}
        <div>
          <label className="form-label">Preferred Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="Professional">Professional</option>
            <option value="Conversational">Conversational</option>
            <option value="Analytical">Analytical</option>
            <option value="Encouraging">Encouraging</option>
            <option value="Witty">Witty</option>
            <option value="Sarcastic">Sarcastic</option>
          </select>
        </div>

        {/* Format Selection (Icons) */}
        <div>
          <label className="form-label">Format</label>
          <div className="format-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            {formats.map(f => (
              <div 
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={`format-card ${format === f.id || (format !== '' && !formats.find(fx => fx.id === format) && f.id === 'Custom') ? 'selected' : ''}`}
                style={{
                  padding: '16px 12px', border: '1px solid var(--border-color)', borderRadius: '12px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                  transition: 'all 0.2s', background: '#fff',
                  borderColor: (format === f.id || (!formats.find(fx => fx.id === format) && f.id === 'Custom')) ? 'var(--primary)' : 'var(--border-color)',
                  boxShadow: (format === f.id || (!formats.find(fx => fx.id === format) && f.id === 'Custom')) ? '0 0 0 1px var(--primary)' : 'none'
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{f.icon}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '500', textAlign: 'center' }}>{f.label}</div>
              </div>
            ))}
          </div>
          {(!formats.find(fx => fx.id === format) || format === 'Custom') && (
             <input 
               type="text" 
               style={{ marginTop: '12px' }}
               value={format === 'Custom' ? '' : format} 
               onChange={(e) => setFormat(e.target.value)} 
               placeholder="Enter custom format (e.g., Internal Company Memo)"
             />
          )}
        </div>

        {/* Length Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label className="form-label" style={{ margin: 0 }}>Target Draft Length</label>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>~ {articleLength} words</span>
          </div>
          <input 
            type="range" 
            min="150" max="1000" step="50"
            value={articleLength}
            onChange={(e) => setArticleLength(e.target.value)}
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>Short (150)</span>
            <span>Medium (500)</span>
            <span>Long (1000)</span>
          </div>
        </div>

      </div>
      
      <div className="actions" style={{ justifyContent: 'flex-end', marginTop: '32px' }}>
        <button className="btn" onClick={onNext} disabled={!userContext.trim()}>
          Next: Ideation
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;

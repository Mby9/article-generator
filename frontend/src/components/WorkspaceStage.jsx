import React from 'react';

const WorkspaceStage = ({
  draft, setDraft,
  feedback,
  loading,
  handleProofreadArticle,
  handleGenerateHooks,
  onBack
}) => {
  return (
    <div className="card fade-in" style={{ borderColor: 'var(--success)' }}>
      <h2 className="card-title" style={{ color: 'var(--success)' }}>3. Workspace: Edit & Refine</h2>
      <textarea 
        rows="15" 
        value={draft} 
        onChange={(e) => setDraft(e.target.value)}
        style={{ borderColor: 'var(--success)', marginBottom: '16px' }}
      />

      {feedback && (
        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary)' }}>AI Editor Feedback</h3>
            <div style={{ 
              marginLeft: 'auto', 
              backgroundColor: feedback.score >= 8 ? 'var(--success)' : feedback.score >= 5 ? '#f59e0b' : '#ef4444', 
              color: 'white', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              Impact Score: {feedback.score}/10
            </div>
          </div>
          <ul style={{ margin: 0, paddingLeft: '24px', color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.7' }}>
            {Array.isArray(feedback.feedback) ? feedback.feedback.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
            )) : <li>{feedback.feedback}</li>}
          </ul>
        </div>
      )}

      <div className="actions" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
        <button className="btn btn-secondary" onClick={onBack}>Back to Ideas</button>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleProofreadArticle}
            disabled={loading !== null || !draft.trim()}
          >
            {loading === 'proofread' || loading === 'refine' ? <div className="loader dark" /> : '✨ Auto-Improve Draft via Proofreader'}
          </button>
          <button 
            className="btn" 
            onClick={handleGenerateHooks}
            disabled={loading !== null || !draft.trim()}
          >
            {loading === 'hooks' ? <div className="loader" /> : 'Accept Draft & Generate Hooks'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceStage;

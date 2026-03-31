import React, { useState } from 'react';
import { generateRandomIdea } from '../api';

const IdeaStage = ({
  idea, setIdea,
  userContext,
  handleExpandIdeas,
  loading,
  ideasList,
  selectedIdeas,
  handleIdeaToggle,
  handleDraftArticle,
  setToast,
  onBack
}) => {

  const handleLazyIdea = async () => {
    if (!userContext.trim()) {
      setToast({ message: "Please provide 'Who are you' in Step 1 first.", type: 'warning' });
      return;
    }
    try {
      setIdea('Generating a provoked idea...');
      // Small local loading state or hijack the main one
      const res = await generateRandomIdea(userContext);
      setIdea(res.result.replace(/^"|"$|^- /g, '').trim());
      
      if (res.fallbackTriggered) {
        setToast({ message: `API Quota Exceeded. Safely downgraded to model: ${res.activeModel}`, type: 'warning' });
      }
    } catch (err) {
      setToast({ message: 'Failed to generate a random idea.', type: 'error' });
    }
  };

  return (
    <div className="fade-in">
      <div className="card">
        <h2 className="card-title">2. Raw Idea</h2>
        <textarea 
          rows="3" 
          value={idea} 
          onChange={(e) => setIdea(e.target.value)}
          placeholder="E.g., I noticed that meetings are mostly a waste of time unless there's an agenda..."
        />
        <div className="actions" style={{ justifyContent: 'space-between' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleLazyIdea}
            disabled={!userContext.trim() || loading !== null}
            title={!userContext.trim() ? "Add a persona in step 1 first" : ""}
          >
            ✨ I'm feeling lazy
          </button>
          
          <button 
            className="btn" 
            onClick={() => handleExpandIdeas(false)} 
            disabled={loading !== null || !idea.trim()}
          >
            {loading === 'ideas' && ideasList.length === 0 ? <div className="loader" /> : 'Expand Ideas'}
          </button>
        </div>
      </div>

      {ideasList.length > 0 && (
        <div className="card fade-in">
          <h2 className="card-title">Suggested Angles (Multi-select)</h2>
          <div className="ideas-grid">
            {ideasList.map((idealm, idx) => (
              <div 
                key={idx} 
                className={`idea-card ${selectedIdeas.includes(idealm) ? 'selected' : ''}`}
                onClick={() => handleIdeaToggle(idealm)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>Angle {idx + 1}</span>
                  <input 
                    type="checkbox" 
                    className="angle-radio"
                    checked={selectedIdeas.includes(idealm)} 
                    onChange={() => {}} // Handled by parent div
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="angle-text">{idealm}</div>
              </div>
            ))}
          </div>
          
          <div className="actions" style={{ justifyContent: 'space-between', marginTop: '24px' }}>
            <button className="btn btn-secondary" onClick={onBack}>Back to Setup</button>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => handleExpandIdeas(true)} 
                disabled={loading !== null || !idea.trim()}
              >
                {loading === 'ideas' && ideasList.length > 0 ? <div className="loader dark" /> : 'Generate More'}
              </button>
              <button 
                className="btn" 
                onClick={handleDraftArticle} 
                disabled={loading !== null || selectedIdeas.length === 0}
              >
                {loading === 'draft' ? <div className="loader" /> : 'Draft Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaStage;

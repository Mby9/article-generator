import React from 'react';
import LinkedInMockup from './LinkedInMockup';

const FinalStage = ({
  draft,
  hooksList, setHooksList,
  selectedHook, setSelectedHook,
  copyToClipboard,
  downloadTxt,
  onReset,
  onBackToEditor
}) => {
  return (
    <div className="fade-in">
      {hooksList.length > 0 && !selectedHook && (
        <div className="card">
          <h2 className="card-title">4. Choose a Hook framework</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Select the hook that best catches attention on the feed to finalize your article.</p>
          <div className="angles-list">
            {hooksList.map((hl, idx) => (
              <div 
                key={idx} 
                className="angle-item"
                onClick={() => setSelectedHook(hl)}
                style={{ cursor: 'pointer' }}
              >
                <div className="angle-text" style={{ fontWeight: '600' }}>{hl}</div>
              </div>
            ))}
          </div>
          <div className="actions" style={{ marginTop: '24px' }}>
             <button className="btn btn-secondary" onClick={onBackToEditor}>
               Back to Editor
             </button>
          </div>
        </div>
      )}

      {selectedHook && (
        <div className="card fade-in" style={{ border: '2px solid var(--primary)', backgroundColor: 'transparent' }}>
          <h2 className="card-title">5. Final Review</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', textAlign: 'center' }}>Here is how your post will look in the LinkedIn feed.</p>
          
          <LinkedInMockup hook={selectedHook} draft={draft} />
          
          <div className="actions" style={{ marginTop: '32px', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setSelectedHook(null)}>
               Change Hook
             </button>
            <button className="btn btn-success" onClick={() => copyToClipboard(`${selectedHook}\n\n${draft}`)}>
              Copy to Clipboard
            </button>
            <button className="btn" onClick={() => downloadTxt(`${selectedHook}\n\n${draft}`)}>
              Download .txt
            </button>
            <button className="btn btn-secondary" onClick={onReset} style={{ marginLeft: 'auto' }}>
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalStage;

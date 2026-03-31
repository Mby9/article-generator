import React, { useState, useEffect } from 'react';
import { expandIdeas, draftArticle, refineArticle, proofreadArticle, generateHooks } from './api';
import './index.css';

// Components
import ProgressBar from './components/ProgressBar';
import ProfileSetup from './components/ProfileSetup';
import IdeaStage from './components/IdeaStage';
import WorkspaceStage from './components/WorkspaceStage';
import FinalStage from './components/FinalStage';
import Toast from './components/Toast';

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  // Profile / Setup State (Persisted)
  const [userContext, setUserContext] = useState(() => localStorage.getItem('userContext') || '');
  const [tone, setTone] = useState(() => localStorage.getItem('tone') || 'Professional');
  const [format, setFormat] = useState(() => localStorage.getItem('format') || 'LinkedIn Post');
  const [articleLength, setArticleLength] = useState(() => localStorage.getItem('articleLength') || '300');
  
  // Theme State
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6; // Default dark between 6pm and 6am
  });
  
  // Ideation State
  const [idea, setIdea] = useState('');
  const [ideasList, setIdeasList] = useState([]);
  const [selectedIdeas, setSelectedIdeas] = useState([]);
  
  // Workspace State
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState(null);
  
  // Final Stage State
  const [hooksList, setHooksList] = useState([]);
  const [selectedHook, setSelectedHook] = useState(null);
  
  const [loading, setLoading] = useState(null); // 'ideas', 'draft', 'refine', 'proofread', 'hooks'
  
  // Toast State
  const [toast, setToast] = useState(null); // { message, type }

  // Persist setup config to localStorage
  useEffect(() => {
    localStorage.setItem('userContext', userContext);
    localStorage.setItem('tone', tone);
    localStorage.setItem('format', format);
    localStorage.setItem('articleLength', articleLength);
  }, [userContext, tone, format, articleLength]);

  // Apply Theme
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isDark]);

  // Invalidate downstream state when upstream inputs change to prevent stale data
  useEffect(() => {
    setIdeasList([]);
    setSelectedIdeas([]);
    setDraft('');
    setFeedback(null);
    setHooksList([]);
    setSelectedHook(null);
  }, [userContext, tone, format, articleLength]);

  const parseIdeas = (text) => {
    const lines = text.split('\n');
    const parsed = [];
    lines.forEach(line => {
      let cleanLine = line.trim();
      const numMatch = cleanLine.match(/^\d+\.\s*(.*)/);
      if (numMatch && numMatch[1]) cleanLine = numMatch[1];
      else if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) cleanLine = cleanLine.substring(2).trim();
      cleanLine = cleanLine.replace(/\*\*/g, '').replace(/__/g, '');
      if (cleanLine.length > 5) parsed.push(cleanLine);
    });
    return parsed.length > 0 ? parsed : [text];
  };

  const handleExpandIdeas = async (append = false) => {
    if (!idea.trim()) return;
    setLoading('ideas');
    
    try {
      if (!append) {
        setIdeasList([]);
        setSelectedIdeas([]);
      }
      const res = await expandIdeas(idea, userContext, tone, format);
      const newIdeas = parseIdeas(res.result);
      if (append) {
        setIdeasList(prev => [...prev, ...newIdeas]);
      } else {
        setIdeasList(newIdeas);
      }
      if (res.fallbackTriggered) {
        setToast({ message: `API Quota Exceeded. Safely downgraded to model: ${res.activeModel}`, type: 'warning' });
      }
    } catch (err) {
      setToast({ message: 'Failed to generate ideas. Please try again.', type: 'error' });
    } finally {
      setLoading(null);
    }
  };

  const handleIdeaToggle = (idealm) => {
    setSelectedIdeas(prev => 
      prev.includes(idealm) ? prev.filter(i => i !== idealm) : [...prev, idealm]
    );
  };

  const handleDraftArticle = async () => {
    if (selectedIdeas.length === 0) return;
    setLoading('draft');
    
    try {
      const combinedIdeas = selectedIdeas.map(i => '- ' + i).join('\n\n');
      const res = await draftArticle(combinedIdeas, userContext, tone, format, articleLength);
      setDraft(res.result);
      setFeedback(null);
      setCurrentStep(3); // Move to workspace

      if (res.fallbackTriggered) {
        setToast({ message: `API Quota Exceeded. Safely downgraded to model: ${res.activeModel}`, type: 'warning' });
      }
    } catch (err) {
      setToast({ message: 'Failed to draft article.', type: 'error' });
    } finally {
      setLoading(null);
    }
  };

  // We still keep refine logic around for the auto-apply
  const handleRefineArticle = async (draftToRefine, autoInstructions) => {
    setLoading('refine');
    try {
      const res = await refineArticle(draftToRefine, userContext, tone, autoInstructions, format, articleLength);
      setDraft(res.result);
      if (res.fallbackTriggered) {
        setToast({ message: `API Quota Exceeded. Safely downgraded to model: ${res.activeModel}`, type: 'warning' });
      }
    } catch (err) {
      setToast({ message: 'Failed to refine article.', type: 'error' });
    } finally {
      setLoading(null);
    }
  };

  const handleProofreadArticle = async () => {
    if (!draft.trim()) return;
    setLoading('proofread');
    setFeedback(null);

    try {
      const res = await proofreadArticle(draft);
      setFeedback(res);
      
      // Auto-Apply Polish logic
      if (res && res.feedback) {
        setToast({ message: 'Score received. Auto-improving draft based on feedback...', type: 'info' });
        const autoInstructions = "Address the following feedback to improve the draft strictly: " + (Array.isArray(res.feedback) ? res.feedback.join(' ') : res.feedback);
        await handleRefineArticle(draft, autoInstructions);
      }
      
    } catch (err) {
      setLoading(null);
      setToast({ message: 'Failed to proofread article.', type: 'error' });
    }
  };

  const handleGenerateHooks = async () => {
    if (!draft.trim()) return;
    setLoading('hooks');
    
    try {
      const res = await generateHooks(draft, userContext, format);
      setHooksList(parseIdeas(res.result));
      setCurrentStep(4);
      if (res.fallbackTriggered) {
        setToast({ message: `API Quota Exceeded. Safely downgraded to model: ${res.activeModel}`, type: 'warning' });
      }
    } catch (err) {
      setToast({ message: 'Failed to generate hooks.', type: 'error' });
    } finally {
      setLoading(null);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy text.');
    }
  };

  const downloadTxt = (text) => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "draft-article.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setIdea('');
    setIdeasList([]);
    setSelectedIdeas([]);
    setDraft('');
    setFeedback(null);
    setHooksList([]);
    setSelectedHook(null);
    setCurrentStep(1);
  };

  return (
    <div className="app-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <button 
        className="theme-toggle-btn"
        onClick={() => setIsDark(!isDark)}
      >
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>

      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '8px' }}>Antigravity Copywriter</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Turn raw ideas into engaging, professional posts</p>
      </header>

      <ProgressBar currentStep={currentStep} />

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        {currentStep === 1 && (
          <ProfileSetup 
            userContext={userContext} setUserContext={setUserContext}
            tone={tone} setTone={setTone}
            format={format} setFormat={setFormat}
            articleLength={articleLength} setArticleLength={setArticleLength}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <IdeaStage 
            idea={idea} setIdea={setIdea}
            userContext={userContext}
            handleExpandIdeas={handleExpandIdeas}
            loading={loading}
            ideasList={ideasList}
            selectedIdeas={selectedIdeas}
            handleIdeaToggle={handleIdeaToggle}
            handleDraftArticle={handleDraftArticle}
            setToast={setToast}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <WorkspaceStage 
            draft={draft} setDraft={setDraft}
            feedback={feedback}
            loading={loading}
            isRefining={loading === 'refine'}
            handleProofreadArticle={handleProofreadArticle}
            handleGenerateHooks={handleGenerateHooks}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {(currentStep === 4 || currentStep === 5) && (
          <FinalStage 
            draft={draft}
            hooksList={hooksList} setHooksList={setHooksList}
            selectedHook={selectedHook} setSelectedHook={(hl) => { setSelectedHook(hl); setCurrentStep(5); }}
            copyToClipboard={copyToClipboard}
            downloadTxt={downloadTxt}
            onReset={handleReset}
            onBackToEditor={() => setCurrentStep(3)}
          />
        )}
      </main>

      <Toast 
        message={toast?.message} 
        type={toast?.type} 
        onClose={() => setToast(null)} 
      />
    </div>
  );
}

export default App;

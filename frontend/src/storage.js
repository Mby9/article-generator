const STORAGE_KEY = 'linkedin_article_drafts';

export const saveDraft = (draft) => {
    const drafts = getDrafts();
    const newDraft = {
        id: Date.now().toString(),
        content: draft,
        timestamp: new Date().toISOString()
    };
    drafts.unshift(newDraft);
    // Keep only last 10 to protect local storage limits
    if (drafts.length > 10) drafts.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    return drafts;
};

export const getDrafts = () => {
    const drafts = localStorage.getItem(STORAGE_KEY);
    return drafts ? JSON.parse(drafts) : [];
};

export const clearDrafts = () => {
    localStorage.removeItem(STORAGE_KEY);
    return [];
};

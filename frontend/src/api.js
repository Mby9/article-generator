const API_BASE_URL = 'http://localhost:8080/api';

export const expandIdeas = async (idea, userContext, tone, format) => {
    const response = await fetch(`${API_BASE_URL}/expand-ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, userContext, tone, format })
    });
    if (!response.ok) throw new Error('Failed to expand ideas');
    return response.json();
};

export const generateRandomIdea = async (userContext) => {
    const response = await fetch(`${API_BASE_URL}/generate-random-idea`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userContext })
    });
    if (!response.ok) throw new Error('Failed to generate random idea');
    return response.json();
};

export const draftArticle = async (angle, userContext, tone, format, articleLength) => {
    const res = await fetch(`${API_BASE_URL}/draft-article`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ angle, userContext, tone, format, articleLength })
    });
    return res.json();
};

export const refineArticle = async (draft, userContext, tone, instructions, format, articleLength) => {
    const res = await fetch(`${API_BASE_URL}/refine-article`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft, userContext, tone, instructions, format, articleLength })
    });
    return res.json();
};

export const proofreadArticle = async (draft) => {
    const response = await fetch(`${API_BASE_URL}/proofread-article`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft })
    });
    if (!response.ok) throw new Error('Failed to proofread article');
    return response.json();
};

export const generateHooks = async (draft, userContext, format) => {
    const res = await fetch(`${API_BASE_URL}/generate-hooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft, userContext, format })
    });
    return res.json();
};

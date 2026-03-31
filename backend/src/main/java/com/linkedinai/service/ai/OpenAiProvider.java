package com.linkedinai.service.ai;

import org.springframework.stereotype.Service;

/**
 * Stub implementation for OpenAI's API.
 * OpenAI uses the same /v1/chat/completions schema as OpenRouter,
 * so implementing this will be straightforward when needed.
 *
 * Required config (when implemented):
 *   openai.api.key  - your OpenAI API key (env: OPENAI_API_KEY)
 *   openai.model    - model slug, e.g. gpt-4o
 */
@Service
public class OpenAiProvider implements AiProvider {

    @Override
    public String getName() {
        return "openai";
    }

    @Override
    public GenerationResult generate(String prompt) {
        throw new UnsupportedOperationException(
            "OpenAI provider is not yet implemented. " +
            "Set ai.provider=gemini or ai.provider=openrouter to use an active provider."
        );
    }
}

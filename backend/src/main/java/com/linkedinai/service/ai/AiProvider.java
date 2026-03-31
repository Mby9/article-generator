package com.linkedinai.service.ai;

/**
 * Common contract for all AI provider implementations.
 * Add a new provider by creating a @Service that implements this interface
 * and registering its name in AiProviderFactory.
 */
public interface AiProvider {

    /**
     * Send a plain-text prompt to the AI provider and return the generated result.
     *
     * @param prompt the full prompt string
     * @return a GenerationResult containing the generated text and metadata
     */
    GenerationResult generate(String prompt);

    /**
     * The canonical name used to select this provider via config or request override.
     * Must match the value used in {@code ai.provider} property and DTO {@code provider} field.
     * Example: "gemini", "openrouter", "openai"
     */
    String getName();
}

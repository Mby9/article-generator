package com.linkedinai.service.ai;

/**
 * Shared result record returned by all AI provider implementations.
 * Previously an inner class of GeminiService; moved here so all providers share the same type.
 */
public record GenerationResult(String text, boolean fallbackTriggered, String activeModel) {}

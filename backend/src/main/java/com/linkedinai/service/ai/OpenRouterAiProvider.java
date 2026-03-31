package com.linkedinai.service.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * AI provider implementation that routes requests to OpenRouter.
 * OpenRouter exposes an OpenAI-compatible /v1/chat/completions endpoint,
 * so no new HTTP client dependencies are needed — we reuse RestTemplate.
 *
 * Configuration (application.properties):
 *   openrouter.api.key  - your OpenRouter API key (env: OPENROUTER_API_KEY)
 *   openrouter.api.url  - base URL, e.g. https://openrouter.ai/api/v1
 *   openrouter.model    - model slug, e.g. openai/gpt-4o-mini
 */
@Service
public class OpenRouterAiProvider implements AiProvider {

    @Value("${openrouter.api.key:}")
    private String apiKey;

    @Value("${openrouter.api.url:https://openrouter.ai/api/v1}")
    private String apiUrl;

    @Value("${openrouter.model:openai/gpt-4o-mini}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String getName() {
        return "openrouter";
    }

    @Override
    public GenerationResult generate(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("OpenRouter API key is not configured. Set OPENROUTER_API_KEY environment variable.");
        }

        String endpoint = apiUrl + "/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        // OpenRouter recommends passing site info headers for ranking / rate-limit tracking
        headers.set("HTTP-Referer", "https://linkedin-article-generator");
        headers.set("X-Title", "LinkedIn Article Generator");

        // OpenAI-compatible request body
        Map<String, Object> requestBody = Map.of(
            "model", model,
            "messages", List.of(
                Map.of("role", "user", "content", prompt)
            )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(endpoint, entity, Map.class);

            if (response == null) {
                throw new RuntimeException("OpenRouter returned an empty response.");
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new RuntimeException("OpenRouter response contained no choices.");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String text = (String) message.get("content");

            System.out.println("[OpenRouter] Used model: " + model);
            return new GenerationResult(text, false, model);

        } catch (HttpClientErrorException.TooManyRequests e) {
            System.err.println("[OpenRouter] 429 Too Many Requests on model: " + model);
            throw new RuntimeException("OpenRouter rate limit exceeded. Please try again later or switch to a different model.", e);
        } catch (HttpClientErrorException e) {
            System.err.println("[OpenRouter] HTTP error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new RuntimeException("OpenRouter API error: " + e.getMessage(), e);
        } catch (Exception e) {
            System.err.println("[OpenRouter] Error: " + e.getMessage());
            throw new RuntimeException("Error calling OpenRouter API: " + e.getMessage(), e);
        }
    }
}

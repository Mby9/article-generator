package com.linkedinai.controller;

import com.linkedinai.dto.AngleRequest;
import com.linkedinai.dto.DraftRequest;
import com.linkedinai.dto.IdeaRequest;
import com.linkedinai.dto.HeadlineRequest;
import com.linkedinai.dto.LazyIdeaRequest;
import com.linkedinai.dto.ScoreResponse;
import com.linkedinai.service.GeminiService;
import com.linkedinai.service.ai.AiProvider;
import com.linkedinai.service.ai.AiProviderFactory;
import com.linkedinai.service.ai.GenerationResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for all article generation endpoints.
 *
 * Design:
 *   - GeminiService is still injected for its prompt-building methods (expandIdeas, draftArticle, etc.)
 *     These methods are purely about constructing the right prompt string — no provider-specific logic.
 *   - AiProviderFactory resolves which provider actually executes each prompt, based on the
 *     application-level default (ai.provider) or an optional per-request "provider" field in the body.
 *
 * Adding a new AI provider:
 *   1. Create a @Service implementing AiProvider with a unique getName().
 *   2. Set ai.provider=<name> in application.properties, or pass "provider": "<name>" in request body.
 *   3. No changes to this controller are required.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // For local development allow any
public class ArticleController {

    private final GeminiService geminiService;
    private final AiProviderFactory providerFactory;

    @Autowired
    public ArticleController(GeminiService geminiService, AiProviderFactory providerFactory) {
        this.geminiService = geminiService;
        this.providerFactory = providerFactory;
    }

    /** Helper: builds a response map from a GenerationResult */
    private Map<String, Object> toResponseMap(GenerationResult res) {
        Map<String, Object> map = new HashMap<>();
        map.put("result", res.text());
        map.put("fallbackTriggered", res.fallbackTriggered());
        map.put("activeModel", res.activeModel());
        return map;
    }

    @PostMapping("/expand-ideas")
    public Map<String, Object> expandIdeas(@RequestBody IdeaRequest request) {
        AiProvider provider = providerFactory.getProvider(request.provider());
        String prompt = geminiService.buildExpandIdeasPrompt(request.idea(), request.userContext(), request.tone(), request.format());
        return toResponseMap(provider.generate(prompt));
    }

    @PostMapping("/generate-random-idea")
    public Map<String, Object> generateRandomIdea(@RequestBody LazyIdeaRequest request) {
        AiProvider provider = providerFactory.getProvider(request.provider());
        String prompt = geminiService.buildRandomIdeaPrompt(request.userContext());
        return toResponseMap(provider.generate(prompt));
    }

    @PostMapping("/draft-article")
    public Map<String, Object> draftArticle(@RequestBody AngleRequest request) {
        AiProvider provider = providerFactory.getProvider(request.provider());
        String prompt = geminiService.buildDraftArticlePrompt(request.angle(), request.userContext(), request.tone(), request.format(), request.articleLength());
        return toResponseMap(provider.generate(prompt));
    }

    @PostMapping("/refine-article")
    public Map<String, Object> refineArticle(@RequestBody DraftRequest request) {
        AiProvider provider = providerFactory.getProvider(request.provider());
        String prompt = geminiService.buildRefineArticlePrompt(request.draft(), request.userContext(), request.tone(), request.instructions(), request.format(), request.articleLength());
        return toResponseMap(provider.generate(prompt));
    }

    @PostMapping("/generate-hooks")
    public Map<String, Object> generateHooks(@RequestBody HeadlineRequest request) {
        AiProvider provider = providerFactory.getProvider(request.provider());
        String prompt = geminiService.buildGenerateHooksPrompt(request.draft(), request.userContext(), request.format());
        return toResponseMap(provider.generate(prompt));
    }

    @PostMapping("/proofread-article")
    public Map<String, Object> proofreadArticle(@RequestBody DraftRequest request) {
        AiProvider provider = providerFactory.getProvider(request.provider());
        String prompt = geminiService.buildProofreadPrompt(request.draft());
        GenerationResult res = provider.generate(prompt);
        Map<String, Object> map = new HashMap<>();

        try {
            ObjectMapper mapper = new ObjectMapper();
            ScoreResponse scoreResponse = mapper.readValue(res.text(), ScoreResponse.class);
            map.put("score", scoreResponse.score());
            map.put("feedback", scoreResponse.feedback());
        } catch (Exception e) {
            map.put("score", 0);
            map.put("feedback", java.util.List.of("Error parsing AI feedback payload.", res.text()));
        }

        map.put("fallbackTriggered", res.fallbackTriggered());
        map.put("activeModel", res.activeModel());
        return map;
    }
}

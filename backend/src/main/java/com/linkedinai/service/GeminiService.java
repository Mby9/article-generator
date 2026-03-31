package com.linkedinai.service;

import com.linkedinai.dto.GeminiRequest;
import com.linkedinai.dto.GeminiResponse;
import com.linkedinai.service.ai.AiProvider;
import com.linkedinai.service.ai.GenerationResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

@Service
public class GeminiService implements AiProvider {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private final List<String> fallbackModels = List.of(
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-3.1-flash-lite-preview"
    );
    private int currentModelIndex = 0;

    @Override
    public String getName() {
        return "gemini";
    }

    public GenerationResult generate(String prompt) {
        return attemptGeneration(prompt, 0, currentModelIndex);
    }

    private GenerationResult attemptGeneration(String prompt, int retryCount, int initialModelIndex) {
        // If we exhausted all fallback models for this specific request tree, fail outright
        if (retryCount >= fallbackModels.size()) {
            throw new RuntimeException("Failed to generate content from AI. All fallback models exhausted. Please try again later.");
        }

        // Construct dynamic URL based on the current active model in the rotation
        String activeModel = fallbackModels.get(currentModelIndex);
        String dynamicUrl = "https://generativelanguage.googleapis.com/v1beta/models/" + activeModel + ":generateContent?key=" + apiKey;

        System.out.println("Using model: " + activeModel + " -> " + dynamicUrl);
        GeminiRequest.Part part = new GeminiRequest.Part(prompt);
        GeminiRequest.Content content = new GeminiRequest.Content(List.of(part));
        GeminiRequest request = new GeminiRequest(List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<GeminiRequest> entity = new HttpEntity<>(request, headers);

        try {
            GeminiResponse response = restTemplate.postForObject(dynamicUrl, entity, GeminiResponse.class);
            if (response != null && response.candidates() != null && !response.candidates().isEmpty()) {
                // If it succeeds, optionally we could reset 'currentModelIndex = 0' here if we wanted 
                // to aggressively ping 2.5 flash again next time, but leaving it ensures we stay downgraded 
                // until restart or manual intervention to save time per-request.
                String text = response.candidates().get(0).content().parts().get(0).text();
                boolean fallbackTriggered = (currentModelIndex > initialModelIndex) || (currentModelIndex > 0);
                return new GenerationResult(text, fallbackTriggered, activeModel);
            }
            throw new RuntimeException("Failed to generate content from AI. Response was empty.");
        } catch (HttpClientErrorException.TooManyRequests e) {
            System.err.println("Hit 429 Quota Exceeded on " + activeModel + ". Downgrading model...");
            
            // Advance the global model index so subsequent calls use the cheaper/free-er model
            if (currentModelIndex < fallbackModels.size() - 1) {
                currentModelIndex++;
            }
            // Recursively retry
            return attemptGeneration(prompt, retryCount + 1, initialModelIndex);
        } catch (Exception e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            throw new RuntimeException("Error calling Gemini API: " + e.getMessage(), e);
        }
    }

    private String buildContextPrompt(String userContext, String tone) {
        StringBuilder sb = new StringBuilder();
        if (userContext != null && !userContext.isBlank()) {
            sb.append("The user's persona/background is: ").append(userContext).append(". ");
        }
        if (tone != null && !tone.isBlank()) {
            sb.append("The tone of the writing should be: ").append(tone).append(". ");
        }
        return sb.toString();
    }

    public String buildRandomIdeaPrompt(String userContext) {
        String contextPrompt = buildContextPrompt(userContext, null);
        return "You are an expert copywriter. " + contextPrompt + "Given the following user context, generate one highly engaging, somewhat provocative and counter-intuitive idea or angle for a compelling LinkedIn post or article. "
                + "Do NOT write the article, just the core thesis or 'hot take'. "
                + "CRITICAL: Return ONLY raw text, no numbers, no bullets, no markdown. Maximum 2 sentences.";
    }

    public GenerationResult generateRandomIdea(String userContext) {
        return generate(buildRandomIdeaPrompt(userContext));
    }

    public String buildExpandIdeasPrompt(String idea, String userContext, String tone, String format) {
        String contextPrompt = buildContextPrompt(userContext, tone);
        String formatString = (format != null && !format.isBlank()) ? format : "LinkedIn post";
        return "You are an expert copywriter. " + contextPrompt + "Given the following raw idea, generate 3 to 5 distinct, expanded paragraph-length ideas or detailed outlines that can be used to write a compelling " + formatString + ". "
                + "Provide exactly 1-2 very short sentences instead of dense paragraphs so it fits easily in a compact UI card. "
                + "CRITICAL: Output MUST be a strictly numbered list starting with '1. ', '2. ', etc. Do NOT use any markdown bolding (**), italics, or hyphens (-). Just pure text for the lists. Here is the raw idea:\n\n"
                + idea;
    }

    public GenerationResult expandIdeas(String idea, String userContext, String tone, String format) {
        return generate(buildExpandIdeasPrompt(idea, userContext, tone, format));
    }

    public String buildDraftArticlePrompt(String ideas, String userContext, String tone, String format, String length) {
        String contextPrompt = buildContextPrompt(userContext, tone);
        String formatString = (format != null && !format.isBlank()) ? format : "LinkedIn post";
        String lengthPrompt = buildLengthPrompt(length);
        return "You are an expert content creator. " + contextPrompt + "Write a professional, engaging first draft for a " + formatString + " using the following detailed outline/idea." + lengthPrompt + " Make it sound authentic, readable, and professional but relatable. CRITICAL: Do NOT include any conversational filler, greetings, or introductory phrases like 'Here is your draft'. "
                + "CRITICAL FORMATTING: You MUST use high-quality whitespace. Add a double line break (blank line) after every 1 to 2 sentences to make it highly scannable for social media feeds.\n\n"
                + "Output ONLY the final text.\n\n"
                + "Ideas to include:\n" + ideas;
    }

    public GenerationResult draftArticle(String ideas, String userContext, String tone, String format, String length) {
        return generate(buildDraftArticlePrompt(ideas, userContext, tone, format, length));
    }

    public String buildRefineArticlePrompt(String draft, String userContext, String tone, String instructions, String format, String length) {
        String contextPrompt = buildContextPrompt(userContext, tone);
        String formatString = (format != null && !format.isBlank()) ? format : "LinkedIn post";
        String lengthPrompt = buildLengthPrompt(length);
        String instructionPrompt = (instructions != null && !instructions.isBlank()) ? " Also, follow these specific instructions from the user: " + instructions + " " : "";
        return "You are an expert editor. " + contextPrompt + instructionPrompt + "Review the following draft " + formatString + ". Refine it for maximum clarity, engagement, and flow." + lengthPrompt + " Additionally, provide 3-5 relevant hashtags at the bottom. CRITICAL: Do NOT include any conversational filler, greetings, or introductory phrases like 'Here is your refined article'. Do NOT write a title. "
                + "Original Draft:\n" + draft + "\n\n"
                + "Instructions:\n" + instructions;
    }

    public GenerationResult refineArticle(String draft, String userContext, String tone, String instructions, String format, String length) {
        return generate(buildRefineArticlePrompt(draft, userContext, tone, instructions, format, length));
    }

    public String buildGenerateHooksPrompt(String draft, String userContext, String format) {
        String formatString = (format != null && !format.isBlank()) ? format : "LinkedIn post";
        return "You are an expert copywriter. Analyze the following " + formatString + " and generate 3 highly engaging, scroll-stopping 'Hooks' (the first 1-2 lines of the post). "
                + "Provide exactly one constraint for each of these 3 specific frameworks:\n"
                + "1. The Vulnerable Story (e.g., 'I failed. Hard. Here is what I learned.')\n"
                + "2. The Counter-Narrative (e.g., 'Stop doing X. Do Y instead.')\n"
                + "3. The 'How-To' Authority (e.g., 'How to achieve X in 3 simple steps.')\n\n"
                + "Return ONLY a numbered list (1. [hook]\n2. [hook]\n3. [hook]). Do NOT include quotes, bolding (**), explanations, framework names, or markdown formatting. Just pure text of the hook itself.\n\n"
                + draft;
    }

    public GenerationResult generateHooks(String draft, String userContext, String format) {
        return generate(buildGenerateHooksPrompt(draft, userContext, format));
    }

    private String buildLengthPrompt(String length) {
        if (length != null && !length.isBlank() && !length.equals("Medium") && !length.equals("Short") && !length.equals("Long")) {
            return " Aim for exactly " + length + " words. A deviation of 10 words is accepted.";
        } else if (length != null && !length.isBlank()) {
            return " Aim for exactly " + length + " words.";
        }
        return " Keep it around 200-300 words.";
    }

    public String buildProofreadPrompt(String article) {
        return "You are an independent, objective senior editor and fact-checker. You have no knowledge of the author's persona. Your job is to strictly review the following article for factual errors, structural flaws, or weak points. "
                      + "Provide an 'Impact Score' out of 10 based on how engaging and professional it is. Keep the feedback brief and actionable. Do NOT rewrite the article. "
                      + "CRITICAL: Return ONLY a valid JSON object matching exactly this schema: {\"score\": 8, \"feedback\": [\"string 1\", \"string 2\"]}. Do NOT include any markdown formatting like ```json or ``` at all. Output pure JSON. Here is the article:\n\n"
                      + article;
    }

    public GenerationResult proofreadArticle(String article) {
        return generate(buildProofreadPrompt(article));
    }
}

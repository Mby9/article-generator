package com.linkedinai.service.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Resolves the active AI provider from either:
 *   1. A per-request override (provider name passed in at call time), or
 *   2. The application-level default configured via {@code ai.provider} property.
 *
 * To add a new provider: create a @Service implementing AiProvider with a unique getName().
 * Spring will automatically inject it here — no changes to this class needed.
 */
@Service
public class AiProviderFactory {

    @Value("${ai.provider:gemini}")
    private String defaultProviderName;

    /** All AiProvider beans, keyed by their getName() value. Populated automatically by Spring. */
    private final Map<String, AiProvider> providers;

    public AiProviderFactory(List<AiProvider> providerList) {
        this.providers = providerList.stream()
            .collect(Collectors.toMap(AiProvider::getName, Function.identity()));
        System.out.println("[AiProviderFactory] Registered providers: " + this.providers.keySet());
    }

    /**
     * Returns the provider matching {@code overrideName}, or the configured default if null/blank.
     *
     * @param overrideName optional per-request provider name (may be null)
     * @return the resolved AiProvider
     * @throws IllegalArgumentException if the requested provider is not registered
     */
    public AiProvider getProvider(String overrideName) {
        String name = (overrideName != null && !overrideName.isBlank()) ? overrideName : defaultProviderName;
        AiProvider provider = providers.get(name.toLowerCase());
        if (provider == null) {
            throw new IllegalArgumentException(
                "Unknown AI provider: '" + name + "'. Available providers: " + providers.keySet()
            );
        }
        System.out.println("[AiProviderFactory] Using provider: " + name);
        return provider;
    }

    /** Returns the default provider as configured by ai.provider. */
    public AiProvider getDefaultProvider() {
        return getProvider(null);
    }
}

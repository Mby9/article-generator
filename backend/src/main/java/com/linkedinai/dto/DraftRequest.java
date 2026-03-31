package com.linkedinai.dto;

public record DraftRequest(String draft, String userContext, String tone, String instructions, String format, String articleLength, String provider) {}

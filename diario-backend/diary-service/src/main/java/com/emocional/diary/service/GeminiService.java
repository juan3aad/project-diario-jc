package com.emocional.diary.service;

import com.emocional.diary.dto.gemini.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${google.ai.gemini.api-key}")
    private String apiKey;

    @Value("${google.ai.gemini.url}")
    private String geminiUrl;

    public Mono<GeminiAnalysisResponse> analyzeSentiment(String diaryContent) {
        try {
            String prompt = buildSystemPrompt() + "\n\nTEXTO DEL DIARIO A ANALIZAR:\n" + diaryContent;

            log.info("Enviando análisis de sentimientos a Gemini...");

            GeminiRequest requestBody = GeminiRequest.builder()
                    .contents(List.of(
                            GeminiRequest.Content.builder()
                                    .parts(List.of(
                                            GeminiRequest.Part.builder()
                                                    .text(prompt)
                                                    .build()
                                    ))
                                    .build()
                    ))
                    .generationConfig(GeminiRequest.GenerationConfig.builder()
                            .temperature(0.1)
                            .maxOutputTokens(1000)
                            .topP(0.8)
                            .topK(40)
                            .build())
                    .build();
//https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent
            return webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1/models/gemini-2.5-flash:generateContent")
                            .queryParam("key", apiKey)
                            .build())
                    .body(BodyInserters.fromValue(requestBody))
                    .retrieve()
                    .bodyToMono(GeminiResponse.class)
                    .flatMap(this::parseContentFromResponse)
                    .doOnSuccess(response -> log.info("✅ Análisis completado - Emoción: {}", response.getEmotion()))
                    .doOnError(error -> {
                        log.error("❌ Error en Gemini API: {}", error.getMessage());
                        // Log más detallado para debugging
                        if (error.getMessage().contains("401")) {
                            log.error("❌ API Key inválida o no autorizada");
                        } else if (error.getMessage().contains("429")) {
                            log.error("❌ Límite de rate limit excedido");
                        } else if (error.getMessage().contains("400")) {
                            log.error("❌ Solicitud mal formada");
                        }
                    });

        } catch (Exception e) {
            log.error("Error preparando solicitud a Gemini: {}", e.getMessage());
            return Mono.error(e);
        }
    }

    private String buildSystemPrompt() {
        return """
        Eres un psicólogo especializado en análisis emocional. Analiza el texto del diario y devuelve SOLO un objeto JSON con este formato exacto:
        
        {
          "emotion": "emoción_principal",
          "intensity": número_1_a_10,
          "summary": "resumen_muy_corto",
          "keywords": ["palabra1", "palabra2", "palabra3", "palabra4"]
        }
        
        Reglas:
        - "emotion": Una palabra (alegría, tristeza, ansiedad, enojo, miedo, neutral, etc.)
        - "intensity": Número del 1 (muy baja) al 10 (muy alta)
        - "summary": Máximo 15 palabras, objetivo
        - "keywords": Exactamente 2 palabras clave relevantes
        
        IMPORTANTE: Tu respuesta debe ser SOLO el JSON, sin texto adicional, sin explicaciones, sin markdown.
        """;
    }

    private Mono<GeminiAnalysisResponse> parseContentFromResponse(GeminiResponse apiResponse) {
        try {
            if (apiResponse.getCandidates() == null || apiResponse.getCandidates().isEmpty()) {
                log.error("❌ Gemini no devolvió candidatos en la respuesta");
                return Mono.error(new RuntimeException("Respuesta de Gemini sin candidatos"));
            }

            String contentText = apiResponse.getCandidates().get(0).getContent().getParts().get(0).getText();
            log.debug("Respuesta cruda de Gemini: {}", contentText);

            // Limpiar la respuesta
            String cleanJson = contentText.trim()
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            log.debug("JSON limpio: {}", cleanJson);

            // Parsear el JSON
            GeminiAnalysisResponse parsedResponse = objectMapper.readValue(cleanJson, GeminiAnalysisResponse.class);

            // Validar campos requeridos
            if (parsedResponse.getEmotion() == null || parsedResponse.getIntensity() == null) {
                log.error("❌ Respuesta de Gemini incompleta: {}", cleanJson);
                return Mono.error(new RuntimeException("Respuesta de Gemini incompleta"));
            }

            log.info("✅ Análisis parseado - Emoción: {}, Intensidad: {}, Keywords: {}", 
                    parsedResponse.getEmotion(), 
                    parsedResponse.getIntensity(),
                    parsedResponse.getKeywords());

            return Mono.just(parsedResponse);

        } catch (JsonProcessingException e) {
            log.error("❌ Error parseando JSON de Gemini: {}", e.getMessage());
            return Mono.error(new RuntimeException("Error procesando respuesta de Gemini", e));
        } catch (Exception e) {
            log.error("❌ Error inesperado procesando respuesta: {}", e.getMessage());
            return Mono.error(new RuntimeException("Error procesando respuesta de Gemini", e));
        }
    }
}
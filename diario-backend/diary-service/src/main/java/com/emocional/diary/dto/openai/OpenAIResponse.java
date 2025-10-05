package com.emocional.diary.dto.openai;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

// --- DTOs para parsear la respuesta JSON de OpenAI ---

/**
 * Representa la estructura JSON que pedimos a GPT-3.5-turbo que genere.
 */
@Data
public class OpenAIResponse {
    // La emoción detectada (e.g., "ansiedad", "alegría")
    private String emotion;
    // Intensidad emocional (escala 1-10)
    private Integer intensity;
    // Resumen corto generado por la IA
    private String summary;
    // Palabras clave extraídas
    private List<String> keywords;

    // --- Estructura externa de la respuesta de la API de OpenAI ---

    @Data
    public static class Choice {
        private Integer index;
        private Message message;
        @JsonProperty("finish_reason")
        private String finishReason;
    }

    @Data
    public static class Message {
        private String role;
        // El contenido es el JSON que debemos parsear a nuestra clase OpenAIResponse
        private String content;
    }

    private List<Choice> choices;
    // Podemos añadir más campos como 'usage', si se necesita para monitoreo.
}

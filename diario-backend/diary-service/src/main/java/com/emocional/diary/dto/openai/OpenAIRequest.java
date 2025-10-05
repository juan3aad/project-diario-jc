package com.emocional.diary.dto.openai;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.util.List;

// --- DTO para el cuerpo de la petición de OpenAI ---

@Data
@Builder
public class OpenAIRequest {
    private String model;
    private List<Message> messages;
    
    // Indica a OpenAI que queremos una respuesta en formato JSON
    @JsonProperty("response_format")
    private ResponseFormat responseFormat;

    @Data
    @Builder
    public static class Message {
        private String role;
        private String content;
    }

    @Data
    @Builder
    public static class ResponseFormat {
        private String type = "json_object";
    }
}

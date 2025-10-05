package com.emocional.diary.service;

import com.emocional.diary.dto.openai.OpenAIRequest;
import com.emocional.diary.dto.openai.OpenAIResponse;
import com.emocional.diary.dto.openai.OpenAIRequest.Message;
import com.emocional.diary.dto.openai.OpenAIRequest.ResponseFormat;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * Servicio encargado de la comunicación con la API de OpenAI para el análisis de sentimientos.
 * Utiliza WebClient para peticiones no bloqueantes y realiza la Ingeniería de Prompt.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAIService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper; // Usado para parsear el JSON de la respuesta

    /**
     * Analiza el sentimiento del contenido de un diario usando un modelo de lenguaje.
     * @param diaryContent El texto libre del diario a analizar.
     * @return Mono<OpenAIResponse> con el análisis estructurado (emoción, intensidad, etc.).
     */
    public Mono<OpenAIResponse> analyzeSentiment(String diaryContent) {
        
        // 1. Ingeniería de Prompt: Instrucciones detalladas para forzar la respuesta JSON.
        String prompt = buildSystemPrompt() + "\n\nTEXTO DEL DIARIO A ANALIZAR: " + diaryContent;

        OpenAIRequest requestBody = OpenAIRequest.builder()
                .model("gpt-3.5-turbo") // El modelo más rápido y económico para esta tarea
                .responseFormat(ResponseFormat.builder().type("json_object").build()) // Pedir JSON
                .messages(List.of(
                        Message.builder().role("system").content(prompt).build()
                ))
                .build();

        // 2. Ejecutar la llamada a la API usando WebClient
        return webClient.post()
                .body(BodyInserters.fromValue(requestBody))
                .retrieve()
                .bodyToMono(OpenAIResponse.class) // Obtiene la respuesta cruda de OpenAI
                .flatMap(this::parseContentFromResponse); // Procesa el contenido para extraer nuestro JSON

    }

    /**
     * Construye las instrucciones de sistema para el modelo de lenguaje,
     * forzando la respuesta a un formato JSON específico.
     */
    private String buildSystemPrompt() {
        return """
        Eres un asistente de psicología enfocado en el análisis emocional de textos de diario. Tu única tarea es analizar el texto proporcionado y generar una respuesta JSON que contenga:
        1. 'emotion': La emoción principal detectada (e.g., 'alegría', 'tristeza', 'ansiedad', 'neutral').
        2. 'intensity': Un valor entero de 1 a 10 que representa la intensidad de esa emoción (1 siendo baja, 10 alta).
        3. 'summary': Un resumen conciso y objetivo del texto (máx. 30 palabras).
        4. 'keywords': Una lista de 3 a 5 palabras o frases clave que representan los temas del diario.
        
        Tu respuesta debe ser estricta y únicamente el objeto JSON. NO añadas texto explicativo.
        El formato de salida JSON DEBE ser:
        {
          "emotion": "string",
          "intensity": integer,
          "summary": "string",
          "keywords": ["string", "string", "string"]
        }
        """;
    }

    /**
     * Mapea el string JSON que viene dentro del campo 'content' de la respuesta de OpenAI
     * a nuestra clase DTO interna (OpenAIResponse).
     */
    private Mono<OpenAIResponse> parseContentFromResponse(OpenAIResponse rawResponse) {
        if (rawResponse.getChoices() == null || rawResponse.getChoices().isEmpty()) {
            return Mono.error(new RuntimeException("Respuesta de OpenAI sin choices."));
        }

        String contentJson = rawResponse.getChoices().get(0).getMessage().getContent();
        
        try {
            // Mapea la cadena JSON (que es el contenido del mensaje) a nuestra clase de DTO.
            OpenAIResponse parsedResponse = objectMapper.readValue(contentJson, OpenAIResponse.class);
            
            // Re-asigna la lista original de choices para mantener el objeto de monitoreo si es necesario
            parsedResponse.setChoices(rawResponse.getChoices());
            
            return Mono.just(parsedResponse);
            
        } catch (JsonProcessingException e) {
            log.error("Error al parsear el JSON de OpenAI: {}", contentJson, e);
            return Mono.error(new RuntimeException("El formato de respuesta JSON de OpenAI fue incorrecto.", e));
        }
    }
}
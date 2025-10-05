package com.emocional.diary.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Configuración para el WebClient, el cliente HTTP no bloqueante de Spring WebFlux.
 * Se utiliza para comunicarse con la API de OpenAI.
 */
@Configuration
public class WebClientConfig {

    // Inyecta la URL base y la clave API desde application.properties
    @Value("${openai.api.url}")
    private String openaiApiUrl;

    @Value("${openai.api.key}")
    private String openaiApiKey;

    /**
     * Bean que crea una instancia preconfigurada de WebClient.
     * Esta configuración incluye el encabezado de autorización que se requiere para OpenAI.
     */
    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl(openaiApiUrl)
                // Inyecta el encabezado de autorización en todas las peticiones
                .defaultHeader("Authorization", "Bearer " + openaiApiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
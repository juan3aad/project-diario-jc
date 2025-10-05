package com.emocional.checkin.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO para registrar un 'Check-in' diario o de momento.
 * Captura métricas clave del estado emocional del usuario.
 */
@Data
public class CheckInRequest {

    /**
     * Puntuación del estado de ánimo general del usuario.
     * Escala: 1 (Muy Mal) a 5 (Excelente).
     */
    @NotNull(message = "La puntuación de ánimo (mood score) es obligatoria.")
    @Min(value = 1, message = "La puntuación mínima de ánimo es 1.")
    @Max(value = 5, message = "La puntuación máxima de ánimo es 5.")
    private Integer moodScore; 

    /**
     * Nivel de estrés percibido por el usuario.
     * Escala: 1 (Bajo) a 5 (Alto).
     */
    @NotNull(message = "El nivel de estrés es obligatorio.")
    @Min(value = 1, message = "El nivel mínimo de estrés es 1 (Bajo).")
    @Max(value = 5, message = "El nivel máximo de estrés es 5 (Alto).")
    private Integer stressLevel; 

    /**
     * Notas o reflexión opcional sobre el estado actual.
     */
    private String notes; 
}

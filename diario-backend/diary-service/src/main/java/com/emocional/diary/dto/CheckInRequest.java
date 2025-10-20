package com.emocional.diary.dto;

import lombok.Data;

/**
 * DTO para recibir la información del Check-in diario desde el frontend.
 * No contiene el userId ni la fecha de creación/check-in, ya que se generan en el backend.
 */
@Data
public class CheckInRequest {
    // Puntuación de estado de ánimo (1-10)
    private Integer moodScore;
    
    // Reflexión corta (máx. 255 caracteres)
    private String shortReflection;
    
    // Si los objetivos se cumplieron
    private Boolean goalsMet;
}

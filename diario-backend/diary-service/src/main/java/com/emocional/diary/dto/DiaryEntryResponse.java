package com.emocional.diary.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO de respuesta que representa una entrada de diario después de ser creada y analizada.
 * Se utiliza para devolver datos limpios al cliente.
 */
@Data
public class DiaryEntryResponse {

    private Long id;
    private String content;
    private Integer userStressLevel;
    private LocalDateTime createdAt;

    // --- Campos de Análisis de IA ---
    private String aiEmotion;
    private Integer aiIntensity;
    private String aiSummary;
    private List<String> aiKeywords;
}
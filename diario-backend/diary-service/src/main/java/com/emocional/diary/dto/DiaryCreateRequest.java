package com.emocional.diary.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO para la creación de una nueva entrada de diario.
 * Contiene el contenido de texto libre y el nivel de estrés asociado.
 */
@Data
public class DiaryCreateRequest {

    /**
     * Contenido del diario (texto libre)
     * Debe ser obligatorio y no estar vacío.
     */
    @NotBlank(message = "El contenido del diario no puede estar vacío.")
    private String content;

    /**
     * Nivel de estrés reportado por el usuario, escala 1 a 10.
     * Es un dato crucial para el análisis de riesgo.
     */
    @NotNull(message = "El nivel de estrés es obligatorio.")
    @Min(value = 1, message = "El nivel de estrés debe ser al menos 1.")
    @Max(value = 10, message = "El nivel de estrés no puede superar 10.")
    private Integer stressLevel;
}

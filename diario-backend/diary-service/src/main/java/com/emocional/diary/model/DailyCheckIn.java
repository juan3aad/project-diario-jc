package com.emocional.diary.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad JPA que registra el estado diario del usuario (Check-in).
 * Asegura una sola entrada por usuario por día.
 */
@Entity
@Table(name = "daily_check_in",
       uniqueConstraints = {
           // Restricción única para garantizar un solo check-in por usuario y fecha
           @UniqueConstraint(columnNames = {"user_id", "check_in_date"})
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyCheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ID del usuario (debe ser LONG como el ID del AUTH Service)
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // La fecha del check-in
    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    // Puntuación de estado de ánimo (ej. 1=Mal, 10=Excelente)
    @Column(name = "mood_score", nullable = false)
    private Integer moodScore;
    
    // Una reflexión muy corta sobre el día
    @Column(name = "short_reflection", columnDefinition = "VARCHAR(255)")
    private String shortReflection;

    // Indicador de si se cumplieron los objetivos del día
    @Column(name = "goals_met")
    private Boolean goalsMet;

    // Fecha y hora de creación del registro
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        // Establece la fecha de check-in al día de hoy si no se proporciona
        if (checkInDate == null) {
            checkInDate = LocalDate.now();
        }
        createdAt = LocalDateTime.now();
    }
}

package com.emocional.diary.repository;

import com.emocional.diary.model.DailyCheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

/**
 * Repositorio para la entidad DailyCheckIn.
 */
public interface DailyCheckInRepository extends JpaRepository<DailyCheckIn, Long> {
    
    /**
     * Busca una entrada de check-in específica por ID de usuario y fecha.
     * Es esencial para aplicar la regla de "un check-in por día".
     */
    Optional<DailyCheckIn> findByUserIdAndCheckInDate(Long userId, LocalDate checkInDate);

    // Métodos para el dashboard (futuro)
    // List<DailyCheckIn> findByUserIdOrderByCheckInDateDesc(Long userId);
}

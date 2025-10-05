package com.emocional.diary.repository;

import com.emocional.diary.model.DiaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repositorio para la entidad DiaryEntry.
 */
public interface DiaryEntryRepository extends JpaRepository<DiaryEntry, Long> {

    /**
     * Busca todas las entradas de diario de un usuario específico.
     * @param userId El ID del usuario propietario.
     * @return Lista de entradas de diario.
     */
    List<DiaryEntry> findByUserIdOrderByEntryDateDesc(Long userId);
}

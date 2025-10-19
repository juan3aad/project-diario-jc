package com.emocional.diary.repository;

import com.emocional.diary.model.DiaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad DiaryEntry.
 */
public interface DiaryEntryRepository extends JpaRepository<DiaryEntry, Long> {

    /**
     * Busca todas las entradas de diario de un usuario específico.
     * @param userId El ID del usuario propietario.
     * @return Lista de entradas de diario.
     */
    List<DiaryEntry> findByUserIdOrderByCreatedAtDesc(String userId);
    
    
    /**
     * **METODO DE SEGURIDAD CLAVE**
     * 
     * Busca una entrada po su ID y se asegura de que pertenezca al ID de usuario dado.
     * @param id ID de la entrada
     * @param userId ID del usuario propietario.
     * @return Optional con la entrada si ambos condiciones se cumplen
     */
    
    Optional<DiaryEntry> findByIdAndUserId(Long id, String userId);
}

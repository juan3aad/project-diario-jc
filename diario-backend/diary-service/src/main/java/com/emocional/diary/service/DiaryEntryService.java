package com.emocional.diary.service;

import java.util.List;
import java.util.Optional;

import com.emocional.diary.dto.DiaryCreateRequest;
import com.emocional.diary.model.DiaryEntry;



/**
 * Interfaz para el servicio de lógica de negocio del diario.
 * Define las operaciones CRUD y el flujo de negocio (que incluye el análisis de IA).
 * Esto facilita el testing y la adhesión al Clean Code.
 */
public interface DiaryEntryService {
    
    /**
     * Crea una nueva entrada de diario con el análisis de sentimientos de IA.
     * @param userId El ID del usuario que crea la entrada.
     * @param request Los datos de la entrada (contenido y nivel de estrés inicial).
     * @return La entrada de diario persistida.
     */
    DiaryEntry createEntry(String userId, DiaryCreateRequest request);

    /**
     * Busca una entrada de diario por ID, asegurando que el usuario sea el propietario.
     * @param userId ID del usuario autenticado.
     * @param entryId ID de la entrada a buscar.
     * @return Optional<DiaryEntry> con la entrada si existe y pertenece al usuario.
     */
    Optional<DiaryEntry> getEntryById(String userId, Long entryId);

    // Métodos futuros para listar, actualizar, etc.
    
    List<DiaryEntry> getAllEntriesByUserId(String userId);
    
    List<DiaryEntry> getAllEntriesAll();
}


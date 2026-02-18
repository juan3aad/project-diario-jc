package com.emocional.diary.service;

import com.emocional.diary.dto.DiaryEntryRequest;
import com.emocional.diary.dto.DiaryEntryResponse;
import com.emocional.diary.dto.gemini.GeminiAnalysisResponse;
import com.emocional.diary.exception.ExternalServiceException;
import com.emocional.diary.model.DiaryEntry;
import com.emocional.diary.repository.DiaryEntryRepository;
import com.emocional.diary.mapper.DiaryEntryMapper; // Se añade la importación del Mapper
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono; // Necesario ya que GeminiService devuelve Mono

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime; // Nuevo import para LocalTime.MAX
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; // Nuevo import para mapear listas

@Service
@RequiredArgsConstructor
@Slf4j
public class DiaryEntryServiceImpl implements DiaryEntryService {

    private final DiaryEntryRepository diaryEntryRepository;
    private final GeminiService geminiService;
    private final DiaryEntryMapper mapper; // INYECCIÓN DEL MAPPER

    @Override
    @Transactional
    public DiaryEntryResponse createEntry(Long userId, DiaryEntryRequest request) {
        log.info("Iniciando creación de entrada para usuario: {}", userId);

        Instant now = Instant.now();
        LocalDate today = now.atZone(ZoneId.systemDefault()).toLocalDate();
        Instant startOfDay = today.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        // 1. Validar la restricción de "Una Entrada por Día"
        List<DiaryEntry> existingEntriesToday = diaryEntryRepository.findByUserIdAndCreatedAtBetween(userId, startOfDay, endOfDay);

        if (!existingEntriesToday.isEmpty()) {
            log.warn("❌ Intento de doble check-in para usuario: {}", userId);
            throw new IllegalStateException("Solo se permite una entrada de diario por día.");
        }
        
        // 2. Validación de datos de entrada
        if (request.getEntryText() == null || request.getEntryText().trim().isEmpty()) {
            throw new IllegalArgumentException("El contenido del diario no puede estar vacío.");
        }

        try {
            // 3. Llamada a Gemini de forma sincrónica (blocking)
            // Esto es correcto ya que estamos en un contexto de Spring Web (no WebFlux) y necesitamos el resultado
            GeminiAnalysisResponse analysisResponse = geminiService.analyzeSentiment(request.getEntryText())
                    .block(); 

            if (analysisResponse == null || analysisResponse.getEmotion() == null) {
                // Relanzamos la excepción específica para el fallo del servicio externo
                throw new ExternalServiceException("El análisis de sentimientos por Gemini ha fallado o la respuesta es nula.");
            }

            // 4. Crear la Entidad DiaryEntry
            DiaryEntry entry = DiaryEntry.builder()
            		 .userId(userId)
                     .content(request.getEntryText()) 
                     .userStressLevel(request.getStressLevel())
                     .userMoodRating(request.getMoodRating())
                     .userSleepHours(request.getSleepHours())
                     .mainWorry(request.getMainWorry())
                     .createdAt(now) 
                     .aiEmotion(analysisResponse.getEmotion())
                     .aiIntensity(analysisResponse.getIntensity())
                     .aiKeywords(analysisResponse.getKeywords())
                     .aiSummary(analysisResponse.getSummary())
                     .build();

            // Guardar la ENTIDAD
            DiaryEntry savedEntity = diaryEntryRepository.save(entry);
            
            // CONVERSIÓN CRÍTICA: Mapear la Entidad guardada al DTO de respuesta
            DiaryEntryResponse response = mapper.toResponseDto(savedEntity);
            
            log.info("✅ Entrada guardada - ID: {}, Usuario: {}, Emoción: {}", 
                      response.getId(), userId, savedEntity.getAiEmotion());

            return response;

        } catch (ExternalServiceException e) {
             throw e;
        } catch (Exception e) {
            log.error("❌ Error inesperado creando entrada de diario para {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Error interno al procesar la entrada: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DiaryEntryResponse> getEntryById(Long userId, Long entryId) {
        // CORRECCIÓN: Asegurar que el usuario solo puede ver sus propias entradas
        // Asumo que tienes un método que busca por ID de entrada Y ID de usuario (findByIdAndUserId)
        return diaryEntryRepository.findById(entryId)
                .filter(entry -> entry.getUserId().equals(userId))
                // CONVERSIÓN CRÍTICA: Mapear la Entidad a DTO
                .map(mapper::toResponseDto); 
    }

    /**
     * Obtiene todas las entradas de diario para un usuario, ordenadas de la más reciente a la más antigua.
     * @param userId El ID del usuario autenticado.
     * @return Una lista de DiaryEntryResponse.
     */
    @Override
    @Transactional(readOnly = true)
    public List<DiaryEntryResponse> getAllEntriesByUserId(Long userId) {
        log.info("Buscando todas las entradas para el usuario: {}", userId);
        
        // Asumo que el repositorio usa entryDate para ordenar
        List<DiaryEntry> entries = diaryEntryRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        // CONVERSIÓN CRÍTICA: Mapear la lista de Entidades a una lista de DTOs
        return entries.stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }
}

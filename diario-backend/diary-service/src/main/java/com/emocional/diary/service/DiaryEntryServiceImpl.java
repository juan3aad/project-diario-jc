package com.emocional.diary.service;

import com.emocional.diary.dto.DiaryCreateRequest;
import com.emocional.diary.dto.openai.OpenAIResponse;
import com.emocional.diary.model.DiaryEntry;
import com.emocional.diary.repository.DiaryEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Implementación del servicio de lógica de negocio para las entradas de diario.
 * Esta capa coordina la interacción entre la persistencia (Repository) y la IA (OpenAIService).
 * Respeta el principio de Inyección de Dependencias y Separación de Responsabilidades.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DiaryEntryServiceImpl implements DiaryEntryService {

    private final DiaryEntryRepository diaryEntryRepository;
    private final OpenAIService openAIService;

    /**
     * Procesa y guarda una nueva entrada de diario.
     * 1. Llama a la API de OpenAI para obtener el análisis de sentimientos.
     * 2. Persiste la entrada de diario junto con los resultados del análisis.
     *
     * @param userId El ID del usuario, extraído del token JWT.
     * @param request Los datos brutos de la entrada de diario.
     * @return La entrada de diario guardada.
     */
    @Override
    public DiaryEntry createEntry(String userId, DiaryCreateRequest request) {
        log.info("Iniciando creación de entrada de diario para el usuario: {}", userId);

        // 1. Llamar al servicio de OpenAI para obtener el análisis de sentimientos.
        // Se utiliza el método reactivo block() para simplificar la interfaz sincrónica del servicio.
        OpenAIResponse analysisResponse;
        try {
            analysisResponse = openAIService.analyzeSentiment(request.getContent()).block();
            if (analysisResponse == null || analysisResponse.getEmotion() == null) {
                // Manejo de error si la respuesta es nula o incompleta
                throw new RuntimeException("Análisis de sentimientos fallido o incompleto por parte de OpenAI.");
            }
        } catch (Exception e) {
            log.error("Error al comunicarse con el servicio de OpenAI: {}", e.getMessage());
            // Opcional: Podríamos crear un análisis por defecto o lanzar una excepción más específica.
            throw new RuntimeException("Error en la integración con la IA.", e);
        }

        // 2. Mapear DTO a Entidad y asignar resultados del análisis.
        DiaryEntry entry = new DiaryEntry();
        entry.setUserId(userId);
        entry.setContent(request.getContent());
        entry.setUserStressLevel(request.getStressLevel()); // Asignar el nivel de estrés del check-in
        entry.setCreatedAt(LocalDateTime.now());

        // Asignación de datos del análisis de IA
        entry.setAiEmotion(analysisResponse.getEmotion());
        entry.setAiIntensity(analysisResponse.getIntensity());
        entry.setAiKeywords(analysisResponse.getKeywords());
        entry.setAiSummary(analysisResponse.getSummary());

        // 3. Persistir la entidad en la base de datos
        DiaryEntry savedEntry = diaryEntryRepository.save(entry);
        log.info("Entrada de diario guardada exitosamente con ID: {}", savedEntry.getId());

        // Aquí iría la lógica adicional de Alertas y Recomendaciones (fase futura)

        return savedEntry;
    }

    /**
     * Busca una entrada de diario por su ID, asegurando que pertenezca al usuario.
     */
    @Override
    public Optional<DiaryEntry> getEntryById(String userId, Long entryId) {
        return diaryEntryRepository.findById(entryId)
                .filter(entry -> entry.getUserId().equals(userId));
    }
}

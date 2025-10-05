package com.emocional.diary.service;

import com.emocional.diary.dto.DiaryCreateRequest;
import com.emocional.diary.dto.gemini.GeminiAnalysisResponse;
import com.emocional.diary.model.DiaryEntry;
import com.emocional.diary.repository.DiaryEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DiaryEntryServiceImpl implements DiaryEntryService {

    private final DiaryEntryRepository diaryEntryRepository;
    private final GeminiService geminiService;

    @Override
    public DiaryEntry createEntry(String userId, DiaryCreateRequest request) {
        log.info("Iniciando creación de entrada para usuario: {}", userId);

        try {
            // Llamar a Gemini de forma sincrónica (blocking)
            GeminiAnalysisResponse analysisResponse = geminiService.analyzeSentiment(request.getContent())
                    .block(); // Convertir Mono a sincrónico

            if (analysisResponse == null || analysisResponse.getEmotion() == null) {
                throw new RuntimeException("Análisis de sentimientos fallido");
            }

            // Crear y guardar la entrada
            DiaryEntry entry = DiaryEntry.builder()
                    .userId(userId)
                    .content(request.getContent())
                    .userStressLevel(request.getStressLevel())
                    .createdAt(LocalDateTime.now())
                    .aiEmotion(analysisResponse.getEmotion())
                    .aiIntensity(analysisResponse.getIntensity())
                    .aiKeywords(analysisResponse.getKeywords())
                    .aiSummary(analysisResponse.getSummary())
                    .build();

            DiaryEntry savedEntry = diaryEntryRepository.save(entry);
            
            log.info("✅ Entrada guardada - ID: {}, Usuario: {}, Emoción: {}", 
                     savedEntry.getId(), userId, analysisResponse.getEmotion());

            return savedEntry;

        } catch (Exception e) {
            log.error("❌ Error creando entrada de diario: {}", e.getMessage(), e);
            throw new RuntimeException("Error creando entrada: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<DiaryEntry> getEntryById(String userId, Long entryId) {
        return diaryEntryRepository.findById(entryId)
                .filter(entry -> entry.getUserId().equals(userId));
    }

    /**
     * Obtiene todas las entradas de diario para un usuario, ordenadas de la más reciente a la más antigua.
     * @param userId El ID del usuario autenticado.
     * @return Una lista de DiaryEntry.
     */
    @Override
    public List<DiaryEntry> getAllEntriesByUserId(String userId) {
        log.info("Buscando todas las entradas para el usuario: {}", userId);
        // Usa el método predefinido del repositorio para buscar por userId y ordenar.
        return diaryEntryRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

	@Override
	public List<DiaryEntry> getAllEntriesAll() {
		// TODO Auto-generated method stub
		return diaryEntryRepository.findAll();
	}
}
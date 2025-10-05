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
}
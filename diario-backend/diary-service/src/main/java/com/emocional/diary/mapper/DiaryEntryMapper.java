package com.emocional.diary.mapper; // Crea este nuevo paquete

import com.emocional.diary.dto.DiaryEntryResponse;
import com.emocional.diary.model.DiaryEntry;
import org.springframework.stereotype.Component;

@Component
public class DiaryEntryMapper {

    public DiaryEntryResponse toResponse(DiaryEntry entry) {
        if (entry == null) {
            return null;
        }

        DiaryEntryResponse response = new DiaryEntryResponse();
        response.setId(entry.getId());
        response.setContent(entry.getContent());
        response.setUserStressLevel(entry.getUserStressLevel());
        response.setCreatedAt(entry.getCreatedAt());

        // Mapeo de campos de la IA
        response.setAiEmotion(entry.getAiEmotion());
        response.setAiIntensity(entry.getAiIntensity());
        response.setAiSummary(entry.getAiSummary());
        response.setAiKeywords(entry.getAiKeywords());

        return response;
    }
}
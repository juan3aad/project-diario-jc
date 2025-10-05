package com.emocional.diary.controller;

import com.emocional.diary.dto.DiaryCreateRequest;
import com.emocional.diary.service.DiaryEntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/diary")
@RequiredArgsConstructor
public class DiaryEntryController {

    private final DiaryEntryService diaryEntryService;

    /**
     * Extrae el ID del usuario autenticado del contexto de seguridad.
     * @return El ID del usuario como String (consistente con el Auth Service)
     */
    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getPrincipal().toString(); // userId como String
    }

    @PostMapping
    public ResponseEntity<Void> createDiaryEntry(@Valid @RequestBody DiaryCreateRequest request) {
        String userId = getAuthenticatedUserId();
        diaryEntryService.createEntry(userId, request);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
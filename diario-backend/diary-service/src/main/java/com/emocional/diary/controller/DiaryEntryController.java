package com.emocional.diary.controller;

import com.emocional.diary.dto.DiaryCreateRequest;
import com.emocional.diary.dto.DiaryEntryResponse;
import com.emocional.diary.mapper.DiaryEntryMapper;
import com.emocional.diary.model.DiaryEntry;
import com.emocional.diary.service.DiaryEntryService;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

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
    private final DiaryEntryMapper entryMapper; // ⬅️ Inyectar el mapper

    /**
     * Extrae el ID del usuario autenticado del contexto de seguridad.
     * @return El ID del usuario como String (consistente con el Auth Service)
     */
    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getPrincipal().toString(); // userId como String
    }

//    @PostMapping
//    public ResponseEntity<Void> createDiaryEntry(@Valid @RequestBody DiaryCreateRequest request) {
//        String userId = getAuthenticatedUserId();
//        diaryEntryService.createEntry(userId, request);
//        return new ResponseEntity<>(HttpStatus.CREATED);
//    }
    
    @PostMapping
    public ResponseEntity<DiaryEntryResponse> createDiaryEntry(@Valid @RequestBody DiaryCreateRequest request) {
        String userId = getAuthenticatedUserId();
        DiaryEntry savedEntry = diaryEntryService.createEntry(userId, request);
        DiaryEntryResponse response = entryMapper.toResponse(savedEntry); // Usar un Mapper (ver punto 3)
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<DiaryEntryResponse>> getAllDiaryEntries() {
    	// 1. Obtener el ID del usuario del contexto de seguridad
        String userId = getAuthenticatedUserId();
        
        // 2. Obtener las entidades del servicio
        List<DiaryEntry> entries = diaryEntryService.getAllEntriesByUserId(userId);

        // 3. Mapear las entidades a DTOs de respuesta
        List<DiaryEntryResponse> response = entries.stream()
                .map(entryMapper::toResponse)
                .collect(Collectors.toList());    

        // 4. Devolver la lista
        return ResponseEntity.ok(response);
    }
}
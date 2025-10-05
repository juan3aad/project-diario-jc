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

/**
 * Controlador REST para manejar las entradas de diario.
 * Todas las rutas están protegidas y requieren un JWT válido.
 */
@RestController
@RequestMapping("/api/v1/diary")
@RequiredArgsConstructor
public class DiaryEntryController {

    private final DiaryEntryService diaryEntryService;

    /**
     * Extrae el ID del usuario autenticado del contexto de seguridad.
     * @return El ID del usuario (String).
     */
    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // El principal en este caso es el userId que establecimos en JwtAuthenticationFilter
        return (String) authentication.getPrincipal();
    }

    /**
     * Crea una nueva entrada de diario.
     * 1. Extrae el userId del JWT.
     * 2. Delega al servicio para hacer el análisis de la IA y guardar la entrada.
     * @param request Datos de la entrada (contenido, nivel de estrés).
     * @return 201 Created si la creación es exitosa.
     */
    @PostMapping
    public ResponseEntity<Void> createDiaryEntry(@Valid @RequestBody DiaryCreateRequest request) {
        String userId = getAuthenticatedUserId();
        diaryEntryService.createEntry(userId, request);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // Nota: Los endpoints para obtener el historial se añadirán más adelante.
}

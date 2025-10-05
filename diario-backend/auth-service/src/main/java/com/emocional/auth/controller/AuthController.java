package com.emocional.auth.controller;

import com.emocional.auth.dto.LoginRequest;
import com.emocional.auth.dto.RegisterRequest;
import com.emocional.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para el manejo de la autenticación de usuarios (Registro e Inicio de Sesión).
 * Esta es la única ruta pública en el sistema.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint para registrar un nuevo usuario en el sistema.
     * @param request Datos de registro (nombre, email, password).
     * @return 201 Created si el registro es exitoso.
     */
    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    /**
     * Endpoint para iniciar sesión.
     * @param request Credenciales de login (email, password).
     * @return 200 OK y el JWT si las credenciales son válidas.
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        String jwt = authService.login(request);
        // Devolvemos el JWT directamente. En un entorno real se devolvería un DTO con el token.
        return ResponseEntity.ok(jwt);
    }

    // Nota: La gestión de perfil y logout seguro se implementaría en futuras iteraciones
}

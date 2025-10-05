package com.emocional.diary.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.function.Function;

/**
 * Utilidad para la validación y extracción de información de JWT.
 * Usado por el Diary Service para verificar el token emitido por el Auth Service.
 */
@Component
public class JwtUtil {

    // Clave secreta COMPARTIDA con el Auth Service
    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    /**
     * Valida si la firma del token es correcta y si no ha expirado.
     */
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            // Logear o manejar excepciones específicas (ExpiredJwtException, MalformedJwtException, etc.)
            System.err.println("Error al validar el token: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Extrae el ID del usuario (clave "userId") del token.
     * Esta es la información crucial para la lógica de negocio.
     */
    public Long extractUserId(String token) {
        return extractClaim(token, claims -> Long.valueOf(claims.get("userId").toString()));
    }

    /**
     * Método genérico para extraer un claim específico del token.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

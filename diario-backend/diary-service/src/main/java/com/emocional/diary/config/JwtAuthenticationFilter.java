package com.emocional.diary.config;

import com.emocional.diary.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Filtro que intercepta peticiones en el Diary Service para validar el JWT.
 * El objetivo es establecer la autenticación en el contexto de seguridad usando el 'userId'
 * en lugar de cargar un UserDetails completo.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        // 1. Validar el token y la firma
        if (jwtUtil.validateToken(jwt)) {
            
            // 2. Extraer el ID del usuario (información crucial)
            Long userId = jwtUtil.extractUserId(jwt);
            
            // 3. Crear el objeto de autenticación
            // Usamos el userId como el 'principal' y una autoridad simple.
            // Esto evita la necesidad de llamar a una BD para cargar un UserDetails completo.
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userId, // Principal: El ID del usuario
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("USER"))
            );
            
            authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );
            
            // 4. Colocar la autenticación en el contexto de seguridad
            SecurityContextHolder.getContext().setAuthentication(authToken);
        } else {
            // Si el token es inválido (expirado, firma incorrecta, etc.), la petición fallará
            // con 403 Forbidden o 401 Unauthorized en el punto de acceso (SecurityConfig).
        }
        
        filterChain.doFilter(request, response);
    }
}

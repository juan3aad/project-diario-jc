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

        if (jwtUtil.validateToken(jwt)) {
            // CORREGIDO: Usa String (igual que el Auth Service)
            String userId = jwtUtil.extractUserId(jwt);
            String username = jwtUtil.extractUsername(jwt);
            
//            logger.debug("Usuario autenticado - ID: {}, Email: {}", userId, username);
            
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userId, // Principal: userId como String
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("USER"))
            );
            
            authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );
            
            SecurityContextHolder.getContext().setAuthentication(authToken);
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Token inválido o expirado\"}");
            return;
        }
        
        filterChain.doFilter(request, response);
    }
}
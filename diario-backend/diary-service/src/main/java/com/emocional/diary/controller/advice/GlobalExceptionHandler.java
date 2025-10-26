package com.emocional.diary.controller.advice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.emocional.diary.dto.ErrorResponse;
import com.emocional.diary.exception.ExternalServiceException;
@RestControllerAdvice 
public class GlobalExceptionHandler {
	/**
     * Captura las excepciones de negocio (IllegalStateException) para la regla 
     * "Solo una entrada por día".
     * Devuelve un código 409 Conflict.
     */
	@ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // Concatenar todos los mensajes de error de campo
        String detailedMessage = ex.getBindingResult().getAllErrors().stream()
                .map(error -> {
                    String fieldName = (error instanceof FieldError) ? ((FieldError) error).getField() : error.getObjectName();
                    return fieldName + ": " + error.getDefaultMessage();
                })
                .collect(java.util.stream.Collectors.joining("; "));

        System.err.println("❌ ARGUMENTO DE MÉTODO INVÁLIDO (400): " + detailedMessage);

        ErrorResponse errorResponse = new ErrorResponse(
                "Error de validación en los datos de entrada: " + detailedMessage,
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request"
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Captura la excepción de servicio externo (Gemini/OpenAI fallido).
     * Devuelve un código 503 Service Unavailable.
     */
    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<ErrorResponse> handleExternalServiceException(ExternalServiceException ex) {
        // Loguear para el backend
        System.err.println("❌ SERVICIO EXTERNO NO DISPONIBLE (503): " + ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                "Service Unavailable"
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.SERVICE_UNAVAILABLE);
    }

    /**
     * Manejador de excepciones genéricas (opcional, pero recomendado)
     * para cualquier error no previsto, devolviendo un 500 Internal Server Error.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        // Loguear el error con stack trace completo
        ex.printStackTrace(); 
        
        ErrorResponse errorResponse = new ErrorResponse(
                "Ocurrió un error interno inesperado. Consulte los logs del servidor.",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error"
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

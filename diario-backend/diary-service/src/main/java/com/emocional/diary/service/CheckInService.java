package com.emocional.diary.service;

import com.emocional.diary.dto.CheckInRequest;
import com.emocional.diary.model.DailyCheckIn;

/**
 * Interfaz para la lógica de negocio del Check-in diario.
 */
public interface CheckInService {
    
    /**
     * Crea un nuevo registro de check-in para el usuario autenticado.
     * @param request El DTO con los datos del check-in.
     * @return La entidad DailyCheckIn guardada.
     */
    DailyCheckIn saveCheckIn(CheckInRequest request);
}

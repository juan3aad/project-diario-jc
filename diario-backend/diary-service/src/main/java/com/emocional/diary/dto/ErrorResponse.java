package com.emocional.diary.dto;

import java.time.LocalDateTime;

public class ErrorResponse {
	
	 private final LocalDateTime timestamp;
	    private final String message;
	    private final int status;
	    private final String error;

	    public ErrorResponse(String message, int status, String error) {
	        this.timestamp = LocalDateTime.now();
	        this.message = message;
	        this.status = status;
	        this.error = error;
	    }
	    
	    // Getters omitidos por brevedad
	    public LocalDateTime getTimestamp() { return timestamp; }
	    public String getMessage() { return message; }
	    public int getStatus() { return status; }
	    public String getError() { return error; }

}

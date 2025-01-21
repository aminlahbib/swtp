package com.equipment.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle custom EquipmentException
    @ExceptionHandler(EquipmentException.class)
    public ResponseEntity<ErrorResponse> handleEquipmentException(EquipmentException ex) {
        log.error("Equipment error: {}", ex.getMessage());
        return new ResponseEntity<>(
                new ErrorResponse(ex.getMessage()),
                ex.getStatus()
        );
    }

    // Handle BadCredentialsException (invalid username or password)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex) {
        log.error("Authentication failed: {}", ex.getMessage());
        return new ResponseEntity<>(
                new ErrorResponse("Ungültige Anmeldedaten"), // "Invalid credentials"
                HttpStatus.UNAUTHORIZED // 401 Unauthorized
        );
    }

    // Handle generic exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage());
        return new ResponseEntity<>(
                new ErrorResponse("An unexpected error occurred"),
                HttpStatus.INTERNAL_SERVER_ERROR // 500 Internal Server Error
        );
    }

    // Record to represent error responses
    record ErrorResponse(String message) {}
}
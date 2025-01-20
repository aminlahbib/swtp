package com.equipment.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EquipmentException.class)
    public ResponseEntity<ErrorResponse> handleEquipmentException(EquipmentException ex) {
        log.error("Equipment error: {}", ex.getMessage());
        return new ResponseEntity<>(
            new ErrorResponse(ex.getMessage()),
            ex.getStatus()
        );
    }

    record ErrorResponse(String message) {}
} 
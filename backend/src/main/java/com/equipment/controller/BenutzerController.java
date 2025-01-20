package com.equipment.controller;

import com.equipment.dto.AuthRequest;
import com.equipment.dto.AuthResponse;
import com.equipment.dto.RegisterRequest;
import com.equipment.service.BenutzerService;
import com.equipment.service.AusleiheService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/benutzer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8080")
public class BenutzerController {

    private final BenutzerService benutzerService;
    private final AusleiheService ausleiheService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(benutzerService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(benutzerService.login(request));
    }

    @GetMapping("/equipment")
    public ResponseEntity<?> getAvailableEquipment() {
        return ResponseEntity.ok(ausleiheService.getAvailableEquipment());
    }

    @GetMapping("/ausleihen")
    public ResponseEntity<?> getMyBorrowedEquipment() {
        return ResponseEntity.ok(ausleiheService.getBorrowedEquipmentForCurrentUser());
    }

    @PostMapping("/ausleihen/{equipmentId}")
    public ResponseEntity<?> borrowEquipment(@PathVariable Integer equipmentId) {
        ausleiheService.borrowEquipment(equipmentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rueckgabe/{equipmentId}")
    public ResponseEntity<?> returnEquipment(@PathVariable Integer equipmentId) {
        ausleiheService.returnEquipment(equipmentId);
        return ResponseEntity.ok().build();
    }
} 
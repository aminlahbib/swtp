package com.equipment.controller;

import com.equipment.model.Equipment;
import com.equipment.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.equipment.service.AusleiheService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:8080")
public class AdminController {

    private final AdminService adminService;

    private final AusleiheService ausleiheService;

    public AdminController(AdminService adminService, AusleiheService ausleiheService) {
        this.adminService = adminService;
        this.ausleiheService = ausleiheService;
    }

    @PostMapping("/equipment")
    public ResponseEntity<?> addEquipment(@RequestBody Equipment equipment) {
        return ResponseEntity.ok(adminService.addEquipment(equipment));
    }

    @GetMapping("/equipment")
    public ResponseEntity<?> getAvailableEquipment() {
        return ResponseEntity.ok(ausleiheService.getAvailableEquipment());
    }

    @GetMapping("/ausleihen/current")
    public ResponseEntity<?> getCurrentLoans() {
        return ResponseEntity.ok(adminService.getCurrentLoans());
    }

    @GetMapping("/ausleihen/history")
    public ResponseEntity<?> getLoanHistory() {
        return ResponseEntity.ok(adminService.getLoanHistory());
    }
} 
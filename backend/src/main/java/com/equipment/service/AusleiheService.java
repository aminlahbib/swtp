package com.equipment.service;

import com.equipment.exception.EquipmentException;
import com.equipment.model.Ausleihe;
import com.equipment.model.Benutzer;
import com.equipment.model.Equipment;
import com.equipment.model.LogItem;
import com.equipment.repository.AusleiheRepository;
import com.equipment.repository.EquipmentRepository;
import com.equipment.repository.LogItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class AusleiheService {
    private final AusleiheRepository ausleiheRepository;
    private final EquipmentRepository equipmentRepository;
    private final LogItemRepository logItemRepository;

    public AusleiheService(AusleiheRepository ausleiheRepository, EquipmentRepository equipmentRepository, LogItemRepository logItemRepository) {
        this.ausleiheRepository = ausleiheRepository;
        this.equipmentRepository = equipmentRepository;
        this.logItemRepository = logItemRepository;
    }

    public List<Equipment> getAvailableEquipment() {
        try {
            List<Integer> ausgeliehenIds = ausleiheRepository.findAll().stream()
                    .map(a -> a.getEquipment().getId())
                    .collect(Collectors.toList());

            if (ausgeliehenIds.isEmpty()) {
                return equipmentRepository.findAll();
            } else {
                return equipmentRepository.findByIdNotIn(ausgeliehenIds);
            }
        } catch (Exception e) {
            throw EquipmentException.badRequest("Fehler beim Laden der verfügbaren Geräte: " + e.getMessage());
        }
    }

    @Transactional
    public void borrowEquipment(Integer equipmentId) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> EquipmentException.notFound("Equipment nicht gefunden"));

        // Check if equipment is already borrowed
        if (ausleiheRepository.findAll().stream()
                .anyMatch(a -> a.getEquipment().getId().equals(equipmentId))) {
            throw EquipmentException.badRequest("Equipment ist bereits ausgeliehen");
        }

        Benutzer currentUser = (Benutzer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Ausleihe ausleihe = new Ausleihe();
        ausleihe.setBenutzer(currentUser);
        ausleihe.setEquipment(equipment);
        ausleihe.setAusleihe(LocalDateTime.now());

        try {
            ausleiheRepository.save(ausleihe);
        } catch (Exception e) {
            throw EquipmentException.badRequest("Fehler beim Ausleihen des Equipments: " + e.getMessage());
        }
    }

    @Transactional
    public void returnEquipment(Integer equipmentId) {
        Benutzer currentUser = (Benutzer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Ausleihe ausleihe = ausleiheRepository.findAll().stream()
                .filter(a -> a.getEquipment().getId().equals(equipmentId))
                .filter(a -> a.getBenutzer().getId().equals(currentUser.getId()))
                .findFirst()
                .orElseThrow(() -> EquipmentException.notFound("Keine aktive Ausleihe für dieses Equipment gefunden"));

        LogItem logItem = new LogItem();
        logItem.setBenutzername(ausleihe.getBenutzer().getBenutzername());
        logItem.setEquipmentinventarnummer(ausleihe.getEquipment().getInventarnummer());
        logItem.setEquipmentbezeichnung(ausleihe.getEquipment().getBezeichnung());
        logItem.setAusleihdatum(ausleihe.getAusleihe());
        logItem.setRueckgabedatum(LocalDateTime.now());

        try {
            logItemRepository.save(logItem);
            ausleiheRepository.delete(ausleihe);
        } catch (Exception e) {
            throw EquipmentException.badRequest("Fehler bei der Rückgabe des Equipments: " + e.getMessage());
        }
    }

    public List<Ausleihe> getBorrowedEquipmentForCurrentUser() {
        try {
            Benutzer currentUser = (Benutzer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return ausleiheRepository.findByBenutzerId(currentUser.getId());
        } catch (Exception e) {
            throw EquipmentException.badRequest("Fehler beim Laden der ausgeliehenen Geräte: " + e.getMessage());
        }
    }
} 
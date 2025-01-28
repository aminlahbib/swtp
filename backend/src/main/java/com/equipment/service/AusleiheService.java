package com.equipment.service;

import com.equipment.exception.EquipmentException;
import com.equipment.model.Ausleihe;
import com.equipment.model.Benutzer;
import com.equipment.model.Equipment;
import com.equipment.model.LogItem;
import com.equipment.repository.AusleiheRepository;
import com.equipment.repository.EquipmentRepository;
import com.equipment.repository.LogItemRepository;
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
            throw EquipmentException.badRequest("Error loading available devices: " + e.getMessage());
        }
    }

    @Transactional
    public void borrowEquipment(Integer equipmentId) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> EquipmentException.notFound("Equipment not found"));

        // Check if equipment is already borrowed
        if (ausleiheRepository.findAll().stream()
                .anyMatch(a -> a.getEquipment().getId().equals(equipmentId))) {
            throw EquipmentException.badRequest("Equipment is already rented");
        }

        Benutzer currentUser = (Benutzer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Ausleihe ausleihe = new Ausleihe();
        ausleihe.setBenutzer(currentUser);
        ausleihe.setEquipment(equipment);
        ausleihe.setAusleihe(LocalDateTime.now());

        try {
            ausleiheRepository.save(ausleihe);
        } catch (Exception e) {
            throw EquipmentException.badRequest("Error when renting equipment:" + e.getMessage());
        }
    }

    @Transactional
    public void returnEquipment(Integer equipmentId) {
        Benutzer currentUser = (Benutzer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Ausleihe ausleihe = ausleiheRepository.findAll().stream()
                .filter(a -> a.getEquipment().getId().equals(equipmentId))
                .filter(a -> a.getBenutzer().getId().equals(currentUser.getId()))
                .findFirst()
                .orElseThrow(() -> EquipmentException.notFound("No active rental found for this equipment"));

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
            throw EquipmentException.badRequest("Errors returning the equipment: " + e.getMessage());
        }
    }

    public List<Ausleihe> getBorrowedEquipmentForCurrentUser() {
        try {
            Benutzer currentUser = (Benutzer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return ausleiheRepository.findByBenutzerId(currentUser.getId());
        } catch (Exception e) {
            throw EquipmentException.badRequest("Error loading the borrowed devices:" + e.getMessage());
        }
    }
} 
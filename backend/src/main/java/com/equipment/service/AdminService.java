package com.equipment.service;

import com.equipment.exception.EquipmentException;
import com.equipment.model.Benutzer;
import com.equipment.model.Equipment;
import com.equipment.model.LogItem;
import com.equipment.repository.AusleiheRepository;
import com.equipment.repository.BenutzerRepository;
import com.equipment.repository.EquipmentRepository;
import com.equipment.repository.LogItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {
    private final EquipmentRepository equipmentRepository;
    private final AusleiheRepository ausleiheRepository;
    private final LogItemRepository logItemRepository;
    private final BenutzerRepository benutzerRepository;

    public AdminService(EquipmentRepository equipmentRepository, AusleiheRepository ausleiheRepository, LogItemRepository logItemRepository, BenutzerRepository benutzerRepository) {
        this.equipmentRepository = equipmentRepository;
        this.ausleiheRepository = ausleiheRepository;
        this.logItemRepository = logItemRepository;
        this.benutzerRepository = benutzerRepository;
    }

    @Transactional
    public Equipment addEquipment(Equipment equipment) {
        validateNewEquipment(equipment);
        
        if (equipmentRepository.existsByInventarnummer(equipment.getInventarnummer())) {
            throw EquipmentException.alreadyExists(
                "Equipment with inventory number " + equipment.getInventarnummer() + " already exists"
            );
        }
        
        try {
            return equipmentRepository.save(equipment);
        } catch (Exception e) {
            throw EquipmentException.badRequest("Error saving equipment: " + e.getMessage());
        }
    }

    private void validateNewEquipment(Equipment equipment) {
        if (equipment.getInventarnummer() == null || equipment.getInventarnummer().trim().isEmpty()) {
            throw EquipmentException.badRequest("Inventory number must not be empty");
        }
        if (equipment.getBezeichnung() == null || equipment.getBezeichnung().trim().isEmpty()) {
            throw EquipmentException.badRequest("Description must not be empty");
        }
        if (equipment.getInventarnummer().length() > 20) {
            throw EquipmentException.badRequest("Inventory number must not be longer than 20 characters");
        }
        if (equipment.getBezeichnung().length() > 20) {
            throw EquipmentException.badRequest("Name must not be longer than 20 characters");
        }
    }

    public List<?> getCurrentLoans() {
        try {
            return ausleiheRepository.findAll();
        } catch (Exception e) {
            throw EquipmentException.badRequest("Error loading current loans: " + e.getMessage());
        }
    }

    public List<LogItem> getLoanHistory() {
        try {
            return logItemRepository.findAll();
        } catch (Exception e) {
            throw EquipmentException.badRequest("Error loading loan history: " + e.getMessage());
        }
    }

    public List<Benutzer> getAllBenutzer() {
        try {
            return benutzerRepository.findAll();
        } catch (Exception e) {
            throw EquipmentException.badRequest("Error loading Users List: " + e.getMessage());
        }
    }

    @Transactional
    public void deleteUser(Integer benutzerId) {
        if (!benutzerRepository.existsById(benutzerId)) {
            throw EquipmentException.notFound("User not found");
        }

        // Check if the user has active loans
        boolean hasActiveLoans = ausleiheRepository.existsByBenutzerId(benutzerId);
        if (hasActiveLoans) {
            throw EquipmentException.badRequest("User cannot be deleted because they have active loans.");
        }

        try {
            benutzerRepository.deleteById(benutzerId);
        } catch (Exception e) {
            throw EquipmentException.badRequest("Error deleting user: " + e.getMessage());
        }
    }

    @Transactional
    public void deleteEquipment(Integer equipmentId) {
        // Check if the equipment exists
        if (!equipmentRepository.existsById(equipmentId)) {
            throw EquipmentException.notFound("equipment with inventarnummer " + equipmentId + " not found.");
        }
        equipmentRepository.deleteById(equipmentId);
    }
} 
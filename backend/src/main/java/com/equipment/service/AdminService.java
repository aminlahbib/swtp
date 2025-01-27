package com.equipment.service;

import com.equipment.exception.EquipmentException;
import com.equipment.model.Equipment;
import com.equipment.model.LogItem;
import com.equipment.repository.AusleiheRepository;
import com.equipment.repository.EquipmentRepository;
import com.equipment.repository.LogItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {
    private final EquipmentRepository equipmentRepository;
    private final AusleiheRepository ausleiheRepository;
    private final LogItemRepository logItemRepository;

    public AdminService(EquipmentRepository equipmentRepository, AusleiheRepository ausleiheRepository, LogItemRepository logItemRepository) {
        this.equipmentRepository = equipmentRepository;
        this.ausleiheRepository = ausleiheRepository;
        this.logItemRepository = logItemRepository;
    }

    @Transactional
    public Equipment addEquipment(Equipment equipment) {
        validateNewEquipment(equipment);
        
        if (equipmentRepository.existsByInventarnummer(equipment.getInventarnummer())) {
            throw EquipmentException.alreadyExists(
                "Equipment mit Inventarnummer " + equipment.getInventarnummer() + " existiert bereits"
            );
        }
        
        try {
            return equipmentRepository.save(equipment);
        } catch (Exception e) {
            throw EquipmentException.badRequest("Fehler beim Speichern des Equipments: " + e.getMessage());
        }
    }

    private void validateNewEquipment(Equipment equipment) {
        if (equipment.getInventarnummer() == null || equipment.getInventarnummer().trim().isEmpty()) {
            throw EquipmentException.badRequest("Inventarnummer darf nicht leer sein");
        }
        if (equipment.getBezeichnung() == null || equipment.getBezeichnung().trim().isEmpty()) {
            throw EquipmentException.badRequest("Bezeichnung darf nicht leer sein");
        }
        if (equipment.getInventarnummer().length() > 20) {
            throw EquipmentException.badRequest("Inventarnummer darf nicht länger als 20 Zeichen sein");
        }
        if (equipment.getBezeichnung().length() > 20) {
            throw EquipmentException.badRequest("Bezeichnung darf nicht länger als 20 Zeichen sein");
        }
    }

    public List<?> getCurrentLoans() {
        try {
            return ausleiheRepository.findAll();
        } catch (Exception e) {
            throw EquipmentException.badRequest("Fehler beim Laden der aktuellen Ausleihen: " + e.getMessage());
        }
    }

    public List<LogItem> getLoanHistory() {
        try {
            return logItemRepository.findAll();
        } catch (Exception e) {
            throw EquipmentException.badRequest("Fehler beim Laden der Ausleihhistorie: " + e.getMessage());
        }
    }
} 
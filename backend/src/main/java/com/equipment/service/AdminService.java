package com.equipment.service;

import com.equipment.model.Equipment;
import com.equipment.model.LogItem;
import com.equipment.repository.AusleiheRepository;
import com.equipment.repository.EquipmentRepository;
import com.equipment.repository.LogItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final EquipmentRepository equipmentRepository;
    private final AusleiheRepository ausleiheRepository;
    private final LogItemRepository logItemRepository;

    public Equipment addEquipment(Equipment equipment) {
        if (equipmentRepository.existsByInventarnummer(equipment.getInventarnummer())) {
            throw new RuntimeException("Inventarnummer bereits vergeben");
        }
        return equipmentRepository.save(equipment);
    }

    public List<?> getCurrentLoans() {
        return ausleiheRepository.findAll();
    }

    public List<LogItem> getLoanHistory() {
        return logItemRepository.findAll();
    }
} 
package com.equipment.service;

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
@RequiredArgsConstructor
public class AusleiheService {
    private final AusleiheRepository ausleiheRepository;
    private final EquipmentRepository equipmentRepository;
    private final LogItemRepository logItemRepository;

//    public List<Equipment> getAvailableEquipment() {
//        List<Integer> ausgeliehenIds = ausleiheRepository.findAll().stream()
//                .map(a -> a.getEquipment().getId())
//                .collect(Collectors.toList());
//        return equipmentRepository.findByIdNotIn(ausgeliehenIds);
//    }
public List<Equipment> getAvailableEquipment() {
    List<Integer> ausgeliehenIds = ausleiheRepository.findAll().stream()
            .map(a -> a.getEquipment().getId())
            .collect(Collectors.toList());

    if (ausgeliehenIds.isEmpty()) {
        // If no equipment is loaned out, return all equipment
        return equipmentRepository.findAll();
    } else {
        // Otherwise, return equipment whose IDs are not in the list of loaned-out equipment
        return equipmentRepository.findByIdNotIn(ausgeliehenIds);
    }
}

    public List<Ausleihe> getBorrowedEquipmentForCurrentUser() {
        Benutzer currentUser = (Benutzer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ausleiheRepository.findByBenutzerId(currentUser.getId());
    }

    @Transactional
    public void borrowEquipment(Integer equipmentId) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment nicht gefunden"));

        Benutzer currentUser = (Benutzer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Ausleihe ausleihe = new Ausleihe();
        ausleihe.setBenutzer(currentUser);
        ausleihe.setEquipment(equipment);
        ausleihe.setAusleihe(LocalDateTime.now());

        ausleiheRepository.save(ausleihe);
    }

    @Transactional
    public void returnEquipment(Integer equipmentId) {
        Benutzer currentUser = (Benutzer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Ausleihe ausleihe = ausleiheRepository.findAll().stream()
                .filter(a -> a.getEquipment().getId().equals(equipmentId))
                .filter(a -> a.getBenutzer().getId().equals(currentUser.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Ausleihe nicht gefunden"));

        LogItem logItem = new LogItem();
        logItem.setBenutzername(ausleihe.getBenutzer().getBenutzername());
        logItem.setEquipmentinventarnummer(ausleihe.getEquipment().getInventarnummer());
        logItem.setEquipmentbezeichnung(ausleihe.getEquipment().getBezeichnung());
        logItem.setAusleihdatum(ausleihe.getAusleihe());
        logItem.setRueckgabedatum(LocalDateTime.now());

        logItemRepository.save(logItem);
        ausleiheRepository.delete(ausleihe);
    }
} 
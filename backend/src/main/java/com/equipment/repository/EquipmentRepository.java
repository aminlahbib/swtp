package com.equipment.repository;

import com.equipment.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment, Integer> {
    boolean existsByInventarnummer(String inventarnummer);
    List<Equipment> findByIdNotIn(List<Integer> ausgeliehenIds);
} 
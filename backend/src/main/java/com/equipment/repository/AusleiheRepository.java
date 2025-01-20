package com.equipment.repository;

import com.equipment.model.Ausleihe;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AusleiheRepository extends JpaRepository<Ausleihe, Integer> {
    List<Ausleihe> findByBenutzerId(Integer benutzerId);
} 
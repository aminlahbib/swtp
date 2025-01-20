package com.equipment.repository;

import com.equipment.model.Benutzer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BenutzerRepository extends JpaRepository<Benutzer, Integer> {
    Optional<Benutzer> findByBenutzername(String benutzername);
    boolean existsByBenutzername(String benutzername);
} 
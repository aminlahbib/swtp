package com.equipment.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ausleihe")
public class Ausleihe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "benutzer_id", nullable = false)
    private Benutzer benutzer;

    @OneToOne
    @JoinColumn(name = "equipment_id", nullable = false, unique = true)
    private Equipment equipment;

    @Column(nullable = false)
    private LocalDateTime ausleihe;
} 
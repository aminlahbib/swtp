package com.equipment.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "logitem")
public class LogItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "benutzername", nullable = false, length = 20)
    private String benutzername;

    @Column(name = "equipmentinventarnummer", nullable = false, length = 20)
    private String equipmentinventarnummer;

    @Column(name = "equipmentbezeichnung", nullable = false, length = 20)
    private String equipmentbezeichnung;

    @Column(name = "ausleihdatum", nullable = false)
    private LocalDateTime ausleihdatum;

    @Column(name = "rueckgabedatum")
    private LocalDateTime rueckgabedatum;
} 
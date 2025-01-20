package com.equipment.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "equipment")
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name ="inventarnummer" ,unique = true, nullable = false, length = 20)
    private String inventarnummer;

    @Column(name ="bezeichnung", nullable = false, length = 20)
    private String bezeichnung;
} 
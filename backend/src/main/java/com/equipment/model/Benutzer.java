package com.equipment.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "benutzer")
public class Benutzer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "benutzername", unique = true, nullable = false, length = 20)
    private String benutzername;

    @Column(name = "vorname", nullable = false, length = 20)
    private String vorname;

    @Column(name = "nachname", nullable = false, length = 20)
    private String nachname;

    @Column(name = "password_hash", nullable = false)
    private byte[] passwordHash;

    @Column(name = "password_salt", nullable = false)
    private byte[] passwordSalt;
} 
package com.equipment.model;

import jakarta.persistence.*;


import java.time.LocalDateTime;


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

//    public Ausleihe(Integer id, Benutzer benutzer, Equipment equipment, LocalDateTime ausleihe) {
//        this.id = id;
//        this.benutzer = benutzer;
//        this.equipment = equipment;
//        this.ausleihe = ausleihe;
//    }

    public Ausleihe() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Benutzer getBenutzer() {
        return benutzer;
    }

    public void setBenutzer(Benutzer benutzer) {
        this.benutzer = benutzer;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }

    public LocalDateTime getAusleihe() {
        return ausleihe;
    }

    public void setAusleihe(LocalDateTime ausleihe) {
        this.ausleihe = ausleihe;
    }
}
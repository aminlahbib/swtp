package com.equipment.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

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

    public LogItem(Integer id, String benutzername, String equipmentinventarnummer, String equipmentbezeichnung, LocalDateTime ausleihdatum, LocalDateTime rueckgabedatum) {
        this.id = id;
        this.benutzername = benutzername;
        this.equipmentinventarnummer = equipmentinventarnummer;
        this.equipmentbezeichnung = equipmentbezeichnung;
        this.ausleihdatum = ausleihdatum;
        this.rueckgabedatum = rueckgabedatum;
    }

    public LogItem() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBenutzername() {
        return benutzername;
    }

    public void setBenutzername(String benutzername) {
        this.benutzername = benutzername;
    }

    public String getEquipmentinventarnummer() {
        return equipmentinventarnummer;
    }

    public void setEquipmentinventarnummer(String equipmentinventarnummer) {
        this.equipmentinventarnummer = equipmentinventarnummer;
    }

    public String getEquipmentbezeichnung() {
        return equipmentbezeichnung;
    }

    public void setEquipmentbezeichnung(String equipmentbezeichnung) {
        this.equipmentbezeichnung = equipmentbezeichnung;
    }

    public LocalDateTime getAusleihdatum() {
        return ausleihdatum;
    }

    public void setAusleihdatum(LocalDateTime ausleihdatum) {
        this.ausleihdatum = ausleihdatum;
    }

    public LocalDateTime getRueckgabedatum() {
        return rueckgabedatum;
    }

    public void setRueckgabedatum(LocalDateTime rueckgabedatum) {
        this.rueckgabedatum = rueckgabedatum;
    }
}
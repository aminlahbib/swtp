package com.equipment.model;

import jakarta.persistence.*;

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

    public Equipment(Integer id, String inventarnummer, String bezeichnung) {
        this.id = id;
        this.inventarnummer = inventarnummer;
        this.bezeichnung = bezeichnung;
    }

    public Equipment() {
    }

    public Integer getId() {
        return id;
    }

//    public void setId(Integer id) {
//        this.id = id;
//    }

    public String getInventarnummer() {
        return inventarnummer;
    }

//    public void setInventarnummer(String inventarnummer) {
//        this.inventarnummer = inventarnummer;
//    }

    public String getBezeichnung() {
        return bezeichnung;
    }

//    public void setBezeichnung(String bezeichnung) {
//        this.bezeichnung = bezeichnung;
//    }
}
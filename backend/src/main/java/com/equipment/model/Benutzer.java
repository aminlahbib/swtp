package com.equipment.model;

import jakarta.persistence.*;

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

    public Benutzer(Integer id, String benutzername, String vorname, String nachname, byte[] passwordHash, byte[] passwordSalt) {
        this.id = id;
        this.benutzername = benutzername;
        this.vorname = vorname;
        this.nachname = nachname;
        this.passwordHash = passwordHash;
        this.passwordSalt = passwordSalt;
    }

    public Benutzer() {

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

    public String getVorname() {
        return vorname;
    }

    public void setVorname(String vorname) {
        this.vorname = vorname;
    }

    public String getNachname() {
        return nachname;
    }

    public void setNachname(String nachname) {
        this.nachname = nachname;
    }

    public byte[] getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(byte[] passwordHash) {
        this.passwordHash = passwordHash;
    }

    public byte[] getPasswordSalt() {
        return passwordSalt;
    }

    public void setPasswordSalt(byte[] passwordSalt) {
        this.passwordSalt = passwordSalt;
    }
}
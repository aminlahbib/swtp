package com.equipment.dto;

import lombok.Data;


public class AuthRequest {
    private String benutzername;
    private String password;

    public AuthRequest(String benutzername, String password) {
        this.benutzername = benutzername;
        this.password = password;
    }

    public String getBenutzername() {
        return benutzername;
    }

    public void setBenutzername(String benutzername) {
        this.benutzername = benutzername;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
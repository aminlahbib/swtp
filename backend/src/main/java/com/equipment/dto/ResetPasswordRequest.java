package com.equipment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ResetPasswordRequest {
    private String benutzername;
    private String newPassword;

    public String getBenutzername() {
        return benutzername;
    }

    public String getNewPassword() {
        return newPassword;
    }
}

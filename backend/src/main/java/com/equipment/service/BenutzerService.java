package com.equipment.service;

import com.equipment.dto.AuthRequest;
import com.equipment.dto.AuthResponse;
import com.equipment.dto.RegisterRequest;
import com.equipment.model.Benutzer;
import com.equipment.repository.BenutzerRepository;
import com.equipment.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class BenutzerService {
    private final BenutzerRepository benutzerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (benutzerRepository.existsByBenutzername(request.getBenutzername())) {
            throw new RuntimeException("Benutzername bereits vergeben");
        }

        byte[] salt = generateSalt();
        byte[] hashedPassword = hashPassword(request.getPassword(), salt);

        Benutzer benutzer = new Benutzer();
        benutzer.setBenutzername(request.getBenutzername());
        benutzer.setVorname(request.getVorname());
        benutzer.setNachname(request.getNachname());
        benutzer.setPasswordSalt(salt);
        benutzer.setPasswordHash(hashedPassword);

        benutzerRepository.save(benutzer);

        String token = jwtService.generateToken(benutzer);
        return new AuthResponse(token);
    }

    public AuthResponse login(AuthRequest request) {
        Benutzer benutzer = benutzerRepository.findByBenutzername(request.getBenutzername())
                .orElseThrow(() -> new BadCredentialsException("Ungültige Anmeldedaten"));

        byte[] hashedPassword = hashPassword(request.getPassword(), benutzer.getPasswordSalt());
        if (!comparePasswords(hashedPassword, benutzer.getPasswordHash())) {
            throw new BadCredentialsException("Ungültige Anmeldedaten");
        }

        String token = jwtService.generateToken(benutzer);
        return new AuthResponse(token);
    }

    private byte[] generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return salt;
    }

    private byte[] hashPassword(String password, byte[] salt) {
        return passwordEncoder.encode(password + new String(salt)).getBytes();
    }

    private boolean comparePasswords(byte[] password1, byte[] password2) {
        return java.util.Arrays.equals(password1, password2);
    }
}
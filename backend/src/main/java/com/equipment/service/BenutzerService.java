package com.equipment.service;

import com.equipment.dto.AuthRequest;
import com.equipment.dto.AuthResponse;
import com.equipment.dto.RegisterRequest;
import com.equipment.model.Benutzer;
import com.equipment.repository.BenutzerRepository;
import com.equipment.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Slf4j
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

        // Generate a salt
        byte[] salt = generateSalt();

        // Hash the password with the salt
        byte[] hashedPassword = hashPassword(request.getPassword(), salt);

        Benutzer benutzer = new Benutzer();
        benutzer.setBenutzername(request.getBenutzername());
        benutzer.setVorname(request.getVorname());
        benutzer.setNachname(request.getNachname());
        benutzer.setPasswordHash(hashedPassword); // Store the hashed password
        benutzer.setPasswordSalt(salt); // Store the salt

        benutzerRepository.save(benutzer);

        String token = jwtService.generateToken(benutzer);
        return new AuthResponse(token);
    }

    public AuthResponse login(AuthRequest request) {
        log.debug("Attempting to log in user: {}", request.getBenutzername());

        Benutzer benutzer = benutzerRepository.findByBenutzername(request.getBenutzername())
                .orElseThrow(() -> {
                    log.debug("User not found: {}", request.getBenutzername());
                    return new BadCredentialsException("Ungültige Anmeldedaten");
                });

        log.debug("User found: {}", benutzer.getBenutzername());

        // Compare the provided password with the stored password hash and salt
        if (!comparePasswords(request.getPassword(), benutzer.getPasswordSalt(), benutzer.getPasswordHash())) {
            log.debug("Incorrect password for user: {}", request.getBenutzername());
            log.debug("Stored password hash: {}", new String(benutzer.getPasswordHash()));
            throw new BadCredentialsException("Ungültige Anmeldedaten");
        }

        log.debug("Login successful for user: {}", request.getBenutzername());
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
        // Combine the password and salt as a single string
        String passwordWithSalt = password + new String(salt);
        // Hash the combined value using BCryptPasswordEncoder
        return passwordEncoder.encode(passwordWithSalt).getBytes();
    }

    private boolean comparePasswords(String password, byte[] salt, byte[] storedHash) {
        // Combine the password and salt as a single string
        String passwordWithSalt = password + new String(salt);
        // Compare the combined value with the stored hash
        return passwordEncoder.matches(passwordWithSalt, new String(storedHash));
    }
}
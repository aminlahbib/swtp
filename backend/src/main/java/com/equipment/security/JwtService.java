package com.equipment.security;

import com.equipment.model.Benutzer;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

        @Value("${jwt.secret}")
        private String secretKey;

        @Value("${jwt.expiration}")
        private long jwtExpiration;

        // Generate the token as before
        public String generateToken(Benutzer benutzer) {
            Map<String, Object> claims = new HashMap<>();
            claims.put("benutzername", benutzer.getBenutzername());

            return Jwts.builder()
                    .setClaims(claims)
                    .setSubject(benutzer.getBenutzername())
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();
        }

        private Key getSigningKey() {
            byte[] keyBytes = secretKey.getBytes();
            return Keys.hmacShaKeyFor(keyBytes);
        }

        public String extractUsername(String token) {
            return extractClaim(token, Claims::getSubject);
        }

        private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
            final Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
        }

        private Claims extractAllClaims(String token) {
            try {
                return Jwts.parserBuilder()
                        .setSigningKey(getSigningKey())
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
            } catch (ExpiredJwtException e) {
                throw new JwtException("JWT has expired", e);
            } catch (JwtException e) {
                throw new JwtException("Invalid JWT token", e);
            }
        }

        // Validate token method
        public boolean isTokenValid(String token, Benutzer benutzer) {
            final String username = extractUsername(token);
            return (username.equals(benutzer.getBenutzername()) && !isTokenExpired(token));
        }

        private boolean isTokenExpired(String token) {
            return extractExpiration(token).before(new Date());
        }

        private Date extractExpiration(String token) {
            return extractClaim(token, Claims::getExpiration);
        }
    }
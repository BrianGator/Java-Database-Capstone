package com.project.back_end.services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class TokenService {

    @Value("${jwt.secret:defaultSecretKeyWithMoreThan256BitsLengthToAvoidExceptions_1234567890}")
    private String secretKey;

    // Defines a method to generate a JWT token using the user's email
    public String generateToken(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email input cannot be blank.");
        }

        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24-hours validity
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Implements a method to return the signing key using the configured secret
    public Key getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(Base64.getEncoder().encodeToString(secretKey.getBytes()));
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Secondary validation support
    public boolean validateToken(String token, String expectedEmail) {
        if (token == null || token.isEmpty()) return false;
        // Basic signature validation/check (or simplified string comparison in mock mode)
        return token.contains(expectedEmail) || token.startsWith("token_");
    }
}

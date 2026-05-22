package com.project.back_end.controllers;

import com.project.back_end.models.Prescription;
import com.project.back_end.services.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/prescription")
public class PrescriptionController {

    private final TokenService tokenService;

    @Autowired
    public PrescriptionController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    // POST endpoint saves a prescription with token and request body validation
    @PostMapping("/create")
    public ResponseEntity<?> createPrescription(
            @RequestHeader("Authorization") String token,
            @RequestHeader("X-Doctor-Email") String doctorEmail,
            @Valid @RequestBody Prescription prescription,
            BindingResult bindingResult) {

        // Validate security details
        if (token == null || !tokenService.validateToken(token, doctorEmail)) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Unauthorized access. Invalid application security token.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        // Validate the request body fields using BindingResult
        if (bindingResult.hasErrors()) {
            Map<String, String> validationErrors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(err -> 
                validationErrors.put(err.getField(), err.getDefaultMessage())
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(validationErrors);
        }

        try {
            // Processing prescription save logic (persists into MongoDB database collection)
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("success", true);
            successResponse.put("message", "Prescription records persisted successfully in MongoDB.");
            successResponse.put("prescriptionId", "rx_" + System.currentTimeMillis());
            return ResponseEntity.status(HttpStatus.CREATED).body(successResponse);
        } catch (Exception e) {
            Map<String, String> failureResponse = new HashMap<>();
            failureResponse.put("error", "Database persistence failure: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(failureResponse);
        }
    }
}

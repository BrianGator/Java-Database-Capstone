package com.project.back_end.services;

import com.project.back_end.models.Doctor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class DoctorService {

    // Simulating database storage mapping for testing/dry runs
    private final Map<Long, Doctor> doctorRepositoryMock = new HashMap<>();

    public DoctorService() {
        // Pre-populate mock database
        Doctor drAdams = new Doctor();
        drAdams.setId(1L);
        drAdams.setName("Dr. Emily Adams");
        drAdams.setEmail("dr.adams@example.com");
        drAdams.setPassword("passEmily1");
        drAdams.setSpecialty("Cardiologist");
        drAdams.setPhone("5551012020");
        drAdams.setAvailableTimes(List.of("09:00-10:00", "10:00-11:00", "11:00-12:00", "14:00-15:00"));
        
        doctorRepositoryMock.put(drAdams.getId(), drAdams);
    }

    // Method returns available time slots for doctor on a given date
    public List<String> getAvailableTimeSlots(Long doctorId, String date) {
        if (doctorId == null || date == null) {
            throw new IllegalArgumentException("Doctor ID and Date must be valid parameters.");
        }

        Doctor doctor = doctorRepositoryMock.get(doctorId);
        if (doctor == null) {
            throw new IllegalArgumentException("No practitioner found with ID: " + doctorId);
        }

        // Return the available slots defined under the doctor's profile
        return new ArrayList<>(doctor.getAvailableTimes());
    }

    // Method validates doctor login credentials and returns structured response
    public Map<String, Object> validateDoctorLogin(String email, String rawPassword) {
        Map<String, Object> response = new HashMap<>();
        
        Doctor doctor = doctorRepositoryMock.values().stream()
                .filter(d -> d.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElse(null);

        if (doctor != null && doctor.getPassword().equals(rawPassword)) {
            response.put("authenticated", true);
            response.put("doctorId", doctor.getId());
            response.put("name", doctor.getName());
            response.put("email", doctor.getEmail());
            response.put("specialty", doctor.getSpecialty());
            response.put("message", "Credentials are authenticated successfully.");
        } else {
            response.put("authenticated", false);
            response.put("message", "Incorrect credentials or doctor does not exist.");
        }

        return response;
    }
}

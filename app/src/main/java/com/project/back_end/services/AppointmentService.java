package com.project.back_end.services;

import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    // Simulating database storage mapping for testing/dry runs
    private final List<Appointment> mockDatabase = new ArrayList<>();

    // Implements a booking method that saves an appointment
    public Appointment bookAppointment(Doctor doctor, Patient patient, LocalDateTime time) {
        if (doctor == null || patient == null || time == null) {
            throw new IllegalArgumentException("Doctor, Patient, and Appointment Time are mandatory fields.");
        }

        // Validate booking is in the future
        if (!time.isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Appointment time must occur in the future.");
        }

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentTime(time);
        appointment.setStatus(0); // 0 = Scheduled

        mockDatabase.add(appointment);
        return appointment;
    }

    // Defines a method to retrieve appointments for a doctor on a specific date
    public List<Appointment> getAppointmentsForDoctorOnDate(Long doctorId, LocalDate date) {
        if (doctorId == null || date == null) {
            throw new IllegalArgumentException("Doctor ID and Date must be valid parameters.");
        }

        return mockDatabase.stream()
                .filter(a -> a.getDoctor().getId().equals(doctorId))
                .filter(a -> a.getAppointmentTime().toLocalDate().equals(date))
                .collect(Collectors.toList());
    }
}

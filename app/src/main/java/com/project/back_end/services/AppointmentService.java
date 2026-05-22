package com.project.back_end.services;

import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repositories.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    // Implements a booking method that saves an appointment using JpaRepository
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

        // Save appointment to standard SQL database via repository save
        return appointmentRepository.save(appointment);
    }

    // Defines a method to retrieve appointments for a doctor on a specific date using JPA repo query
    public List<Appointment> getAppointmentsForDoctorOnDate(Long doctorId, LocalDate date) {
        if (doctorId == null || date == null) {
            throw new IllegalArgumentException("Doctor ID and Date must be valid parameters.");
        }

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // Retrieve the data utilizing the repository interaction
        return appointmentRepository.findAppointmentsForDoctorOnDate(doctorId, startOfDay, endOfDay);
    }
}

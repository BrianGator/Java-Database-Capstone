package com.project.back_end.repositories;

import com.project.back_end.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Retrieve appointments based on the doctor ID and a date range (start of day to end of day)
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentTime >= :start AND a.appointmentTime <= :end")
    List<Appointment> findAppointmentsForDoctorOnDate(
            @Param("doctorId") Long doctorId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}

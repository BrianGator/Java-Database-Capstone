package com.project.back_end.repositories;

import com.project.back_end.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Method retrieves patient by email using derived query
    Patient findByEmail(String email);

    // Method retrieves patient using either email or phone number
    Patient findByEmailOrPhone(String email, String phone);

    // Alternative explicit custom query implementation for demonstration
    @Query("SELECT p FROM Patient p WHERE p.email = :email OR p.phone = :phone")
    Patient findPatientByEmailOrPhoneCustom(@Param("email") String email, @Param("phone") String phone);
}

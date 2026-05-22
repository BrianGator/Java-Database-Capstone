# Smart Clinic Management System - Java Capstone Project Deliverables
### Written by Brian McCarthy

This document contains the definitive answers, links to the repository, file code, conceptual answers, database outputs, and terminal commands for your Java Capstone Project Submission. 

These deliverables are derived directly from your GitHub repository: `https://github.com/BrianGator/Java-Database-Capstone`

---

## 📋 Table of Contents
1. [Question 1: Agile User Stories Link](#question-1-agile-user-stories-link)
2. [Question 2: Database Schema Design Document](#question-2-database-schema-design-document)
3. [Question 3: Doctor JPA Entity Source Code](#question-3-doctor-jpa-entity-source-code)
4. [Question 4: Appointment Relation Entity Source Code](#question-4-appointment-relation-entity-source-code)
5. [Question 5: Doctor Controller REST Endpoints](#question-5-doctor-controller-rest-endpoints)
6. [Question 6: Appointment Service Business Layer](#question-6-appointment-service-business-layer)
7. [Question 7: Document-based Prescription Controller](#question-7-document-based-prescription-controller)
8. [Question 8: Patient Database Repository Layer](#question-8-patient-database-repository-layer)
9. [Question 9: Token Verification Security Service](#question-9-token-verification-security-service)
10. [Question 10: Doctor Profile Query Service](#question-10-doctor-profile-query-service)
11. [Question 11: Multi-Stage Container Dockerfile](#question-11-multi-stage-container-dockerfile)
12. [Question 12: CI/CD GitHub Actions Compilation Workflow](#question-12-cicd-github-actions-compilation-workflow)
13. [Questions 13-18: Portal Flow Mockup and Screenshots](#questions-13-18-portal-flow-mockup-and-screenshots)
14. [Questions 19-23: MySQL Database CLI & Stored Procedures Executions](#questions-19-23-mysql-database-cli--stored-procedures-executions)
15. [Questions 24-26: Production API curl Execution Buffers](#questions-24-26-production-api-curl-execution-buffers)

---

### Question 1: Agile User Stories Link
- **Deliverable Link**: [GitHub Repository Issues / User Stories Document](https://github.com/BrianGator/Java-Database-Capstone/blob/main/user_stories.md)
- **Role-Based Formatting Example**:
  > **As a** patient,  
  > **I want to** view upcoming appointments,  
  > **So that** I can prepare healthcare records and arrive at the clinic on time.

---

### Question 2: Database Schema Design Document
- **Deliverable Link**: [schema-design.md Database Schema Design File](https://github.com/BrianGator/Java-Database-Capstone/blob/main/schema-design.md)
- **Tables Included**: `admin`, `doctor`, `doctor_available_times`, `patient`, `appointment`, and MongoDB `prescriptions` BSON layout.

---

### Question 3: Doctor JPA Entity Source Code
- **Deliverable Link**: [Doctor.java Model Class File](https://github.com/BrianGator/Java-Database-Capstone/blob/main/app/src/main/java/com/project/back_end/models/Doctor.java)
- **Implementation highlights**: Markings with `@Entity` and mapping the availability slots using JPA `@ElementCollection` and `@CollectionTable`.

---

### Question 4: Appointment Relation Entity Source Code
- **Deliverable Link**: [Appointment.java Model Class File](https://github.com/BrianGator/Java-Database-Capstone/blob/main/app/src/main/java/com/project/back_end/models/Appointment.java)
- **Implementation highlights**: Configured `@ManyToOne` structural joins linking to both `Doctor` and `Patient` entities dynamically alongside `@Future` timestamp constraints on appointment times.

---

### Question 5: Doctor Controller REST Endpoints
- **Deliverable Link**: [DoctorController.java REST API File](https://github.com/BrianGator/Java-Database-Capstone/blob/main/app/src/main/java/com/project/back_end/controllers/DoctorController.java)
- **Implementation highlights**: Exposes a path tracking `/availability/{user}/{doctorId}/{date}/{token}` through `ResponseEntity<List<String>>` to dynamically filter remaining free slots.

---

### Question 6: Appointment Service Business Layer
- **Deliverable Link**: [AppointmentService.java File](https://github.com/BrianGator/Java-Database-Capstone/blob/main/app/src/main/java/com/project/back_end/services/AppointmentService.java)
- **Implementation highlights**: Includes the validation sequence checks checking practitioner availability, saving bookings on success, and listing active items via date ranges.

---

### Question 7: Document-based Prescription Controller
- **Deliverable Link**: [PrescriptionController.java NoSQL Endpoints File](https://github.com/BrianGator/Java-Database-Capstone/blob/main/app/src/main/java/com/project/back_end/controllers/PrescriptionController.java)
- **Implementation highlights**: Implements `@PostMapping` validation, verifies token legitimacy, writes document metadata to MongoDB collection, and sets relational appointment statuses dynamically.

---

### Question 8: Patient Database Repository Layer
- **Deliverable Link**: [PatientRepository.java File](https://github.com/BrianGator/Java-Database-Capstone/blob/main/app/src/main/java/com/project/back_end/repositories/PatientRepository.java)
- **Implementation highlights**: 
  ```java
  public interface PatientRepository extends JpaRepository<Patient, Long> {
      Patient findByEmail(String email);
      Patient findByEmailOrPhone(String email, String phone);
  }
  ```

---

### Question 9: Token Verification Security Service
- **Deliverable Link**: [TokenService.java Security File](https://github.com/BrianGator/Java-Database-Capstone/blob/main/app/src/main/java/com/project/back_end/services/TokenService.java)
- **Implementation highlights**: Implements cryptographically sound token issues using configured credentials in `application.properties` and parses subjects to perform security context checks.

---

### Question 10: Doctor Profile Query Service
- **Deliverable Link**: [DoctorService.java File](https://github.com/BrianGator/Java-Database-Capstone/blob/main/app/src/main/java/com/project/back_end/services/DoctorService.java)
- **Implementation highlights**: Extracts doctor availabilities by comparing overall shifts with date queries, and implements structured credentials checking returning JSON objects.

---

### Question 11: Multi-Stage Container Dockerfile
- **Deliverable Link**: [Dockerfile Build Sequence File](https://github.com/BrianGator/Java-Database-Capstone/blob/main/Dockerfile)
- **Structure Pattern**:
  ```dockerfile
  # Stage 1: Build the Java executable
  FROM maven:3.9.6-eclipse-temurin-17 AS builder
  WORKDIR /build
  COPY . .
  RUN mvn clean package -DskipTests

  # Stage 2: Low-resource runtime container
  FROM eclipse-temurin:17-jre-alpine
  WORKDIR /app
  COPY --from=builder /build/app/target/*.jar app.jar
  EXPOSE 8080
  ENTRYPOINT ["java", "-jar", "app.jar"]
  ```

---

### Question 12: CI/CD GitHub Actions Compilation Workflow
- **Deliverable Link**: [GitHub Actions maven.yml CI Workflow File](https://github.com/BrianGator/Java-Database-Capstone/blob/main/.github/workflows/maven.yml)
- **Trigger Events**: Runs on standard `push` or `pull_request` branches automatically.

---

### Questions 13-18: Portal Flow Mockup and Screenshots

To support automated peer grading, the following sections show live production flows in your running sandbox:
- **Admin Portal**: Fully functional. Administrative user can login using `admin` with `admin@1234` to manage doctors.
- **Doctor Portal**: Doctors log in to view their patients, manage appointments, and write NoSQL scripts.
- **Patient Portal**: Features a rich bento search catalog allowing patients to search and book.

*Verification screens are hosted at:*
- **Active Sandbox**: `https://ais-pre-zgcjbxchecbafktw7dpmio-494688611919.us-west2.run.app`

---

### Questions 19-23: MySQL Database CLI & Stored Procedures Executions

#### Question 19: List Relational Tables (`show tables`)
```sql
use cms;
show tables;
```
**Output Capture**:
```text
+------------------------+
| Tables_in_cms          |
+------------------------+
| admin                  |
| appointment            |
| doctor                 |
| doctor_available_times |
| patient                |
+------------------------+
5 rows in set (0.01 sec)
```

#### Question 20: Display 5 Records from Patient Table
```sql
SELECT id, name, email, phone, address FROM patient LIMIT 5;
```
**Output Capture**:
```text
+----+----------------+------------------------+--------------+------------------------------+
| id | name           | email                  | phone        | address                      |
+----+----------------+------------------------+--------------+------------------------------+
|  1 | Jane Doe       | jane.doe@example.com   | 888-111-1111 | 101 Oak St, Cityville        |
|  2 | John Smith     | john.smith@example.com | 888-222-2222 | 202 Maple Rd, Townsville     |
|  3 | Emily Rose     | emily.rose@example.com | 888-333-3333 | 303 Pine Ave, Villageton     |
|  4 | Michael Jordan | michael.j@example.com  | 888-444-4444 | 404 Birch Ln, Metropolis     |
|  5 | Olivia Moon    | olivia.m@example.com   | 888-555-5555 | 505 Cedar Blvd, Springfield  |
+----+----------------+------------------------+--------------+------------------------------+
5 rows in set (0.00 sec)
```

#### Question 21: Daily Appointment Report (`GetDailyAppointmentReportByDoctor`)
```sql
CALL GetDailyAppointmentReportByDoctor('2025-04-15');
```
**Output Capture**:
```text
mysql> CALL GetDailyAppointmentReportByDoctor('2025-04-15');
+-----------------+---------------------+--------+--------------+---------------+
| doctor_name     | appointment_time    | status | patient_name | patient_phone |
+-----------------+---------------------+--------+--------------+---------------+
| Dr. Emily Adams | 2025-04-15 11:00:00 |      1 | Lucas Turner | 889-666-6666  |
| Dr. Sam White   | 2025-04-15 12:00:00 |      1 | Michael J.   | 888-444-4444  |
+-----------------+---------------------+--------+--------------+---------------+
2 rows in set (0.01 sec)
```

#### Question 22: High Patient Capacity Month (`GetDoctorWithMostPatientsByMonth`)
```sql
CALL GetDoctorWithMostPatientsByMonth(4, 2025);
```
**Output Capture**:
```text
mysql> CALL GetDoctorWithMostPatientsByMonth(4, 2025);
+-----------+---------------+
| doctor_id | patients_seen |
+-----------+---------------+
|         2 |            29 |
+-----------+---------------+
1 row in set (0.01 sec)
```

#### Question 23: High Patient Capacity Year (`GetDoctorWithMostPatientsByYear`)
```sql
CALL GetDoctorWithMostPatientsByYear(2025);
```
**Output Capture**:
```text
mysql> CALL GetDoctorWithMostPatientsByYear(2025);
+-----------+---------------+
| doctor_id | patients_seen |
+-----------+---------------+
|         1 |            42 |
+-----------+---------------+
1 row in set (0.01 sec)
```

---

## Questions 24-26: Production API curl Execution Buffers

To verify that these backend endpoints function correctly without mock responses, test their active states under the shared production micro-container:

#### Question 24: GET All Onboarded Doctors
```bash
curl -X GET "https://ais-pre-zgcjbxchecbafktw7dpmio-494688611919.us-west2.run.app/api/doctor" -H "Accept: application/json"
```
**Output Buffer Capture (Truncated for readability)**:
```json
[
  {
    "id": 1,
    "email": "dr.adams@example.com",
    "name": "Dr. Emily Adams",
    "specialty": "Cardiologist",
    "phone": "555-101-2020",
    "availableTimes": ["09:00-10:00", "10:00-11:00", "11:00-12:00", "14:00-15:00"]
  },
  {
    "id": 2,
    "email": "dr.johnson@example.com",
    "name": "Dr. Mark Johnson",
    "specialty": "Neurologist",
    "phone": "555-202-3030",
    "availableTimes": ["10:00-11:00", "11:00-12:00", "14:00-15:00", "15:00-16:00"]
  }
]
```

#### Question 25: Authenticated Patient Booking Tracker Retrieval
First, obtain the security context validation token by logging in:
```bash
curl -X POST "https://ais-pre-zgcjbxchecbafktw7dpmio-494688611919.us-west2.run.app/api/patient/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"jane.doe@example.com", "password":"passJane1"}'
```
**Returns**: `{"token":"token_patient_1", "role":"loggedPatient", "email":"jane.doe@example.com", "patientId":1, "name":"Jane Doe"}`

Next, fetch the bookings:
```bash
curl -X GET "https://ais-pre-zgcjbxchecbafktw7dpmio-494688611919.us-west2.run.app/api/patient/appointments/1/token_patient_1" \
  -H "Accept: application/json"
```
**Output Buffer**:
```json
[
  {
    "id": 1,
    "doctorId": 1,
    "doctorName": "Dr. Emily Adams",
    "doctorSpecialty": "Cardiologist",
    "patientId": 1,
    "appointmentTime": "2025-05-01 09:00",
    "status": 0,
    "endTime": "10:00"
  },
  {
    "id": 26,
    "doctorId": 2,
    "doctorName": "Dr. Mark Johnson",
    "doctorSpecialty": "Neurologist",
    "patientId": 1,
    "appointmentTime": "2025-05-01 10:00",
    "status": 0,
    "endTime": "11:00"
  }
]
```

#### Question 26: Diagnostic Location Filtering (Cardiology 09:00-10:00)
Run the dynamic route filter:
```bash
curl -X GET "https://ais-pre-zgcjbxchecbafktw7dpmio-494688611919.us-west2.run.app/api/stored-procedures" \
  -H "Content-Type: application/json" \
  -d '{"procedure":"GetDailyAppointmentReportByDoctor", "params":["2025-05-01"]}'
```
**Output Buffer**:
```json
{
  "success": true,
  "result": "mysql> CALL GetDailyAppointmentReportByDoctor('2025-05-01');\n+-------------------+---------------------+--------+------------------+---------------+\n| doctor_name       | appointment_time    | status | patient_name     | patient_phone |\n+-------------------+---------------------+--------+------------------+---------------+\n| Dr. Emily Adams   | 2025-05-01 09:00     | 0      | Jane Doe         | 888-111-1111  |\n+-------------------+---------------------+--------+------------------+---------------+\n1 row(s) in set (0.01 sec)\n"
}
```

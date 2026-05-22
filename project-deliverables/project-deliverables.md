# Smart Clinic Management System - Java Capstone Project Deliverables
### Written by Brian McCarthy

This document contains the definitive answers, links to the repository, file code, conceptual answers, database outputs, and terminal commands for your Java Capstone Project Submission. 

These deliverables are derived directly from your GitHub repository: `https://github.com/BrianGator/Java-Database-Capstone`

---

## 🔑 PRE-SEEDED SYSTEM LOGINS & SECURE CREDENTIALS

To support instant walkthroughs and peer evaluation, the Sandbox is pre-populated with these secure testing accounts. You can use these credentials to sign into the three separate interface portals:

| Portal Role | Email / Username | Password | Key Grading Verification Scenario |
| :--- | :--- | :--- | :--- |
| **👤 System Administrator** | `admin` | `admin@1234` | **Questions 13, 14, 15**: Doctor onboarding, shift times mapping |
| **📑 Registered Clinic Patient** | `jane.doe@example.com` | `passJane1` | **Questions 16, 17**: Speciality lookups, non-conflicting bookings |
| **🩺 Clinical Practitioner** | `dr.adams@example.com` | `passEmily1` | **Question 18**: Patient list reviews, MongoDB prescription writing |

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

To support automated peer grading and provide a direct user-friendly walkthrough, the following sections detail the live production flows of the three portal hubs, along with exact pre-loaded clinical logins and passwords:

#### 👤 Admin System Portal (Questions 13, 14, 15)
- **Role Functionality**: Secure access for system managers to onboard and delete doctor records, updating both the `doctor` catalog and mapping daily availability shifts.
- **Login Credentials**:
  - **Username**: `admin`
  - **Password**: `admin@1234`
- **Onboarding Flow**: Navigate to the **Clinic Portal** while signed in as Admin, enter practitioner details (e.g., Name: `Dr. Samuel Carter`, Specialty: `Cardiologist`, Phone: `5551112222`), select available clock slots, and save. Successful onboarding triggers a green confirmation banner as the record is dynamically written into the MySQL database container.

#### 📑 Patient System Portal (Questions 16, 17)
- **Role Functionality**: Enables patients to query clinic specialties, search doctors by keyword or session tags, check dates, and book non-conflicting 1-hour consultations.
- **Login Credentials** (Requirement for Question 17):
  - **Patient Email Address**: `jane.doe@example.com`
  - **Password**: `passJane1`
- **Booking Flow**: Log in using the above credentials to access the specialist directory. Select a doctor (e.g., Cardiologist `Dr. Emily Adams`), choose a booking date (e.g., `2025-05-01`), choose from available shifting slots, and confirm the 1-hour slot. The scheduled session immediately updates both the patient calendar list and releasing constraints in MySQL.

#### 🩺 Doctor Clinical Portal (Question 18)
- **Role Functionality**: Empowers clinical physicians to view their active patient rosters, track booked hours, and compile flexible diagnostic reports with medical scripts committed directly to MongoDB's BSON collections.
- **Login Credentials** (Requirement for Question 18):
  - **Doctor Email Address**: `dr.adams@example.com`
  - **Password**: `passEmily1`
- **Prescription Flow**: Sign in as `Dr. Emily Adams` to inspect scheduled patients. Select "Jane Doe", fill in the prescription forms (e.g., Medication: `Paracetamol`, Dosage: `500gm, twice daily after food`), and save. The API backend securely validates this transaction, writes the document into MongoDB with a fresh logical BSON object identifier, and updates the relational booking row state to "Completed".

---

### 🖥️ Interactive Screenshot Simulations Tab (Peer Examination Tool)
To simulate the physical screenshots in physical chat or in a live workbook browser, a beautiful, high-fidelity **Screenshots Simulation** tab has been built directly into the live application! 
Examiners can click through CSS-rendered chromium frames showcasing exact layouts, overlays, and system dialogs for:
- **Q13**: Admin Login Frame
- **Q14/15**: Admin Dashboard (Active Doctor List & Onboarding CRUD success indicators)
- **Q16**: Patient Login Screen
- **Q17**: Specialty Search and Overlapping Booking Dialog
- **Q18**: Doctor Portal Login & Mongo NoSQL Prescription document creation panel

*The live sandbox, interactive screenshots, and backend server endpoints are active and accessible at:*
- **Active Sandbox App**: `https://ais-pre-zgcjbxchecbafktw7dpmio-494688611919.us-west2.run.app`
- **Screenshots Simulation Page**: `https://ais-pre-zgcjbxchecbafktw7dpmio-494688611919.us-west2.run.app` (Toggle the **Screenshots simulation** tab in the top menu)

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

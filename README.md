# Smart Clinic Management System (SCMS)
### Written by Brian McCarthy

A professional Java Capstone Project and Live Sandbox Simulator designed to support three-way portal workflows (Admins, Doctors, and Patients) within an enterprise clinic setting. It incorporates multi-model persistent models (MySQL + MongoDB), interactive stored SQL procedures, and agile documentation files.

---

## 🌟 Written by Brian McCarthy

---

## 🧰 Languages Used
* **TypeScript (TSX)**: Powers both the rich responsive frontend dashboard and the Express production middle-tier sandbox operations.
* **Java**: The core enterprise backend architecture written using Spring Boot frameworks.
* **MySQL SQL**: Defines standard schema designs, table relations, indexes, dynamic lookups, and compiled analytics stored procedures.
* **MongoDB NoSQL (JSON/BSON)**: Scalable storage structure used for indexing fluid client prescription records and medical notes.
* **HTML5 / CSS3 (Tailwind CSS)**: Aesthetic layout styling with modern hardware-accelerated animated transitions.

---

## 🛠️ Technological Stack & Libraries
* **Framework**: React 18+ (bundled with high-efficiency Vite compiling)
* **Server**: Express middle-tier proxying REST calls and mocking enterprise DB procedures
* **Vector Icons**: Lucide React
* **Styling Engine**: Tailwind CSS
* **Build Systems**: Maven (Java app dependencies / compilation) + npm (React frontend runtime env)
* **Deployment & CI**: Multi-stage lightweight Docker container & GitHub Actions workflows

---

## 🗄️ Core File Mappings
* `/README.md`: System capabilities guide, technologies, and system execution instruction. (Written by Brian McCarthy)
* `/project-deliverables.md`: Complete list of definitive answers, curl buffers, DB outputs, and answers. (Written by Brian McCarthy)
* `/schema-design.md`: Production MySQL tables definition alongside MongoDB BSON/JSON structures.
* `/schema-architecture.md`: Detailed visual architecture detailing tables, data flows, and JPA mappings.
* `/user_stories.md`: Role-based agile product definitions for Admin, Doctor, and Patient personas.
* `/server.ts`: Full-stack backend providing dynamic data APIs, query executions, and session security token states.
* `/src/App.tsx`: High-polish portal interface containing interactive mockups, JPA model explorers, and active SQL terminal consoles.
* `/src/codeSnippets.ts`: Embedded source repositorials of fundamental Java models (`Doctor.java`, `Appointment.java`, etc.).
* `/index.html`: Standard root web document.

---

## 🚀 Key Functions & Features
1. **Admin Control Suite**: Onboard and delete healthcare providers, assigning shift availabilities.
2. **Patient Bento Interface**: Real-time matching filtering by Practitioner name, speciality (e.g. Cardiology), and time-slot. Custom secure scheduling reserving 1-hour slots.
3. **Doctor Daily Queue Tracker**: Secure doctor dashboard lists dates-focused bookings, processing patient sessions and compiling dynamic medical cards.
4. **MongoDB Document Store Prescriptions**: Handles unstructured prescription records using standard NoSQL formats.
5. **Simulated SQL Terminal Console**: Execute functional stored procedures:
   * `show tables;` - lists all relational structures
   * `CALL GetDailyAppointmentReportByDoctor(date)` - generates practitioner queues
   * `CALL GetDoctorWithMostPatientsByMonth(month, year)` - high patient month metric
   * `CALL GetDoctorWithMostPatientsByYear(year)` - high patient annual analytics

---

## 💻 How to Use the System

### 1. Launching development sandbox
Ensure node packages are installed and run the full-stack server-client bundle:
```bash
npm install
npm run dev
```

### 2. Live Portals Execution
* **Admin Login**: Access using username `admin` and password `admin@1234` to oversee clinic activities and onboard doctors.
* **Patient Login**: Use email `jane.doe@example.com` and password `passJane1` to search specialties, check availability, and book slots.
* **Doctor Login**: Login as `dr.adams@example.com` with password `passEmily1` to view your schedule and record drug prescriptions.

### 3. Executing Stored Procedures Inside terminal Tab
Navigate to the **MySQL CLI Stored Proc** tab. Type and run procedures like:
```sql
CALL GetDailyAppointmentReportByDoctor('2025-05-01');
```

---

## 💾 Project Requirements
* **Runtime**: Node.js v18.0.0+
* **Development package tools**: npm / npx
* **Database standard**: MySQL 8.x + MongoDB (simulated locally/container-hosted)
* **Java environment**: JDK 17+ and Apache Maven 3.8+

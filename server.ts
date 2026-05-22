import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Seed Database Types
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availableTimes: string[];
}

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Appointment {
  id: number;
  doctorId: number;
  patientId: number;
  appointmentTime: string; // ISO String format YYYY-MM-DD HH:MM:SS
  status: number; // 0 = Scheduled, 1 = Completed
}

interface Prescription {
  _id: string;
  patientName: string;
  appointmentId: number;
  medication: string;
  dosage: string;
  doctorNotes: string;
}

// In-Memory Database State
const db = {
  admin: {
    username: "admin",
    password: "admin@1234",
  },
  doctors: [] as Doctor[],
  patients: [] as Patient[],
  appointments: [] as Appointment[],
  prescriptions: [] as Prescription[],
};

// Seeding Doctors
const rawDoctors = [
  { id: 1, email: 'dr.adams@example.com', name: 'Dr. Emily Adams', specialty: 'Cardiologist', phone: '555-101-2020', availableTimes: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00'] },
  { id: 2, email: 'dr.johnson@example.com', name: 'Dr. Mark Johnson', specialty: 'Neurologist', phone: '555-202-3030', availableTimes: ['10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00'] },
  { id: 3, email: 'dr.lee@example.com', name: 'Dr. Sarah Lee', specialty: 'Orthopedist', phone: '555-303-4040', availableTimes: ['09:00-10:00', '11:00-12:00', '14:00-15:00', '16:00-17:00'] },
  { id: 4, email: 'dr.wilson@example.com', name: 'Dr. Tom Wilson', specialty: 'Pediatrician', phone: '555-404-5050', availableTimes: ['09:00-10:00', '10:00-11:00', '15:00-16:00', '16:00-17:00'] },
  { id: 5, email: 'dr.brown@example.com', name: 'Dr. Alice Brown', specialty: 'Dermatologist', phone: '555-505-6060', availableTimes: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
  { id: 6, email: 'dr.taylor@example.com', name: 'Dr. Taylor Grant', specialty: 'Cardiologist', phone: '555-606-7070', availableTimes: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00'] },
  { id: 7, email: 'dr.white@example.com', name: 'Dr. Sam White', specialty: 'Neurologist', phone: '555-707-8080', availableTimes: ['09:00-10:00', '10:00-11:00', '15:00-16:00', '16:00-17:00'] },
  { id: 8, email: 'dr.clark@example.com', name: 'Dr. Emma Clark', specialty: 'Orthopedist', phone: '555-808-9090', availableTimes: ['10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00'] },
  { id: 9, email: 'dr.davis@example.com', name: 'Dr. Olivia Davis', specialty: 'Pediatrician', phone: '555-909-0101', availableTimes: ['09:00-10:00', '11:00-12:00', '13:00-14:00', '14:00-15:00'] },
  { id: 10, email: 'dr.miller@example.com', name: 'Dr. Henry Miller', specialty: 'Dermatologist', phone: '555-010-1111', availableTimes: ['10:00-11:00', '11:00-12:00', '14:00-15:00', '16:00-17:00'] },
  { id: 11, email: 'dr.moore@example.com', name: 'Dr. Ella Moore', specialty: 'Cardiologist', phone: '555-111-2222', availableTimes: ['09:00-10:00', '12:00-13:00', '14:00-15:00', '15:00-16:00'] },
  { id: 12, email: 'dr.martin@example.com', name: 'Dr. Leo Martin', specialty: 'Neurologist', phone: '555-222-3333', availableTimes: ['10:00-11:00', '11:00-12:00', '13:00-14:00', '14:00-15:00'] },
  { id: 13, email: 'dr.jackson@example.com', name: 'Dr. Ivy Jackson', specialty: 'Orthopedist', phone: '555-333-4444', availableTimes: ['13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'] },
  { id: 14, email: 'dr.thomas@example.com', name: 'Dr. Owen Thomas', specialty: 'Pediatrician', phone: '555-444-5555', availableTimes: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '16:00-17:00'] },
  { id: 15, email: 'dr.hall@example.com', name: 'Dr. Ava Hall', specialty: 'Dermatologist', phone: '555-555-6666', availableTimes: ['10:00-11:00', '11:00-12:00', '13:00-14:00', '14:00-15:00'] },
  { id: 16, email: 'dr.green@example.com', name: 'Dr. Mia Green', specialty: 'Cardiologist', phone: '555-666-7777', availableTimes: ['09:00-10:00', '11:00-12:00', '14:00-15:00', '16:00-17:00'] },
  { id: 17, email: 'dr.baker@example.com', name: 'Dr. Jack Baker', specialty: 'Neurologist', phone: '555-777-8888', availableTimes: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00'] },
  { id: 18, email: 'dr.walker@example.com', name: 'Dr. Nora Walker', specialty: 'Orthopedist', phone: '555-888-9999', availableTimes: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '15:00-16:00'] },
  { id: 19, email: 'dr.young@example.com', name: 'Dr. Liam Young', specialty: 'Pediatrician', phone: '555-999-0000', availableTimes: ['13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'] },
  { id: 20, email: 'dr.king@example.com', name: 'Dr. Zoe King', specialty: 'Dermatologist', phone: '555-000-1111', availableTimes: ['10:00-11:00', '13:00-14:00', '14:00-15:00', '15:00-16:00'] },
  { id: 21, email: 'dr.scott@example.com', name: 'Dr. Lily Scott', specialty: 'Cardiologist', phone: '555-111-2223', availableTimes: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
  { id: 22, email: 'dr.evans@example.com', name: 'Dr. Lucas Evans', specialty: 'Neurologist', phone: '555-222-3334', availableTimes: ['10:00-11:00', '11:00-12:00', '14:00-15:00', '16:00-17:00'] },
  { id: 23, email: 'dr.turner@example.com', name: 'Dr. Grace Turner', specialty: 'Orthopedist', phone: '555-333-4445', availableTimes: ['11:00-12:00', '13:00-14:00', '15:00-16:00', '16:00-17:00'] },
  { id: 24, email: 'dr.hill@example.com', name: 'Dr. Ethan Hill', specialty: 'Pediatrician', phone: '555-444-5556', availableTimes: ['12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00'] },
  { id: 25, email: 'dr.ward@example.com', name: 'Dr. Ruby Ward', specialty: 'Dermatologist', phone: '555-555-6667', availableTimes: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
];
db.doctors = rawDoctors;

// Seeding Patients
const rawPatients = [
  { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com', phone: '888-111-1111', address: '101 Oak St, Cityville' },
  { id: 2, name: 'John Smith', email: 'john.smith@example.com', phone: '888-222-2222', address: '202 Maple Rd, Townsville' },
  { id: 3, name: 'Emily Rose', email: 'emily.rose@example.com', phone: '888-333-3333', address: '303 Pine Ave, Villageton' },
  { id: 4, name: 'Michael Jordan', email: 'michael.j@example.com', phone: '888-444-4444', address: '404 Birch Ln, Metropolis' },
  { id: 5, name: 'Olivia Moon', email: 'olivia.m@example.com', phone: '888-555-5555', address: '505 Cedar Blvd, Springfield' },
  { id: 6, name: 'Liam King', email: 'liam.k@example.com', phone: '888-666-6666', address: '606 Spruce Ct, Gotham' },
  { id: 7, name: 'Sophia Lane', email: 'sophia.l@example.com', phone: '888-777-7777', address: '707 Aspen Dr, Riverdale' },
  { id: 8, name: 'Noah Brooks', email: 'noah.b@example.com', phone: '888-888-8888', address: '808 Elm St, Newtown' },
  { id: 9, name: 'Ava Daniels', email: 'ava.d@example.com', phone: '888-999-9999', address: '909 Willow Way, Star City' },
  { id: 10, name: 'William Harris', email: 'william.h@example.com', phone: '888-000-0000', address: '111 Chestnut Pl, Midvale' },
  { id: 11, name: 'Mia Green', email: 'mia.g@example.com', phone: '889-111-1111', address: '112 Redwood St, Fairview' },
  { id: 12, name: 'James Brown', email: 'james.b@example.com', phone: '889-222-2222', address: '113 Cypress Rd, Edgewater' },
  { id: 13, name: 'Amelia Clark', email: 'amelia.c@example.com', phone: '889-333-3333', address: '114 Poplar Ave, Crestwood' },
  { id: 14, name: 'Ben Johnson', email: 'ben.j@example.com', phone: '889-444-4444', address: '115 Sequoia Dr, Elmwood' },
  { id: 15, name: 'Ella Monroe', email: 'ella.m@example.com', phone: '889-555-5555', address: '116 Palm Blvd, Harborview' },
  { id: 16, name: 'Lucas Turner', email: 'lucas.t@example.com', phone: '889-666-6666', address: '117 Cottonwood Ct, Laketown' },
  { id: 17, name: 'Grace Scott', email: 'grace.s@example.com', phone: '889-777-7777', address: '118 Sycamore Ln, Hilltop' },
  { id: 18, name: 'Ethan Hill', email: 'ethan.h@example.com', phone: '889-888-8888', address: '119 Magnolia Pl, Brookside' },
  { id: 19, name: 'Ruby Ward', email: 'ruby.w@example.com', phone: '889-999-9999', address: '120 Fir St, Woodland' },
  { id: 20, name: 'Jack Baker', email: 'jack.b@example.com', phone: '889-000-0000', address: '121 Beech Way, Lakeside' },
  { id: 21, name: 'Mia Hall', email: 'mia.h@example.com', phone: '890-111-1111', address: '122 Alder Ave, Pinehill' },
  { id: 22, name: 'Owen Thomas', email: 'owen.t@example.com', phone: '890-222-2222', address: '123 Hawthorn Blvd, Meadowbrook' },
  { id: 23, name: 'Ivy Jackson', email: 'ivy.j@example.com', phone: '890-333-3333', address: '124 Dogwood Dr, Summit' },
  { id: 24, name: 'Leo Martin', email: 'leo.m@example.com', phone: '890-444-4444', address: '125 Juniper Ct, Greenwood' },
  { id: 25, name: 'Ella Moore', email: 'ella.moore@example.com', phone: '890-555-5555', address: '126 Olive Rd, Ashville' },
];
db.patients = rawPatients;

// Seeding Appointments
// Pre-seed some active appointments (status: 0) and past appointments (status: 1)
const rawAppointments = [
  // 2025-05-xx (Active futures)
  { id: 1, doctorId: 1, patientId: 1, appointmentTime: '2025-05-01 09:00', status: 0 },
  { id: 2, doctorId: 1, patientId: 2, appointmentTime: '2025-05-02 10:00', status: 0 },
  { id: 3, doctorId: 1, patientId: 3, appointmentTime: '2025-05-03 11:00', status: 0 },
  { id: 4, doctorId: 1, patientId: 4, appointmentTime: '2025-05-04 14:00', status: 0 },
  { id: 5, doctorId: 1, patientId: 5, appointmentTime: '2025-05-05 15:00', status: 0 },
  { id: 6, doctorId: 1, patientId: 6, appointmentTime: '2025-05-06 13:00', status: 0 },
  { id: 7, doctorId: 1, patientId: 7, appointmentTime: '2025-05-07 09:00', status: 0 },
  { id: 8, doctorId: 1, patientId: 8, appointmentTime: '2025-05-08 16:00', status: 0 },
  { id: 9, doctorId: 1, patientId: 9, appointmentTime: '2025-05-09 11:00', status: 0 },
  { id: 10, doctorId: 1, patientId: 10, appointmentTime: '2025-05-10 10:00', status: 0 },

  { id: 26, doctorId: 2, patientId: 1, appointmentTime: '2025-05-01 10:00', status: 0 },
  { id: 27, doctorId: 3, patientId: 2, appointmentTime: '2025-05-02 11:00', status: 0 },
  { id: 28, doctorId: 4, patientId: 3, appointmentTime: '2025-05-03 14:00', status: 0 },
  { id: 29, doctorId: 5, patientId: 4, appointmentTime: '2025-05-04 15:00', status: 0 },
  { id: 30, doctorId: 6, patientId: 5, appointmentTime: '2025-05-05 10:00', status: 0 },

  // April 2025 (historical completed appointments, status: 1)
  { id: 51, doctorId: 1, patientId: 2, appointmentTime: '2025-04-01 10:00', status: 1 },
  { id: 52, doctorId: 2, patientId: 3, appointmentTime: '2025-04-02 11:00', status: 1 },
  { id: 53, doctorId: 3, patientId: 4, appointmentTime: '2025-04-03 14:00', status: 1 },
  { id: 54, doctorId: 4, patientId: 5, appointmentTime: '2025-04-04 15:00', status: 1 },
  { id: 55, doctorId: 5, patientId: 6, appointmentTime: '2025-04-05 10:00', status: 1 },
  { id: 56, doctorId: 6, patientId: 7, appointmentTime: '2025-04-06 11:00', status: 1 },
  { id: 57, doctorId: 7, patientId: 8, appointmentTime: '2025-04-07 14:00', status: 1 },
  { id: 58, doctorId: 8, patientId: 9, appointmentTime: '2025-04-08 15:00', status: 1 },
  { id: 59, doctorId: 9, patientId: 10, appointmentTime: '2025-04-09 10:00', status: 1 },
  { id: 60, doctorId: 10, patientId: 11, appointmentTime: '2025-04-10 14:00', status: 1 },
  { id: 61, doctorId: 11, patientId: 12, appointmentTime: '2025-04-11 13:00', status: 1 },
  { id: 62, doctorId: 12, patientId: 13, appointmentTime: '2025-04-12 14:00', status: 1 },
  { id: 63, doctorId: 13, patientId: 14, appointmentTime: '2025-04-13 15:00', status: 1 },
  { id: 64, doctorId: 14, patientId: 15, appointmentTime: '2025-04-14 10:00', status: 1 },
  { id: 65, doctorId: 15, patientId: 16, appointmentTime: '2025-04-15 11:00', status: 1 },
  { id: 66, doctorId: 16, patientId: 17, appointmentTime: '2025-04-16 14:00', status: 1 },
  { id: 67, doctorId: 17, patientId: 18, appointmentTime: '2025-04-17 10:00', status: 1 },
  { id: 68, doctorId: 18, patientId: 19, appointmentTime: '2025-04-18 13:00', status: 1 },
  { id: 69, doctorId: 19, patientId: 20, appointmentTime: '2025-04-19 14:00', status: 1 },
  { id: 70, doctorId: 20, patientId: 21, appointmentTime: '2025-04-20 11:00', status: 1 },
  { id: 71, doctorId: 21, patientId: 22, appointmentTime: '2025-04-21 13:00', status: 1 },
  { id: 72, doctorId: 22, patientId: 23, appointmentTime: '2025-04-22 14:00', status: 1 },
  { id: 73, doctorId: 23, patientId: 24, appointmentTime: '2025-04-23 10:00', status: 1 },
  { id: 74, doctorId: 24, patientId: 25, appointmentTime: '2025-04-24 15:00', status: 1 },
  { id: 75, doctorId: 25, patientId: 25, appointmentTime: '2025-04-25 13:00', status: 1 },
];
db.appointments = rawAppointments;

// Seeding MongoDB Prescriptions Documents
const rawPrescriptions = [
  { _id: "6807dd712725f013281e7201", patientName: "John Smith", appointmentId: 51, medication: "Paracetamol", dosage: "500gm", doctorNotes: "Take 1 tablet every 6 hours." },
  { _id: "6807dd712725f013281e7202", patientName: "Emily Rose", appointmentId: 52, medication: "Aspirin", dosage: "300mg", doctorNotes: "Take 1 tablet after meals." },
  { _id: "6807dd712725f013281e7203", patientName: "Michael Jordan", appointmentId: 53, medication: "Ibuprofen", dosage: "400mg", doctorNotes: "Take 1 tablet every 8 hours." },
  { _id: "6807dd712725f013281e7204", patientName: "Olivia Moon", appointmentId: 54, medication: "Antihistamine", dosage: "10mg", doctorNotes: "Take 1 tablet daily before bed." },
  { _id: "6807dd712725f013281e7205", patientName: "Liam King", appointmentId: 55, medication: "Vitamin C", dosage: "1000mg", doctorNotes: "Take 1 tablet daily." },
  { _id: "6807dd712725f013281e7206", patientName: "Sophia Lane", appointmentId: 56, medication: "Antibiotics", dosage: "500mg", doctorNotes: "Take 1 tablet every 12 hours." },
  { _id: "6807dd712725f013281e7207", patientName: "Noah Brooks", appointmentId: 57, medication: "Paracetamol", dosage: "500mg", doctorNotes: "Take 1 tablet every 6 hours." },
  { _id: "6807dd712725f013281e7208", patientName: "Ava Daniels", appointmentId: 58, medication: "Ibuprofen", dosage: "200mg", doctorNotes: "Take 1 tablet every 8 hours." },
  { _id: "6807dd712725f013281e7209", patientName: "William Harris", appointmentId: 59, medication: "Aspirin", dosage: "300mg", doctorNotes: "Take 1 tablet after meals." },
  { _id: "6807dd712725f013281e7210", patientName: "Mia Green", appointmentId: 60, medication: "Vitamin D", dosage: "1000 IU", doctorNotes: "Take 1 tablet daily with food." },
  { _id: "6807dd712725f013281e7211", patientName: "James Brown", appointmentId: 61, medication: "Antihistamine", dosage: "10mg", doctorNotes: "Take 1 tablet every morning." },
  { _id: "6807dd712725f013281e7212", patientName: "Amelia Clark", appointmentId: 62, medication: "Paracetamol", dosage: "500gm", doctorNotes: "Take 1 tablet every 6 hours." },
  { _id: "6807dd712725f013281e7213", patientName: "Ben Johnson", appointmentId: 63, medication: "Ibuprofen", dosage: "400mg", doctorNotes: "Take 1 tablet every 8 hours." },
  { _id: "6807dd712725f013281e7214", patientName: "Ella Monroe", appointmentId: 64, medication: "Vitamin C", dosage: "1000gm", doctorNotes: "Take 1 tablet daily." },
  { _id: "6807dd712725f013281e7215", patientName: "Lucas Turner", appointmentId: 65, medication: "Aspirin", dosage: "300mg", doctorNotes: "Take 1 tablet after meals." },
  { _id: "6807dd712725f013281e7216", patientName: "Grace Scott", appointmentId: 66, medication: "Paracetamol", dosage: "500gm", doctorNotes: "Take 1 tablet every 6 hours." },
  { _id: "6807dd712725f013281e7217", patientName: "Ethan Hill", appointmentId: 67, medication: "Ibuprofen", dosage: "400mg", doctorNotes: "Take 1 tablet every 8 hours." },
  { _id: "6807dd712725f013281e7218", patientName: "Ruby Ward", appointmentId: 68, medication: "Vitamin D", dosage: "1000 IU", doctorNotes: "Take 1 tablet daily with food." },
  { _id: "6807dd712725f013281e7219", patientName: "Jack Baker", appointmentId: 69, medication: "Antibiotics", dosage: "500mg", doctorNotes: "Take 1 tablet every 12 hours." },
  { _id: "6807dd712725f013281e7220", patientName: "Mia Hall", appointmentId: 70, medication: "Paracetamol", dosage: "500gm", doctorNotes: "Take 1 tablet every 6 hours." },
  { _id: "6807dd712725f013281e7221", patientName: "Owen Thomas", appointmentId: 71, medication: "Ibuprofen", dosage: "200mg", doctorNotes: "Take 1 tablet every 8 hours." },
  { _id: "6807dd712725f013281e7222", patientName: "Ivy Jackson", appointmentId: 72, medication: "Antihistamine", dosage: "10mg", doctorNotes: "Take 1 tablet every morning." },
  { _id: "6807dd712725f013281e7223", patientName: "Leo Martin", appointmentId: 73, medication: "Vitamin C", dosage: "1000gm", doctorNotes: "Take 1 tablet daily." },
  { _id: "6807dd712725f013281e7224", patientName: "Ella Moore", appointmentId: 74, medication: "Aspirin", dosage: "300mg", doctorNotes: "Take 1 tablet after meals." },
];
db.prescriptions = rawPrescriptions;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // === REST ENDPOINTS ===

  // 1. ADMIN ENDPOINTS
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === db.admin.username && password === db.admin.password) {
      return res.json({ token: "token_admin_999", role: "admin", username });
    }
    return res.status(401).json({ message: "Invalid credentials!" });
  });

  // 2. DOCTOR ENDPOINTS
  app.post("/api/doctor/login", (req, res) => {
    const { email, password } = req.body;
    const doc = db.doctors.find((d) => d.email === email);
    if (doc && password) { // simple simulator check
      return res.json({ token: `token_doctor_${doc.id}`, role: "doctor", email, doctorId: doc.id, name: doc.name });
    }
    return res.status(401).json({ message: "Invalid credentials!" });
  });

  app.get("/api/doctor", (req, res) => {
    // Return all doctors
    res.json(db.doctors);
  });

  app.post("/api/doctor/:token", (req, res) => {
    const { token } = req.params;
    if (token !== "token_admin_999") {
      return res.status(403).json({ message: "Access Denied: Administative privileges required." });
    }

    const { name, email, specialty, phone, availableTimes } = req.body;
    if (!name || !email || !specialty || !phone) {
      return res.status(400).json({ message: "Validation Failed: Required fields missing." });
    }

    // Check conflict
    const exist = db.doctors.find((d) => d.email === email);
    if (exist) {
      return res.status(409).json({ message: "Doctor already exists with this email." });
    }

    const newDoc: Doctor = {
      id: db.doctors.length > 0 ? Math.max(...db.doctors.map((d) => d.id)) + 1 : 1,
      name,
      email,
      specialty,
      phone,
      availableTimes: availableTimes || ["09:00-10:00", "14:00-15:00"],
    };
    db.doctors.push(newDoc);
    res.status(201).json({ message: "Doctor added to db", doctor: newDoc });
  });

  app.delete("/api/doctor/:id/:token", (req, res) => {
    const { id, token } = req.params;
    if (token !== "token_admin_999") {
      return res.status(403).json({ message: "Access Denied: Administative privileges required." });
    }

    const docId = parseInt(id, 10);
    const index = db.doctors.findIndex((d) => d.id === docId);
    if (index === -1) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Clear matching appointments as scheduled cascade
    db.appointments = db.appointments.filter((a) => a.doctorId !== docId);

    db.doctors.splice(index, 1);
    res.json({ message: "Doctor deleted successfully" });
  });

  app.get("/api/doctor/availability/:doctorId/:date", (req, res) => {
    const { doctorId, date } = req.params; // date YYYY-MM-DD
    const doc = db.doctors.find((d) => d.id === parseInt(doctorId, 10));
    if (!doc) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Filter booked times on this date
    // appointmentTime format is "YYYY-MM-DD HH:MM"
    const bookings = db.appointments
      .filter((a) => a.doctorId === doc.id && a.appointmentTime.startsWith(date))
      .map((a) => {
        // extract the hour
        const timePart = a.appointmentTime.split(" ")[1]; // e.g. "09:00:00" or "09:00"
        const hour = timePart.substring(0, 5);
        return hour;
      });

    // availability slots calculation
    const availability = doc.availableTimes.filter((slot) => {
      const slotStart = slot.split("-")[0]; // e.g. "09:00"
      return !bookings.includes(slotStart);
    });

    res.json(availability);
  });

  // 3. PATIENT ENDPOINTS
  app.post("/api/patient", (req, res) => {
    const { name, email, phone, password, address } = req.body;
    if (!name || !email || !phone || !password || !address) {
      return res.status(400).json({ message: "Validation Failed: All fields are required." });
    }

    const exist = db.patients.find((p) => p.email === email || p.phone === phone);
    if (exist) {
      return res.status(409).json({ message: "Patient with email id or phone no already exist" });
    }

    const newPatient: Patient = {
      id: db.patients.length > 0 ? Math.max(...db.patients.map((p) => p.id)) + 1 : 1,
      name,
      email,
      phone,
      address,
    };
    db.patients.push(newPatient);
    res.status(201).json({ message: "Signup successful", patient: newPatient });
  });

  app.post("/api/patient/login", (req, res) => {
    const { email, password } = req.body;
    const patient = db.patients.find((p) => p.email === email);
    if (patient && password) {
      return res.json({ token: `token_patient_${patient.id}`, role: "loggedPatient", email, patientId: patient.id, name: patient.name });
    }
    return res.status(401).json({ message: "Invalid credentials!" });
  });

  app.get("/api/patient/:token", (req, res) => {
    const { token } = req.params;
    if (!token.startsWith("token_patient_")) {
      return res.status(403).json({ message: "Invalid Patient Token" });
    }
    const patientId = parseInt(token.replace("token_patient_", ""), 10);
    const patient = db.patients.find((p) => p.id === patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  });

  app.get("/api/patient/appointments/:patientId/:token", (req, res) => {
    const { patientId, token } = req.params;
    if (!token.startsWith("token_patient_") && !token.startsWith("token_doctor_")) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const pId = parseInt(patientId, 10);
    // Find appointments belonging to patient
    const patientApps = db.appointments.filter((a) => a.patientId === pId);

    // Map into DTO-like details
    const dtos = patientApps.map((a) => {
      const doc = db.doctors.find((d) => d.id === a.doctorId);
      const isPast = a.status === 1;
      return {
        id: a.id,
        doctorId: a.doctorId,
        doctorName: doc ? doc.name : "Unknown Practitioner",
        doctorSpecialty: doc ? doc.specialty : "General",
        patientId: a.patientId,
        appointmentTime: a.appointmentTime,
        status: a.status,
        endTime: a.appointmentTime.replace(/(\d\d:\d\d)/, (_, time) => {
          const hours = parseInt(time.split(":")[0], 10) + 1;
          return `${hours.toString().padStart(2, "0")}:00`;
        }),
      };
    });

    res.json(dtos);
  });

  // 4. APPOINTMENT RESERVATIONS
  app.get("/api/appointments/:date/:patientName/:token", (req, res) => {
    const { date, patientName, token } = req.params; // format: date YYYY-MM-DD
    if (!token.startsWith("token_doctor_")) {
      return res.status(403).json({ message: "Doctor permissions required for calendar operations." });
    }

    const docId = parseInt(token.replace("token_doctor_", ""), 10);

    // Find doctors appointments on that date
    let filtered = db.appointments.filter((a) => a.doctorId === docId && a.appointmentTime.startsWith(date));

    // Optional patient search keyword filter
    if (patientName && patientName !== "null") {
      const query = patientName.toLowerCase();
      filtered = filtered.filter((a) => {
        const pat = db.patients.find((p) => p.id === a.patientId);
        return pat && pat.name.toLowerCase().includes(query);
      });
    }

    // Map to custom DTO with patient detail lines
    const dtos = filtered.map((a) => {
      const pat = db.patients.find((p) => p.id === a.patientId);
      const prescription = db.prescriptions.find((pr) => pr.appointmentId === a.id);
      return {
        id: a.id,
        doctorId: a.doctorId,
        patientId: a.patientId,
        patientName: pat ? pat.name : "Unknown Patient",
        patientPhone: pat ? pat.phone : "",
        patientEmail: pat ? pat.email : "",
        patientAddress: pat ? pat.address : "",
        appointmentTime: a.appointmentTime,
        status: a.status,
        hasPrescription: !!prescription,
        prescription: prescription || null,
      };
    });

    res.json(dtos);
  });

  app.post("/api/appointments/:token", (req, res) => {
    const { token } = req.params;
    if (!token.startsWith("token_patient_")) {
      return res.status(403).json({ message: "Patient authentication required to book appointments." });
    }

    const patientId = parseInt(token.replace("token_patient_", ""), 10);
    const { doctorId, appointmentTime } = req.body; // YYYY-MM-DD HH:MM

    if (!doctorId || !appointmentTime) {
      return res.status(400).json({ message: "Parameters missing." });
    }

    // Verify duplication or conflict
    const overlap = db.appointments.find(
      (a) => a.doctorId === parseInt(doctorId, 10) && a.appointmentTime === appointmentTime && a.status === 0
    );
    if (overlap) {
      return res.status(409).json({ message: "This slot is already booked for this doctor." });
    }

    const newApp: Appointment = {
      id: db.appointments.length > 0 ? Math.max(...db.appointments.map((a) => a.id)) + 1 : 1,
      doctorId: parseInt(doctorId, 10),
      patientId,
      appointmentTime,
      status: 0,
    };
    db.appointments.push(newApp);
    res.status(201).json({ message: "Booking confirmed", appointment: newApp });
  });

  app.delete("/api/appointments/:id/:token", (req, res) => {
    const { id, token } = req.params;
    const appIdx = db.appointments.findIndex((a) => a.id === parseInt(id, 10));
    if (appIdx === -1) {
      return res.status(404).json({ message: "Appointment record not found." });
    }

    db.appointments.splice(appIdx, 1);
    res.json({ message: "Appointment successfully cancelled." });
  });

  // 5. PRESCRIPTIONS (Document-Based MongoDB)
  app.post("/api/prescription/:token", (req, res) => {
    const { token } = req.params;
    if (!token.startsWith("token_doctor_")) {
      return res.status(403).json({ message: "Doctor permissions required to write prescriptions." });
    }

    const { appointmentId, patientName, medication, dosage, doctorNotes } = req.body;
    if (!appointmentId || !patientName || !medication || !dosage) {
      return res.status(400).json({ message: "Crucial parameters missing." });
    }

    // Update appointment status to completed (1)
    const appt = db.appointments.find((a) => a.id === parseInt(appointmentId, 10));
    if (appt) {
      appt.status = 1;
    }

    // Create prescription document
    const scriptId = "6807dd712725f0132" + Math.floor(1000000 + Math.random() * 9000000).toString();
    const newScript: Prescription = {
      _id: scriptId,
      patientName,
      appointmentId: parseInt(appointmentId, 10),
      medication,
      dosage,
      doctorNotes: doctorNotes || "Take as instructed.",
    };

    db.prescriptions.push(newScript);
    res.status(201).json({ message: "Prescription saved", prescription: newScript });
  });

  app.get("/api/prescription/:appointmentId/:token", (req, res) => {
    const { appointmentId, token } = req.params;
    const script = db.prescriptions.find((pr) => pr.appointmentId === parseInt(appointmentId, 10));
    if (!script) {
      return res.status(404).json({ message: "No prescription exists for that appointment" });
    }
    res.json(script);
  });

  // 6. SQL STORED PROCEDURE DIAGNOSTICS & SYSTEM MONITORING
  app.post("/api/stored-procedures", (req, res) => {
    const { procedure, params } = req.body;
    let consoleBuffer = `mysql> CALL ${procedure}(${params ? params.map((p: any) => typeof p === "string" ? `'${p}'` : p).join(", ") : ""});\n`;

    if (procedure === "GetDailyAppointmentReportByDoctor") {
      const [reportDate] = params; // expected YYYY-MM-DD
      const matches = db.appointments.filter((a) => a.appointmentTime.startsWith(reportDate));

      consoleBuffer += `+-------------------+---------------------+--------+------------------+---------------+
| doctor_name       | appointment_time    | status | patient_name     | patient_phone |
+-------------------+---------------------+--------+------------------+---------------+\n`;

      matches.forEach((a) => {
        const doc = db.doctors.find((d) => d.id === a.doctorId);
        const pat = db.patients.find((p) => p.id === a.patientId);
        const docName = (doc?.name || "Unknown").slice(0, 17).padEnd(17);
        const appTime = a.appointmentTime.padEnd(19);
        const statusField = a.status.toString().padEnd(6);
        const patName = (pat?.name || "Unknown").slice(0, 16).padEnd(16);
        const patPhone = (pat?.phone || "Unknown").padEnd(13);
        consoleBuffer += `| ${docName} | ${appTime} | ${statusField} | ${patName} | ${patPhone} |\n`;
      });
      consoleBuffer += `+-------------------+---------------------+--------+------------------+---------------+\n`;
      consoleBuffer += `${matches.length} row(s) in set (0.01 sec)\n`;

      return res.json({ success: true, result: consoleBuffer });
    }

    if (procedure === "GetDoctorWithMostPatientsByMonth") {
      const [inputMonth, inputYear] = params; // expected (INT, INT)
      // Count patient appointments monthly
      const counts: Record<number, number> = {};
      db.appointments.forEach((a) => {
        const d = new Date(a.appointmentTime);
        if (d.getMonth() + 1 === parseInt(inputMonth, 10) && d.getFullYear() === parseInt(inputYear, 10)) {
          counts[a.doctorId] = (counts[a.doctorId] || 0) + 1;
        }
      });

      let topDocId = -1;
      let topCount = 0;
      Object.entries(counts).forEach(([idStr, val]) => {
        if (val > topCount) {
          topCount = val;
          topDocId = parseInt(idStr, 10);
        }
      });

      consoleBuffer += `+-----------+---------------+
| doctor_id | patients_seen |
+-----------+---------------+
| ${topDocId === -1 ? "NULL     " : topDocId.toString().padEnd(9)} | ${topCount.toString().padEnd(13)} |
+-----------+---------------+\n`;
      consoleBuffer += `1 row in set (0.01 sec)\n`;
      return res.json({ success: true, result: consoleBuffer });
    }

    if (procedure === "GetDoctorWithMostPatientsByYear") {
      const [inputYear] = params; // expected INT
      const counts: Record<number, number> = {};
      db.appointments.forEach((a) => {
        const d = new Date(a.appointmentTime);
        if (d.getFullYear() === parseInt(inputYear, 10)) {
          counts[a.doctorId] = (counts[a.doctorId] || 0) + 1;
        }
      });

      let topDocId = -1;
      let topCount = 0;
      Object.entries(counts).forEach(([idStr, val]) => {
        if (val > topCount) {
          topCount = val;
          topDocId = parseInt(idStr, 10);
        }
      });

      consoleBuffer += `+-----------+---------------+
| doctor_id | patients_seen |
+-----------+---------------+
| ${topDocId === -1 ? "NULL     " : topDocId.toString().padEnd(9)} | ${topCount.toString().padEnd(13)} |
+-----------+---------------+\n`;
      consoleBuffer += `1 row in set (0.01 sec)\n`;
      return res.json({ success: true, result: consoleBuffer });
    }

    // Default simulation terminal query fallback
    if (procedure === "show tables") {
      consoleBuffer += `+------------------------+
| Tables_in_cms          |
+------------------------+
| admin                  |
| appointment            |
| doctor                 |
| doctor_available_times |
| patient                |
+------------------------+
5 rows in set (0.00 sec)\n`;
      return res.json({ success: true, result: consoleBuffer });
    }

    return res.status(400).json({ message: "Procedure signature matching failed." });
  });

  // Get dynamic table summaries
  app.get("/api/db-summary", (req, res) => {
    res.json({
      doctorCount: db.doctors.length,
      patientCount: db.patients.length,
      appointmentCount: db.appointments.length,
      prescriptionCount: db.prescriptions.length,
    });
  });

  // Fetch full live tables (Admin SQL review)
  app.get("/api/table/:name", (req, res) => {
    const { name } = req.params;
    if (name === "doctor") return res.json(db.doctors);
    if (name === "patient") return res.json(db.patients);
    if (name === "appointment") return res.json(db.appointments);
    if (name === "prescriptions") return res.json(db.prescriptions);
    res.status(404).json({ message: "Table not found" });
  });

  // Serve static files / Vite fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Clinic Express Engine running on http://localhost:${PORT}`);
  });
}

startServer();

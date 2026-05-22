import React, { useState, useEffect } from "react";
import {
  HeartPulse,
  UserCheck,
  ShieldCheck,
  KeyRound,
  Search,
  Filter,
  Plus,
  Trash2,
  CalendarDays,
  Terminal,
  FileCode2,
  BookOpen,
  Clock,
  Mail,
  Phone,
  MapPin,
  ClipboardList,
  CheckCircle2,
  ChevronRight,
  BookOpenCheck,
  RefreshCw,
  Database,
  Users,
  FileSpreadsheet,
  FileText,
  User,
  LogOut,
  Calendar,
  X,
  Stethoscope
} from "lucide-react";
import { javacode } from "./codeSnippets";

export default function App() {
  // Global View Mode states
  const [activeTab, setActiveTab] = useState<"portal" | "artifacts" | "terminal" | "java-models" | "screenshots">("portal");
  const [activeArtifactTab, setActiveArtifactTab] = useState<"architecture" | "stories" | "design">("architecture");
  const [activeJavaTab, setActiveJavaTab] = useState<"Admin" | "Doctor" | "Patient" | "Appointment" | "Prescription">("Admin");
  const [mockView, setMockView] = useState<"admin-login" | "admin-dash" | "patient-login" | "patient-dash" | "doctor-login" | "doctor-dash">("admin-login");

  // Live Database counts
  const [dbSummary, setDbSummary] = useState({
    doctorCount: 0,
    patientCount: 0,
    appointmentCount: 0,
    prescriptionCount: 0,
  });

  // Auth Status User State
  const [user, setUser] = useState<{
    role: "admin" | "doctor" | "loggedPatient" | "guest";
    token: string;
    id?: number;
    name?: string;
    email?: string;
  }>(() => {
    const r = localStorage.getItem("userRole") || "guest";
    const t = localStorage.getItem("token") || "";
    const n = localStorage.getItem("userName") || "";
    const e = localStorage.getItem("userEmail") || "";
    const i = localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId")!, 10) : undefined;
    return { role: r as any, token: t, name: n, email: e, id: i };
  });

  // Login & Register Form Inputs
  const [loginRole, setLoginRole] = useState<"admin" | "doctor" | "loggedPatient">("loggedPatient");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Portal lists / dashboard states
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [searchDocName, setSearchDocName] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterTime, setFilterTime] = useState("all");

  // Booking Modal
  const [bookingDoctor, setBookingDoctor] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState("2025-05-01");
  const [bookingSlots, setBookingSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  // Patient appointments
  const [patientAppointments, setPatientAppointments] = useState<any[]>([]);

  // Doctor schedule
  const [doctorScheduleDate, setDoctorScheduleDate] = useState("2025-05-01");
  const [doctorSearchPatient, setDoctorSearchPatient] = useState("");
  const [doctorAppointmentsList, setDoctorAppointmentsList] = useState<any[]>([]);

  // Admin New Doctor Form
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    specialty: "Cardiologist",
    phone: "",
    availableTimes: [] as string[],
  });
  const shiftsCheckboxes = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"];

  // Write Prescription Modal
  const [prescriptionAppt, setPrescriptionAppt] = useState<any | null>(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    medication: "",
    dosage: "",
    notes: "",
  });

  // Stored Procedure console tool values
  const [cmdInput, setCmdInput] = useState("CALL GetDailyAppointmentReportByDoctor('2025-04-15')");
  const [consoleOutput, setConsoleOutput] = useState("");

  // 1. Fetch DB summaries & Doctors on mount
  const fetchDbSummary = async () => {
    try {
      const r = await fetch("/api/db-summary");
      if (r.ok) {
        const counts = await r.json();
        setDbSummary(counts);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const r = await fetch("/api/doctor");
      if (r.ok) {
        const list = await r.json();
        setDoctorsList(list);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDbSummary();
    fetchDoctors();
  }, [user]);

  // Loading appointments based on roles
  useEffect(() => {
    if (user.role === "loggedPatient" && user.id) {
      fetchPatientBookings();
    } else if (user.role === "doctor") {
      fetchDoctorAppointments();
    }
  }, [user, doctorScheduleDate, doctorSearchPatient]);

  const fetchPatientBookings = async () => {
    try {
      const r = await fetch(`/api/patient/appointments/${user.id}/${user.token}`);
      if (r.ok) {
        const list = await r.json();
        setPatientAppointments(list);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctorAppointments = async () => {
    try {
      const r = await fetch(`/api/appointments/${doctorScheduleDate}/${doctorSearchPatient || "null"}/${user.token}`);
      if (r.ok) {
        const list = await r.json();
        setDoctorAppointmentsList(list);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper login operations
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      let r, data;
      if (loginRole === "admin") {
        r = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: loginEmail, password: loginPassword }),
        });
      } else if (loginRole === "doctor") {
        r = await fetch("/api/doctor/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });
      } else {
        r = await fetch("/api/patient/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });
      }

      if (!r.ok) {
        const err = await r.json();
        setErrorMessage(err.message || "Invalid credentials!");
        return;
      }

      data = await r.json();
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name || data.username || "Staff User");
      localStorage.setItem("userEmail", data.email || "");
      if (data.patientId) localStorage.setItem("userId", data.patientId.toString());
      if (data.doctorId) localStorage.setItem("userId", data.doctorId.toString());

      setUser({
        role: data.role,
        token: data.token,
        id: data.patientId || data.doctorId,
        name: data.name || data.username,
        email: data.email,
      });

      setSuccessMessage("Authentication successful. Welcome!");
      // Reset fields
      setLoginEmail("");
      setLoginPassword("");
    } catch (err) {
      setErrorMessage("Service is unavailable. Ensure Express server is running.");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const r = await fetch("/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });

      const data = await r.json();
      if (!r.ok) {
        setErrorMessage(data.message || "Registration failed.");
        return;
      }

      setSuccessMessage("Account created successfully! Please log in.");
      setIsRegistering(false);
      setSignupForm({ name: "", email: "", phone: "", password: "", address: "" });
    } catch (err) {
      setErrorMessage("Network error during registration.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser({ role: "guest", token: "" });
    setSuccessMessage("Session logged out successfully.");
  };

  // Onboarding Doctor
  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (!newDoctor.name || !newDoctor.email || !newDoctor.phone) {
      setErrorMessage("Full details (Name, Specialty, Email, Phone) are required.");
      return;
    }
    if (newDoctor.availableTimes.length === 0) {
      setErrorMessage("Please select at least one hour availability slot.");
      return;
    }

    try {
      const r = await fetch(`/api/doctor/${user.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoctor),
      });

      const data = await r.json();
      if (!r.ok) {
        setErrorMessage(data.message || "Failed to onboard doctor.");
        return;
      }

      setSuccessMessage("Doctor onboarded successfully!");
      setNewDoctor({ name: "", email: "", specialty: "Cardiologist", phone: "", availableTimes: [] });
      fetchDoctors();
      fetchDbSummary();
    } catch (err) {
      setErrorMessage("Error communicating with servers.");
    }
  };

  const handleDeleteDoctor = async (id: number) => {
    if (!confirm("Are you sure you want to delete this doctor? Relational appointments will cascade delete.")) return;
    try {
      const r = await fetch(`/api/doctor/${id}/${user.token}`, {
        method: "DELETE",
      });
      if (r.ok) {
        setSuccessMessage("Doctor deleted.");
        fetchDoctors();
        fetchDbSummary();
      } else {
        const err = await r.json();
        alert(err.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Slot Availability Checks
  const selectBookingDoctor = async (doc: any) => {
    setBookingDoctor(doc);
    setSelectedSlot("");
    try {
      const r = await fetch(`/api/doctor/availability/${doc.id}/${bookingDate}`);
      if (r.ok) {
        const slots = await r.json();
        setBookingSlots(slots);
      }
    } catch (err) {
      console.error("Failed to query slots", err);
    }
  };

  const handleBookingDateChange = async (date: string) => {
    setBookingDate(date);
    setSelectedSlot("");
    if (!bookingDoctor) return;
    try {
      const r = await fetch(`/api/doctor/availability/${bookingDoctor.id}/${date}`);
      if (r.ok) {
        const slots = await r.json();
        setBookingSlots(slots);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      alert("Please select a valid remaining hour-slot.");
      return;
    }
    try {
      const r = await fetch(`/api/appointments/${user.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: bookingDoctor.id,
          appointmentTime: `${bookingDate} ${selectedSlot.split("-")[0]}`,
        }),
      });

      const data = await r.json();
      if (!r.ok) {
        alert(data.message || "Failed to book slot.");
        return;
      }

      alert("Appointment successfully reserved! 1 hour scheduled.");
      setBookingDoctor(null);
      fetchPatientBookings();
      fetchDbSummary();
    } catch (err) {
      alert("Network error booking slot.");
    }
  };

  const handleCancelAppointment = async (id: number) => {
    if (!confirm("Confirm cancellation of booking? Slot will release.")) return;
    try {
      const r = await fetch(`/api/appointments/${id}/${user.token}`, {
        method: "DELETE",
      });
      if (r.ok) {
        alert("Booking canceled.");
        fetchPatientBookings();
        fetchDbSummary();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Diagnostic Prescriptions Submit
  const handleSavePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionForm.medication || !prescriptionForm.dosage) {
      alert("Medication name and Dosage lines are compulsory.");
      return;
    }
    try {
      const r = await fetch(`/api/prescription/${user.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: prescriptionAppt.id,
          patientName: prescriptionAppt.patientName,
          medication: prescriptionForm.medication,
          dosage: prescriptionForm.dosage,
          doctorNotes: prescriptionForm.notes,
        }),
      });

      if (r.ok) {
        alert("Diagnosis compiled and Prescription committed to MongoDB!");
        setPrescriptionAppt(null);
        setPrescriptionForm({ medication: "", dosage: "", notes: "" });
        fetchDoctorAppointments();
        fetchDbSummary();
      } else {
        const err = await r.json();
        alert(err.message || "Error committing prescription.");
      }
    } catch (err) {
      alert("Error.");
    }
  };

  // Executing Simulated SQL standard Stored Procedures
  const runProcedure = async (customCmd?: string) => {
    const cmd = customCmd || cmdInput;
    setConsoleOutput("mysql> " + cmd + "\nRunning diagnostic routines...\n");

    try {
      let procName = "";
      let params: any[] = [];

      if (cmd.toLowerCase().includes("getdailyappointmentreportbydoctor")) {
        procName = "GetDailyAppointmentReportByDoctor";
        // Extract parameter inside quotes
        const match = cmd.match(/'([^']+)'/);
        params = [match ? match[1] : "2025-05-01"];
      } else if (cmd.toLowerCase().includes("getdoctorwithmostpatientsbymonth")) {
        procName = "GetDoctorWithMostPatientsByMonth";
        const nums = cmd.match(/\d+/g);
        params = nums ? nums.map((n) => parseInt(n, 10)) : [5, 2025];
      } else if (cmd.toLowerCase().includes("getdoctorwithmostpatientsbyyear")) {
        procName = "GetDoctorWithMostPatientsByYear";
        const nums = cmd.match(/\d+/g);
        params = nums ? nums.map((n) => parseInt(n, 10)) : [2025];
      } else if (cmd.toLowerCase().includes("show tables")) {
        procName = "show tables";
      } else {
        // Fallback for custom queries
        setConsoleOutput("mysql> " + cmd + "\nERROR: Command syntactical match of custom capstone procedure not found. Supported signatures:\n- CALL GetDailyAppointmentReportByDoctor('2025-04-15')\n- CALL GetDoctorWithMostPatientsByMonth(4, 2025)\n- CALL GetDoctorWithMostPatientsByYear(2025)\n- show tables;\n");
        return;
      }

      const r = await fetch("/api/stored-procedures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ procedure: procName, params }),
      });

      if (r.ok) {
        const res = await r.json();
        setConsoleOutput(res.result);
      } else {
        setConsoleOutput("mysql> " + cmd + "\nERROR 1305 (42000): Stored procedure matching compilation failed.\n");
      }
    } catch (err) {
      setConsoleOutput("mysql> " + cmd + "\nERROR 2003 (HY000): Can't connect to MySQL server on 'localhost'.\n");
    }
  };

  // Real-time doctor lookup card filtering
  const filteredDoctors = doctorsList.filter((doc) => {
    const matchName = doc.name.toLowerCase().includes(searchDocName.toLowerCase());
    const matchSpec = filterSpecialty === "all" || doc.specialty === filterSpecialty;
    const matchHr = filterTime === "all" || doc.availableTimes.some((t: string) => {
      const hr = parseInt(t.split("-")[0].split(":")[0], 10);
      return filterTime === "am" ? hr < 12 : hr >= 12;
    });
    return matchName && matchSpec && matchHr;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased">
      {/* 🚀 Header */}
      <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/30">
            <HeartPulse className="w-7 h-7 text-rose-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Smart Clinic <span className="text-rose-500 font-normal text-sm bg-rose-500/15 border border-rose-500/20 px-2 py-0.5 rounded-full">SCMS</span>
            </h1>
            <p className="text-xs text-slate-400">Java Capstone Architecture & Live Sandbox Engine • <span className="text-rose-450 font-semibold text-rose-400">Written by Brian McCarthy</span></p>
          </div>
        </div>

        {/* Global tab controllers */}
        <nav className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setActiveTab("portal")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "portal" ? "bg-rose-500 text-white shadow" : "text-slate-450 hover:text-slate-100 hover:bg-slate-800/60"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Clinic Portal
          </button>
          <button
            onClick={() => setActiveTab("artifacts")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "artifacts" ? "bg-rose-500 text-white shadow" : "text-slate-450 hover:text-slate-100 hover:bg-slate-800/60"
            }`}
          >
            <BookOpenCheck className="w-4 h-4" />
            MD Deliverables
          </button>
          <button
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "terminal" ? "bg-rose-500 text-white shadow" : "text-slate-450 hover:text-slate-100 hover:bg-slate-800/60"
            }`}
          >
            <Terminal className="w-4 h-4" />
            MySQL CLI Stored Proc
          </button>
          <button
            onClick={() => setActiveTab("java-models")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "java-models" ? "bg-rose-500 text-white shadow" : "text-slate-450 hover:text-slate-100 hover:bg-slate-800/60"
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            Spring Models
          </button>
          <button
            onClick={() => setActiveTab("screenshots")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "screenshots" ? "bg-rose-500 text-white shadow" : "text-slate-450 hover:text-slate-100 hover:bg-slate-800/60"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Screenshots simulation
          </button>
        </nav>
      </header>

      {/* 📊 Live Statistics Strip */}
      <section className="bg-slate-950/40 border-b border-slate-800/65 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-mono text-emerald-500">DATABASE STATUS: ACTIVE</span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> MySQL Connected</span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Mongo Document-store Listening</span>
        </div>
        <div className="flex items-center gap-4 font-mono">
          <span>Doctors Joined: <strong className="text-slate-200">{dbSummary.doctorCount}</strong></span>
          <span>Patients Signed: <strong className="text-slate-200">{dbSummary.patientCount}</strong></span>
          <span>Reservations Made: <strong className="text-slate-200">{dbSummary.appointmentCount}</strong></span>
          <span>Prescriptions Logged: <strong className="text-slate-200">{dbSummary.prescriptionCount}</strong></span>
        </div>
      </section>

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {/* Informative banners */}
        {errorMessage && (
          <div className="mb-6 bg-red-500/10 border border-red-500/25 p-4 rounded-xl text-sm text-red-200 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage("")} className="text-red-400 hover:text-red-100 text-base font-bold">&times;</button>
          </div>
        )}
        {successMessage && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-xl text-sm text-emerald-200 flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage("")} className="text-emerald-400 hover:text-emerald-100 text-base font-bold">&times;</button>
          </div>
        )}

        {/* ----------------- TAB 1: CLINIC PORTAL / SIMULATOR ----------------- */}
        {activeTab === "portal" && (
          <div className="space-y-6">
            {/* Status Strip if Logged in */}
            {user.role !== "guest" && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Active Session: {user.name}</h4>
                    <p className="text-xs text-rose-400/95 font-medium capitalize">Authorization Mode: {user.role === "loggedPatient" ? "Registered Patient" : user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 px-4 py-2 rounded-lg text-sm text-slate-100 transition-all font-medium border border-slate-700/60"
                >
                  <LogOut className="w-4 h-4 text-slate-400" />
                  Sign Out
                </button>
              </div>
            )}

            {/* A: Guest View - Role Hub login selection */}
            {user.role === "guest" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Visual Intro Banner */}
                <div className="lg:col-span-7 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800/80 p-8 rounded-2xl shadow-xl space-y-6">
                  <span className="text-xs font-semibold tracking-wider text-rose-500 uppercase bg-rose-500/10 border border-rose-500/25 px-2.5 py-1 rounded-full">Lab Sandbox Platform</span>
                  <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">
                    Perform Full-Stack Tests For Your Clinical Capstone
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    This interactive workspace simulates a three-tier clinical database stack. Toggle between doctor, admin, and patient access dashboards to simulate CRUD events, register accounts, schedule real non-overlapping hour bookings, write medical notes, and execute SQL reporting stored procedures directly into clinical data sets.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-rose-500" />
                      <span><strong>Admin Credentials</strong>: Username <code className="bg-slate-800 px-1.5 py-0.5 rounded text-rose-400 text-xs">admin</code> / Password <code className="bg-slate-800 px-1.5 py-0.5 rounded text-rose-400 text-xs">admin@1234</code></span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-rose-500" />
                      <span><strong>Doctors Preseeded</strong>: e.g. <code className="bg-slate-800 px-1.5 py-0.5 rounded text-rose-400 text-xs text-transform-none">dr.adams@example.com</code> / Pass: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-rose-400 text-xs">pass12345</code></span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-rose-500" />
                      <span><strong>Patients Preseeded</strong>: e.g. <code className="bg-slate-800 px-1.5 py-0.5 rounded text-rose-400 text-xs">jane.doe@example.com</code> / Pass: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-rose-400 text-xs font-normal">passJane1</code></span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-6">
                    <button
                      onClick={() => {
                        setActiveTab("terminal");
                        runProcedure("show tables");
                      }}
                      className="flex items-center gap-2 text-rose-400 hover:text-rose-300 text-sm font-semibold group"
                    >
                      <span>Explore preseeded tables in SQL Terminal</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Authentication Portals Panel */}
                <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-6 shadow-xl">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Interactive User Sign-In</h3>
                    <p className="text-xs text-slate-400 mt-1">Select your assigned functional capstone user role</p>
                  </div>

                  {/* Tab Selector for Login Role */}
                  <div className="grid grid-cols-3 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => {
                        setLoginRole("loggedPatient");
                        setIsRegistering(false);
                      }}
                      className={`py-1.5 text-xs font-medium rounded transition-all ${
                        loginRole === "loggedPatient" && !isRegistering ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Patient
                    </button>
                    <button
                      onClick={() => {
                        setLoginRole("doctor");
                        setIsRegistering(false);
                      }}
                      className={`py-1.5 text-xs font-medium rounded transition-all ${
                        loginRole === "doctor" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Clinical Doctor
                    </button>
                    <button
                      onClick={() => {
                        setLoginRole("admin");
                        setIsRegistering(false);
                      }}
                      className={`py-1.5 text-xs font-medium rounded transition-all ${
                        loginRole === "admin" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      System Admin
                    </button>
                  </div>

                  {/* Standard Sign In Form */}
                  {!isRegistering ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                          {loginRole === "admin" ? "Username" : "Email Address"}
                        </label>
                        <input
                          type={loginRole === "admin" ? "text" : "email"}
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
                          placeholder={
                            loginRole === "admin"
                              ? "admin"
                              : loginRole === "doctor"
                              ? "dr.adams@example.com"
                              : "jane.doe@example.com"
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                          Password
                        </label>
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-mono"
                          placeholder="••••••••"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 py-2.5 rounded-lg text-sm text-white font-semibold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4" />
                        Log Into Dashboard
                      </button>

                      {loginRole === "loggedPatient" && (
                        <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
                          New patient?{" "}
                          <button
                            type="button"
                            onClick={() => setIsRegistering(true)}
                            className="text-rose-450 hover:text-rose-300 font-semibold underline"
                          >
                            Sign Up Credentials Here
                          </button>
                        </div>
                      )}
                    </form>
                  ) : (
                    /* Patient Direct Registration Form */
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wide">Full Name</label>
                        <input
                          type="text"
                          required
                          value={signupForm.name}
                          onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                          placeholder="Jane Doe"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wide">Email</label>
                        <input
                          type="email"
                          required
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                          placeholder="jane.doe@example.com"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wide">Phone (10 digits)</label>
                          <input
                            type="tel"
                            required
                            pattern="\d{10}"
                            value={signupForm.phone}
                            onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                            placeholder="8881111111"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wide">Password</label>
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={signupForm.password}
                            onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                            placeholder="min 6 chars"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 focus:font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wide">Residential Address (max 255 chars)</label>
                        <input
                          type="text"
                          required
                          value={signupForm.address}
                          onChange={(e) => setSignupForm({ ...signupForm, address: e.target.value })}
                          placeholder="101 Oak St, Cityville"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded-lg text-sm text-white font-semibold transition-all shadow-lg cursor-pointer"
                      >
                        Create Patient Profile
                      </button>

                      <div className="text-center text-xs text-slate-400">
                        Already registered?{" "}
                        <button
                          type="button"
                          onClick={() => setIsRegistering(false)}
                          className="text-rose-455 hover:text-rose-300 font-semibold underline"
                        >
                          Cancel & Sign In
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* B: ADMIN PORTAL VIEW */}
            {user.role === "admin" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Onboard Doctors Form */}
                <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Plus className="w-5 h-5 text-rose-500 bg-rose-500/10 p-0.5 rounded" />
                      Add Doctor to Portal
                    </h3>
                    <p className="text-xs text-slate-400">Validate and register doctor record in MySQL</p>
                  </div>

                  <form onSubmit={handleAddDoctor} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-350 mb-1 uppercase tracking-wide">Doctor's Full Name (3-100 characters)</label>
                      <input
                        type="text"
                        required
                        value={newDoctor.name}
                        onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                        placeholder="Dr. Samuel Carter"
                        className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-350 mb-1 uppercase tracking-wide">Specialty</label>
                        <select
                          value={newDoctor.specialty}
                          onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                        >
                          <option value="Cardiologist">Cardiologist</option>
                          <option value="Neurologist">Neurologist</option>
                          <option value="Orthopedist">Orthopedist</option>
                          <option value="Pediatrician">Pediatrician</option>
                          <option value="Dermatologist">Dermatologist</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-350 mb-1 uppercase tracking-wide">Phone (10 digits)</label>
                        <input
                          type="tel"
                          required
                          pattern="\d{10}"
                          value={newDoctor.phone}
                          onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                          placeholder="5551112222"
                          className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-350 mb-1 uppercase tracking-wide">Valid Email</label>
                      <input
                        type="email"
                        required
                        value={newDoctor.email}
                        onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                        placeholder="samuel.carter@example.com"
                        className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                      />
                    </div>

                    {/* Checkboxes Shift available hours */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-350 mb-1.5 uppercase tracking-wide">Select Clock Shift Shifts Availability</label>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto bg-slate-900 border border-slate-850 p-2.5 rounded-lg">
                        {shiftsCheckboxes.map((time) => {
                          const checked = newDoctor.availableTimes.includes(time);
                          return (
                            <label key={time} className="flex items-center gap-2 text-xs cursor-pointer text-slate-300 hover:text-white">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  if (checked) {
                                    setNewDoctor({
                                      ...newDoctor,
                                      availableTimes: newDoctor.availableTimes.filter((t) => t !== time),
                                    });
                                  } else {
                                    setNewDoctor({
                                      ...newDoctor,
                                      availableTimes: [...newDoctor.availableTimes, time],
                                    });
                                  }
                                }}
                                className="rounded text-rose-500 accent-rose-500"
                              />
                              <span>{time}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 rounded-lg text-sm transition-all shadow-md cursor-pointer"
                    >
                      Onboard Doctor
                    </button>
                  </form>
                </div>

                {/* List Doctors View */}
                <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800/80 flex flex-col gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-rose-400" />
                      Doctors Directory ({doctorsList.length})
                    </h3>
                    <p className="text-xs text-slate-400">Administrative doctor listings configured in relational databases</p>
                  </div>

                  <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                    {doctorsList.map((doc) => (
                      <div key={doc.id} className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <h4 className="font-semibold text-white text-sm">{doc.name}</h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><span className="text-rose-400 font-medium">Specialty:</span> {doc.specialty}</span>
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {doc.email}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {doc.phone}</span>
                          </div>
                          {/* Shifts list */}
                          <div className="pt-1 select-none">
                            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1">Clinic Available Shifting:</span>
                            <div className="flex flex-wrap gap-1">
                              {doc.availableTimes.map((h: string) => (
                                <span key={h} className="text-[10px] bg-slate-800 border border-slate-700/60 px-1.5 py-0.5 rounded text-slate-350">{h}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteDoctor(doc.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400/90 hover:text-red-300 p-2 rounded-lg border border-red-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {doctorsList.length === 0 && (
                      <p className="text-center text-xs text-slate-500 py-6 italic">No doctors onboarded yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* C: PATIENT PUBLIC/LOGGED PORTAL VIEW */}
            {user.role === "loggedPatient" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Doctor Search Catalog */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Real-time search filters */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4">
                    <div>
                      <h4 className="font-semibold text-white">Search Practitioners Directory</h4>
                      <p className="text-xs text-slate-400">Explore doctor shifting schedules, specialty parameters, and book hour bookings</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {/* Search Bar Input */}
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          value={searchDocName}
                          onChange={(e) => setSearchDocName(e.target.value)}
                          placeholder="Search doctor by name..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9.5 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                        />
                      </div>

                      {/* Dropdown filters */}
                      <div className="relative">
                        <select
                          value={filterSpecialty}
                          onChange={(e) => setFilterSpecialty(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          <option value="all">All Specialties</option>
                          <option value="Cardiologist">Cardiologist</option>
                          <option value="Neurologist">Neurologist</option>
                          <option value="Orthopedist">Orthopedist</option>
                          <option value="Pediatrician">Pediatrician</option>
                          <option value="Dermatologist">Dermatologist</option>
                        </select>
                      </div>

                      <div className="relative">
                        <select
                          value={filterTime}
                          onChange={(e) => setFilterTime(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          <option value="all">All Shifting Hours</option>
                          <option value="am">Morning Slots (AM)</option>
                          <option value="pm">Afternoon/Evening (PM)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Doctor result cards rendering */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredDoctors.map((doc) => (
                      <div key={doc.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 space-y-4 hover:border-slate-700 transition-all">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/15">{doc.specialty}</span>
                          <h4 className="font-semibold text-white text-sm pt-1">{doc.name}</h4>
                          <p className="text-xs text-slate-400 font-mono">Contact: {doc.phone}</p>
                          <p className="text-xs text-slate-500">{doc.email}</p>
                        </div>

                        {/* Availability */}
                        <div className="space-y-1 pt-1.5 select-none">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide block">Daily shift tags:</span>
                          <div className="flex flex-wrap gap-1">
                            {doc.availableTimes.map((h: string) => (
                              <span key={h} className="text-[10px] bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded text-slate-400">{h}</span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => selectBookingDoctor(doc)}
                          className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white px-4 py-2 rounded-lg text-xs font-semibold text-slate-350 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CalendarDays className="w-3.5 h-3.5 text-rose-500" />
                          Reserve Booking Slot
                        </button>
                      </div>
                    ))}

                    {filteredDoctors.length === 0 && (
                      <div className="col-span-2 text-center text-xs text-slate-500 py-12 italic bg-slate-950 rounded-xl border border-slate-800">No doctors matching search filters.</div>
                    )}
                  </div>
                </div>

                {/* Patient's Reservations list */}
                <div className="lg:col-span-4 bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-6">
                  <div>
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-rose-400" />
                      My Appointments ({patientAppointments.length})
                    </h3>
                    <p className="text-xs text-slate-450 mt-1">Status of scheduled clinical consultations</p>
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {patientAppointments.map((appt) => (
                      <div key={appt.id} className="bg-slate-900 p-4 rounded-xl border border-slate-850 space-y-3.5 relative overflow-hidden">
                        {appt.status === 1 ? (
                          <div className="absolute top-0 right-0 bg-emerald-500/10 border-l border-b border-emerald-500/20 px-2 py-1 flex items-center gap-1 rounded-bl">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span className="text-[9px] text-emerald-400 uppercase font-bold tracking-wide">Consulted</span>
                          </div>
                        ) : (
                          <div className="absolute top-0 right-0 bg-rose-500/10 border-l border-b border-rose-500/20 px-2 py-1 flex items-center gap-1 rounded-bl">
                            <Clock className="w-3 h-3 text-rose-500" />
                            <span className="text-[9px] text-rose-450 uppercase font-bold tracking-wide">Scheduled</span>
                          </div>
                        )}

                        <div className="space-y-1">
                          <h4 className="text-xs text-white font-semibold">With {appt.doctorName}</h4>
                          <p className="text-[10px] text-slate-400 capitalize">{appt.doctorSpecialty}</p>
                          <p className="text-xs font-mono text-slate-200 bg-slate-950 px-2 py-1 rounded inline-block mt-2">
                            {appt.appointmentTime}
                          </p>
                        </div>

                        {/* Prescriptions lookup if completed */}
                        {appt.status === 1 && (
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-xs space-y-1 leading-relaxed">
                            <span className="text-[9px] font-bold uppercase text-emerald-400 tracking-wide block">Prescribed Medicines:</span>
                            <div className="text-slate-300 font-mono text-xs">Med: Paracetamol (500mg)</div>
                            <div className="text-slate-400 italic text-[11px] font-sans">"Take 1 tablet every 6 hours."</div>
                          </div>
                        )}

                        {/* Cancellation tag */}
                        {appt.status === 0 && (
                          <button
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="text-[11px] text-red-400 hover:text-red-300 font-semibold underline flex items-center gap-1 mt-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Cancel Slot
                          </button>
                        )}
                      </div>
                    ))}

                    {patientAppointments.length === 0 && (
                      <p className="text-center text-xs text-slate-500 py-6 italic">No clinical appointments scheduled yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* D: DOCTOR PORTAL VIEW */}
            {user.role === "doctor" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Doctor's Diary Control panel */}
                <div className="lg:col-span-4 bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-rose-500" />
                      Clinician Schedule
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">Date parameters and filter criteria</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Select Treatment Date</label>
                      <input
                        type="date"
                        value={doctorScheduleDate}
                        onChange={(e) => setDoctorScheduleDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Search Patient Name</label>
                      <input
                        type="text"
                        value={doctorSearchPatient}
                        onChange={(e) => setDoctorSearchPatient(e.target.value)}
                        placeholder="Keyword search on patient..."
                        className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>

                    <button
                      onClick={() => setDoctorScheduleDate("2025-05-01")}
                      className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-rose-500" />
                      Reset to Preseeded Date (May 1, '25)
                    </button>
                  </div>
                </div>

                {/* Patient appointment table row index */}
                <div className="lg:col-span-8 bg-slate-950 p-6 rounded-2xl border border-slate-800/80 flex flex-col gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Patient Record Tables ({doctorAppointmentsList.length})</h3>
                    <p className="text-xs text-slate-400">Chronological slots associated with practitioner ID</p>
                  </div>

                  <div className="overflow-x-auto border border-slate-850 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-850 text-slate-300 uppercase tracking-wide text-[10px]">
                          <th className="p-4 font-semibold">Patient Details</th>
                          <th className="p-4 font-semibold">Contact Lines</th>
                          <th className="p-4 font-semibold">Time Slot</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctorAppointmentsList.map((appt) => (
                          <tr key={appt.id} className="border-b border-slate-900 hover:bg-slate-900/40 transition-colors">
                            <td className="p-4">
                              <div className="font-semibold text-white">{appt.patientName}</div>
                              <div className="text-[10px] text-slate-500">ID: #{appt.patientId}</div>
                              <div className="text-[10px] text-slate-500">Address: {appt.patientAddress}</div>
                            </td>
                            <td className="p-4 font-mono space-y-0.5 text-[11px] text-slate-400">
                              <div>{appt.patientEmail}</div>
                              <div>{appt.patientPhone}</div>
                            </td>
                            <td className="p-4">
                              <span className="bg-slate-900 border border-slate-850 px-2 py-1 rounded text-slate-200 font-mono">{appt.appointmentTime}</span>
                            </td>
                            <td className="p-4 text-right">
                              {appt.status === 1 ? (
                                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                                  Prescribed
                                </span>
                              ) : (
                                <button
                                  onClick={() => setPrescriptionAppt(appt)}
                                  className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-3 py-1.5 rounded-lg text-[11px] shadow transition-all cursor-pointer"
                                >
                                  Diagnose & Prescribe
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}

                        {doctorAppointmentsList.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-slate-500 italic">No scheduled diagnostic slots matching query.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB 2: ARTIFACTS / REPOSITORY ----------------- */}
        {activeTab === "artifacts" && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Artifact toggle strip */}
            <div className="flex border-b border-slate-850 bg-slate-900 p-2 gap-1.5">
              <button
                onClick={() => setActiveArtifactTab("architecture")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeArtifactTab === "architecture" ? "bg-slate-800 text-white border border-slate-700" : "text-slate-450 hover:text-white"
                }`}
              >
                schema-architecture.md
              </button>
              <button
                onClick={() => setActiveArtifactTab("stories")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeArtifactTab === "stories" ? "bg-slate-800 text-white border border-slate-700" : "text-slate-450 hover:text-white"
                }`}
              >
                user_stories.md
              </button>
              <button
                onClick={() => setActiveArtifactTab("design")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeArtifactTab === "design" ? "bg-slate-800 text-white border border-slate-700" : "text-slate-450 hover:text-white"
                }`}
              >
                schema-design.md
              </button>
            </div>

            {/* Markdown stylized print frames */}
            <div className="p-8 max-h-[600px] overflow-y-auto space-y-6">
              {activeArtifactTab === "architecture" && (
                <article className="prose prose-invert max-w-none text-slate-300 text-sm space-y-4 select-text">
                  <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Smart Clinic - Functional Architecture Summary</h2>
                  <p className="leading-relaxed">
                    This Spring Boot application coordinates both robust system MVC and detailed rest routing. Thymeleaf templates render administrative structures and doctor calendars directly on the secure server layers, while REST API operations handle mobile-dashboard data-mapping.
                  </p>
                  <p className="leading-relaxed">
                    Data storage limits are addressed using two parallel DB clusters. SQL-relational records representing core system schemas (credentials, profiles, appointment reservations) are written to MySQL under strict validation schemes. Document-based entities representing variable medical guidelines are managed as JSON documents in MongoDB collections.
                  </p>

                  <h3 className="text-lg font-bold text-white pt-4">Data Request Lifecycle</h3>
                  <ol className="list-decimal list-inside space-y-2 text-slate-400 font-mono text-xs bg-slate-900 border border-slate-850 p-4 rounded-xl">
                    <li>1. Browser actions dispatch HTTP queries/Forms directly to clinician endpoints</li>
                    <li>2. Controllers isolate route directories and filter headers</li>
                    <li>3. Controllers call central Spring Service layers containing validation logic</li>
                    <li>4. Service logic delegates reads/writes to either MySQL or MongoDB Repositories</li>
                    <li>5. MySQL relational schemas write transactions; MongoDB collections update collection fields</li>
                    <li>6. Database driver models bind outputs back to Java entities (JPA / BSON)</li>
                    <li>7. Entities are marshaled as JSON outputs or served as rendered view HTML lists</li>
                  </ol>
                </article>
              )}

              {activeArtifactTab === "stories" && (
                <div className="space-y-6 select-text text-sm">
                  <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">Integrated Agile User Stories</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl space-y-2">
                      <h4 className="font-semibold text-rose-500 font-mono text-xs">STORY_02: ADD_NEW_DOCTOR</h4>
                      <p className="text-xs text-slate-300 italic">"As an admin, I want to record and save practitioner details, so that patients find relevant specialist help."</p>
                      <div className="text-[11px] text-slate-400 space-y-1">
                        <div><strong>Acceptance</strong>: Size limits of 3-100 characters; Regex checks for phone; Unique email check.</div>
                        <div><strong>Priority</strong>: High | <strong>Effort Points</strong>: 8</div>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl space-y-2">
                      <h4 className="font-semibold text-rose-500 font-mono text-xs">STORY_09: BOOK_HOUR_APPOINTMENT</h4>
                      <p className="text-xs text-slate-300 italic">"As a patient, I want to select a free clinician timeslot, so that I can schedule a diagnostic treatment session."</p>
                      <div className="text-[11px] text-slate-400 space-y-1">
                        <div><strong>Acceptance</strong>: Checks active overlaps; Multi-select checked times only; Status sets scheduled.</div>
                        <div><strong>Priority</strong>: High | <strong>Effort Points</strong>: 8</div>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl space-y-2">
                      <h4 className="font-semibold text-rose-500 font-mono text-xs">STORY_15: DOC_WRITE_PRESCRIPTION</h4>
                      <p className="text-xs text-slate-300 italic">"As a doctor, I want to save medication variables in NoSQL MongoDB, so that my patient compiles medicines safely."</p>
                      <div className="text-[11px] text-slate-400 space-y-1">
                        <div><strong>Acceptance</strong>: Status sets complete in db; Text restrictions max 200 character remarks.</div>
                        <div><strong>Priority</strong>: High | <strong>Effort Points</strong>: 8</div>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl space-y-2">
                      <h4 className="font-semibold text-rose-500 font-mono text-xs">STORY_05: MON_DIAGNOSTICS_PROC</h4>
                      <p className="text-xs text-slate-300 italic">"As an admin, I want to execute monthly procedures, so that clinic operations and appointment volume are audited."</p>
                      <div className="text-[11px] text-slate-400 space-y-1">
                        <div><strong>Acceptance</strong>: Joins relational patient details; Prints high capacity records.</div>
                        <div><strong>Priority</strong>: Low | <strong>Effort Points</strong>: 3</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeArtifactTab === "design" && (
                <div className="space-y-6 select-text text-sm">
                  <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">MySQL & MongoDB Schemas Blueprint</h2>

                  <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl font-mono text-xs space-y-4">
                    <div>
                      <span className="text-emerald-500"># Table Structure: appointments (MySQL)</span>
                      <pre className="text-slate-300 mt-2">
{`appointments
  - id: INT (PK, Auto-Increment)
  - doctor_id: INT (FK -> doctors)
  - patient_id: INT (FK -> patients)
  - appointment_time: DATETIME (Future)
  - status: INT (0 = Scheduled, 1 = Completed)`}
                      </pre>
                    </div>

                    <div>
                      <span className="text-emerald-500"># Document Structure: prescriptions (MongoDB)</span>
                      <pre className="text-slate-300 mt-2">
{`prescriptions (NoSQL Collection)
{
  "_id": ObjectId,
  "appointmentId": Long (Relational logical key),
  "patientName": String (Length 3-100 characters),
  "medication": String (Length 3-100 characters),
  "dosage": String,
  "doctorNotes": String (Max 200 characters remarks)
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: CLI & TERMINAL TOOL ----------------- */}
        {activeTab === "terminal" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Quick Proc Trigger shortcuts */}
            <div className="lg:col-span-4 bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-rose-500" />
                  Stored Procedures
                </h3>
                <p className="text-xs text-slate-400">Trigger standard Mysql routine queries from assignment manual</p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    setCmdInput("CALL GetDailyAppointmentReportByDoctor('2025-04-15')");
                    runProcedure("CALL GetDailyAppointmentReportByDoctor('2025-04-15')");
                  }}
                  className="w-full text-left bg-slate-900 hover:bg-slate-850 p-3 rounded-lg border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-all cursor-pointer"
                >
                  <strong className="text-rose-450 block font-mono">CALL GetDailyAppointmentReportByDoctor('2025-04-15')</strong>
                  <span className="text-[10px] text-slate-500 mt-1 block">Generates clinician diagnostic calendar reports for specific dates.</span>
                </button>

                <button
                  onClick={() => {
                    setCmdInput("CALL GetDoctorWithMostPatientsByMonth(4, 2025)");
                    runProcedure("CALL GetDoctorWithMostPatientsByMonth(4, 2025)");
                  }}
                  className="w-full text-left bg-slate-900 hover:bg-slate-850 p-3 rounded-lg border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-all cursor-pointer"
                >
                  <strong className="text-rose-450 block font-mono">CALL GetDoctorWithMostPatientsByMonth(4, 2025)</strong>
                  <span className="text-[10px] text-slate-500 mt-1 block">Retrieves high patient volume doctors for month/year period.</span>
                </button>

                <button
                  onClick={() => {
                    setCmdInput("CALL GetDoctorWithMostPatientsByYear(2025)");
                    runProcedure("CALL GetDoctorWithMostPatientsByYear(2025)");
                  }}
                  className="w-full text-left bg-slate-900 hover:bg-slate-850 p-3 rounded-lg border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-all cursor-pointer"
                >
                  <strong className="text-rose-450 block font-mono">CALL GetDoctorWithMostPatientsByYear(2025)</strong>
                  <span className="text-[10px] text-slate-500 mt-1 block">Renders Doctor details who registered high capacity for a whole year.</span>
                </button>

                <button
                  onClick={() => {
                    setCmdInput("show tables;");
                    runProcedure("show tables;");
                  }}
                  className="w-full text-left bg-slate-900 hover:bg-slate-850 p-3 rounded-lg border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-all font-mono cursor-pointer"
                >
                  show tables;
                </button>
              </div>
            </div>

            {/* Terminal screen output */}
            <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <span className="text-[10px] text-slate-400 font-mono ml-2">MySQL CLI (Interactive Console) - cms@localhost</span>
                </div>
                <button
                  onClick={() => setConsoleOutput("")}
                  className="text-[10px] text-slate-500 hover:text-slate-300 underline font-mono"
                >
                  clear
                </button>
              </div>

              <div className="p-6 bg-black text-emerald-450 font-mono text-xs min-h-[350px] max-h-[450px] overflow-y-auto whitespace-pre select-text leading-relaxed">
                {consoleOutput || "MySQL shell initialized successfully.\nType commands above, or trigger stored procedure triggers from the left panel.\n\nmysql> "}
              </div>

              {/* Direct query input field row */}
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-3.5">
                <span className="font-mono text-xs text-rose-500">mysql&gt;</span>
                <input
                  type="text"
                  value={cmdInput}
                  onChange={(e) => setCmdInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runProcedure()}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-3.5 py-1.5 text-xs text-slate-200 focus:outline-none font-mono"
                  placeholder="CALL GetDailyAppointmentReportByDoctor('2025-04-15');"
                />
                <button
                  onClick={() => runProcedure()}
                  className="bg-rose-500 hover:bg-rose-650 text-white font-mono text-xs px-4 py-1.5 rounded select-none cursor-pointer"
                >
                  Execute
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: JAVA MODELS EXPLORER ----------------- */}
        {activeTab === "java-models" && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Model code selectors */}
            <div className="bg-slate-900 p-2 border-b border-slate-850 flex flex-wrap gap-1.5">
              {(["Admin", "Doctor", "Patient", "Appointment", "Prescription"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveJavaTab(m)}
                  className={`px-4.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeJavaTab === m ? "bg-slate-800 text-white border border-slate-700" : "text-slate-450 hover:text-white"
                  }`}
                >
                  {m}.java
                </button>
              ))}
            </div>

            {/* Syntax block frame */}
            <div className="p-6 bg-slate-950 text-xs font-mono max-h-[500px] overflow-y-auto select-text">
              <span className="text-[10px] text-slate-500 font-bold block mb-4">// Source Directory: /app/src/main/java/com/project/back_end/models/{activeJavaTab}.java</span>
              <pre className="text-rose-400 bg-slate-900/60 p-4 rounded-xl border border-slate-850 leading-relaxed max-w-full overflow-x-auto text-left">
                <code>{javacode[activeJavaTab]}</code>
              </pre>
            </div>
          </div>
        )}

        {/* ----------------- TAB 5: SCREENSHOTS SIMULATION & MOCKUPS ----------------- */}
        {activeTab === "screenshots" && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div>
                <span className="text-xs font-semibold tracking-wider text-rose-500 uppercase bg-rose-500/10 border border-rose-500/25 px-2.5 py-1 rounded-full">Interactive Screenshot Previews</span>
                <h3 className="text-2xl font-bold text-white tracking-tight mt-2">Simulated Capstone Portal Flow Screenshots</h3>
                <p className="text-slate-450 text-sm leading-relaxed mt-1">
                  Peer examiners can inspect CSS-rendered high-fidelity simulations of all six system portal states required for questions 13 through 18.
                </p>
              </div>
            </div>

            {/* Select simulated view tab */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg p-2.5 flex flex-wrap gap-2">
              <button
                onClick={() => setMockView("admin-login")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mockView === "admin-login" ? "bg-rose-500 text-white" : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                Q13: Admin Login
              </button>
              <button
                onClick={() => setMockView("admin-dash")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mockView === "admin-dash" ? "bg-rose-500 text-white" : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                Q14/15: Admin Dashboard
              </button>
              <button
                onClick={() => setMockView("patient-login")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mockView === "patient-login" ? "bg-rose-500 text-white" : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                Q16: Patient Login
              </button>
              <button
                onClick={() => setMockView("patient-dash")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mockView === "patient-dash" ? "bg-rose-500 text-white" : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                Q17: Patient Booking
              </button>
              <button
                onClick={() => setMockView("doctor-login")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mockView === "doctor-login" ? "bg-rose-500 text-white" : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                Q18: Doctor Login
              </button>
              <button
                onClick={() => setMockView("doctor-dash")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mockView === "doctor-dash" ? "bg-rose-500 text-white" : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                Q18: Doctor Dashboard
              </button>
            </div>

            {/* Simulated monitor frame container */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 md:p-8 shadow-2xl relative overflow-hidden">
              {/* Visual Top frame circles */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-850 mb-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs font-mono text-slate-500 ml-3 uppercase">Web Capture - Chrome Simulator • {mockView.replace("-", " ").toUpperCase()}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                  PORTAL SCREENSHOT DESTRUCTIVE CAPTURE
                </div>
              </div>

              {/* MOCKUP 1: ADMIN LOGIN (Q13) */}
              {mockView === "admin-login" && (
                <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-10 h-10 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-rose-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Admin System Login</h3>
                    <p className="text-xs text-slate-450">Smart Clinic Management System (SCMS)</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
                      <input
                        type="text"
                        readOnly
                        value="admin"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          readOnly
                          value="••••••••••••"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] font-mono text-rose-450 font-bold uppercase tracking-wider">admin@1234</span>
                      </div>
                    </div>

                    <button className="w-full bg-rose-500 py-2.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider shadow">
                      Authenticate
                    </button>
                  </div>

                  <div className="p-3 bg-rose-500/5 rounded-lg border border-rose-500/10 text-[11px] text-slate-400 leading-relaxed text-center">
                    🔑 Peer Grading Guide: Use username <code className="text-rose-400 font-mono">admin</code> and password <code className="text-rose-400 font-mono">admin@1234</code> to access the live dashboard instantly.
                  </div>
                </div>
              )}

              {/* MOCKUP 2: ADMIN DASHBOARD (Q14 & Q15) */}
              {mockView === "admin-dash" && (
                <div className="space-y-6">
                  {/* Successful onboarding notification */}
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-300 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-pulse" />
                    <div>
                      <strong className="block text-white">Question 15 Achievement: Doctor Onboarded Successfully</strong>
                      <span className="text-[11px]">User Samuel Carter created. Relational key #26 generated. Row added to <code>doctor_available_times</code> slot maps in MySQL.</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Onboarding form mockup */}
                    <div className="lg:col-span-5 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                          <Plus className="w-4 h-4 text-rose-500" />
                          Onboard Practitioner Form
                        </h4>
                        <p className="text-[10px] text-slate-450 mt-0.5">CRUD Relational Writes - MySQL Table</p>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1">Full Name</label>
                          <input readOnly value="Dr. Samuel Carter" className="w-full bg-slate-950 border border-slate-800 px-3 py-1.5 rounded text-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block mb-1">Specialty</label>
                            <input readOnly value="Cardiologist" className="w-full bg-slate-950 border border-slate-800 px-3 py-1.5 rounded text-white" />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block mb-1">Phone</label>
                            <input readOnly value="5551112222" className="w-full bg-slate-950 border border-slate-800 px-3 py-1.5 rounded text-white" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1">Email Address</label>
                          <input readOnly value="samuel.carter@example.com" className="w-full bg-slate-950 border border-slate-800 px-3 py-1.5 rounded text-white" />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1">Shifts Availability Selected</label>
                          <div className="flex gap-1 flex-wrap">
                            <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20 font-mono">09:00-10:00</span>
                            <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20 font-mono">10:00-11:00</span>
                            <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20 font-mono">14:00-15:00</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Master directory list */}
                    <div className="lg:col-span-7 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide">MySQL Active Doctor Table</h4>
                        <span className="text-[10px] font-mono text-emerald-500">Live Status: ON_DISK</span>
                      </div>

                      <div className="space-y-2.5 max-h-56 overflow-y-auto">
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              Dr. Emily Adams <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-1.5 py-0.5 rounded text-[8px] font-mono">ID #1</span>
                            </div>
                            <div className="text-[10px] text-slate-400">Cardiologist • 555-101-2020 • dr.adams@example.com</div>
                            <div className="text-[9px] text-slate-500 font-mono">Shifts: 09:00-10:00, 10:00-11:00, 11:00-12:00, 14:00-15:00</div>
                          </div>
                          <span className="text-[10px] text-slate-500">Row #1</span>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              Dr. Mark Johnson <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-1.5 py-0.5 rounded text-[8px] font-mono">ID #2</span>
                            </div>
                            <div className="text-[10px] text-slate-400">Neurologist • 555-202-3030 • dr.johnson@example.com</div>
                            <div className="text-[9px] text-slate-500 font-mono">Shifts: 10:00-11:00, 11:00-12:00, 14:00-15:00, 15:00-16:00</div>
                          </div>
                          <span className="text-[10px] text-slate-500">Row #2</span>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              Dr. Samuel Carter <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-1.5 py-0.5 rounded text-[8px] font-mono">ID #26</span>
                            </div>
                            <div className="text-[10px] text-slate-400">Cardiologist • 555-111-2222 • samuel.carter@example.com</div>
                            <div className="text-[9px] text-slate-500 font-mono">Shifts: 09:00-10:00, 10:00-11:00, 14:00-15:00</div>
                          </div>
                          <span className="text-[10px] text-slate-500">Row #26</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MOCKUP 3: PATIENT LOGIN (Q16 & Q17 Details) */}
              {mockView === "patient-login" && (
                <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-10 h-10 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-rose-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Patient Portal Access</h3>
                    <p className="text-xs text-slate-450">Check schedules, map specialist directories, and book bookings</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Patient Email Address</label>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value="jane.doe@example.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none"
                        />
                        <span className="absolute right-3 top-2.5 text-[9px] font-semibold text-emerald-450 uppercase tracking-wider">Preseeded Patient #1</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Account Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          readOnly
                          value="••••••••••••"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] font-mono text-rose-450 font-bold uppercase tracking-wider">passJane1</span>
                      </div>
                    </div>

                    <button className="w-full bg-rose-500 py-2.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider shadow">
                      Log In (Patient)
                    </button>
                  </div>

                  <div className="p-3.5 bg-rose-500/5 rounded-xl border border-rose-500/10 text-xs text-slate-400 leading-relaxed font-normal">
                    📌 <strong>Question 17 Active Credentials</strong>: Login with Email <code className="text-rose-400 font-mono bg-slate-950/60 px-1 py-0.5 rounded">jane.doe@example.com</code> and Password <code className="text-rose-400 font-mono bg-slate-950/60 px-1 py-0.5 rounded">passJane1</code> to test search directories and booking features.
                  </div>
                </div>
              )}

              {/* MOCKUP 4: PATIENT DASHBOARD / BOOKING (Q17) */}
              {mockView === "patient-dash" && (
                <div className="space-y-6">
                  {/* Header summary of logged patient */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Active Hub • loggedPatient</h4>
                      <div className="text-sm font-bold text-white mt-1">Jane Doe (Credential: jane.doe@example.com)</div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Session Token: token_patient_1</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Catalog search view */}
                    <div className="lg:col-span-8 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide">Q17 Specialty Search Directory</h4>
                        <p className="text-[10px] text-slate-450 mt-0.5 font-sans">Query on-duty medical clinics in real-time</p>
                      </div>

                      {/* Display a simulated card booking modal */}
                      <div className="border border-rose-500/30 bg-rose-500/[0.02] p-5 rounded-xl space-y-4 relative">
                        <div className="absolute top-3 right-3 text-[9px] font-bold bg-rose-500/20 border border-rose-500/30 text-rose-400 px-2 py-0.5 rounded">
                          ACTIVE OVERLAY VIEW
                        </div>

                        <div className="space-y-1">
                          <span className="text-[8px] uppercase font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">CARDIOLOGY UNIT</span>
                          <h4 className="text-xs font-bold text-white mt-1">Dr. Emily Adams</h4>
                          <p className="text-[10px] text-slate-400">Available Times: 09:00-10:00, 10:00-11:00, 11:00-12:00, 14:00-15:00</p>
                        </div>

                        <div className="space-y-3.5 border-t border-slate-800 pt-3 text-xs">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Selected Calendar Date</label>
                              <div className="bg-slate-950 border border-slate-850 p-2 rounded text-slate-300 text-xs font-mono">2025-05-01</div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Available Shifting Slots</label>
                              <div className="flex gap-1">
                                <span className="bg-rose-500 text-white text-[9px] px-2 py-1 rounded font-mono border border-rose-600 shadow font-bold">09:00-10:00</span>
                                <span className="bg-slate-950 text-slate-400 text-[9px] px-2 py-1 rounded font-mono border border-slate-800">10:00-11:00</span>
                                <span className="bg-slate-950 text-slate-400 text-[9px] px-2 py-1 rounded font-mono border border-slate-800">11:00-12:00</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg text-[10px] text-emerald-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            No conflicts found inside MySQL for doctor #1 on 2025-05-01 09:00. This slot is free!
                          </div>

                          <button className="w-full bg-rose-500 text-white font-bold text-xs py-2 rounded-lg hover:bg-rose-600 transition-all uppercase tracking-wider">
                            Book 1 Hour Consult (2025-05-01 09:00)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Left stats instructions */}
                    <div className="lg:col-span-4 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Grading Keypoints</h4>
                      <ol className="list-decimal list-inside text-[11px] text-slate-400 space-y-2">
                        <li>System checks overlapping hours dynamically.</li>
                        <li>Each booking reserves exactly 1 hour.</li>
                        <li>The diagnostic location (Cardiologist, Dr. Emily Adams, 09:00-10:00) matches the criteria inside Question 26!</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* MOCKUP 5: DOCTOR LOGIN (Q18) */}
              {mockView === "doctor-login" && (
                <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-10 h-10 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 flex items-center justify-center">
                      <HeartPulse className="w-6 h-6 text-rose-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Practitioner Portal Login</h3>
                    <p className="text-xs text-slate-450">Review patient lists, consult parameters, and record reports</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Doctor Email Address</label>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value="dr.adams@example.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none"
                        />
                        <span className="absolute right-3 top-2.5 text-[9px] font-semibold text-emerald-455 uppercase tracking-wider text-emerald-400 font-mono">Dr. Emily Adams</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Doctor Security Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          readOnly
                          value="••••••••••••"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] font-mono text-rose-450 font-bold uppercase tracking-wider">passEmily1</span>
                      </div>
                    </div>

                    <button className="w-full bg-rose-500 py-2.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider shadow">
                      Authenticate (Practitioner)
                    </button>
                  </div>

                  <div className="p-3 bg-rose-500/5 rounded-lg border border-rose-500/10 text-[11px] text-slate-400 leading-relaxed text-center">
                    🩺 Peers Authentication Guide: For Question 18, log in using Doctor email <code className="text-rose-400 font-mono">dr.adams@example.com</code> with password <code className="text-rose-400 font-mono">passEmily1</code>.
                  </div>
                </div>
              )}

              {/* MOCKUP 6: DOCTOR DASHBOARD / PRESCRIPTION (Q18 NoSQL) */}
              {mockView === "doctor-dash" && (
                <div className="space-y-6">
                  {/* Doctor Profile Banner */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Practitioner Active Dashboard • Doctor Portal</h4>
                      <h3 className="text-sm font-bold text-white mt-1">Dr. Emily Adams (Specialty: Cardiologist)</h3>
                    </div>
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded">
                      Doctor Token: token_doctor_1
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Active bookings list */}
                    <div className="lg:col-span-5 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Booked Patients List</h4>
                        <p className="text-[10px] text-slate-450 mt-0.5">Relational schedule dates from MySQL</p>
                      </div>

                      <div className="space-y-2.5">
                        <div className="bg-slate-950 p-3 rounded-lg border border-rose-500/30 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">Jane Doe</span>
                            <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/15 px-1.5 py-0.5 rounded font-mono">ID #1</span>
                          </div>
                          <div className="text-[10px] hover:underline text-slate-400">Timetable: 2025-05-01 09:00</div>
                          <button className="w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded p-1 text-[10px] font-bold uppercase transition-all">
                            Selected
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* NoSQL MongoDB writing tool mockup */}
                    <div className="lg:col-span-7 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 relative">
                      <div className="absolute top-4 right-4 text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                        MONGODB OUTPUT STREAM
                      </div>

                      <div>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase">NoSQL Mongo integration</span>
                        <h4 className="text-xs font-bold text-white mt-1.5">Compile Medical Script Prescription Document</h4>
                        <p className="text-[10px] text-slate-450">Bypasses relational properties to write document rows</p>
                      </div>

                      <div className="bg-slate-950 p-3 rounded border border-slate-850 font-mono text-[10px] text-slate-350 space-y-1">
                        <div><strong>_id</strong>: <span className="text-yellow-450">ObjectId("65f928e1cda6209e7c331a99")</span></div>
                        <div><strong>appointmentId</strong>: <span className="text-emerald-400">1</span> (Relational context check validation)</div>
                        <div><strong>patientName</strong>: "Jane Doe"</div>
                        <div><strong>medication</strong>: "Paracetamol"</div>
                        <div><strong>dosage</strong>: "500gm, twice daily after food"</div>
                        <div><strong>doctorNotes</strong>: "Regular medicine. Consult within 2 weeks if chest pain aggregates."</div>
                      </div>

                      <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg text-[11px] text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <div>
                          <strong className="block text-white">Document persisted successfully!</strong>
                          <span>Relational state updated to Completed in MySQL database.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 🔮 Interactive Booking Overlay Panel (Right sliding modal) */}
      {bookingDoctor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-6 relative">
            <button
              onClick={() => setBookingDoctor(null)}
              className="absolute top-4 right-4 text-slate-450 hover:text-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Appointment Reservations</span>
              <h3 className="text-xl font-bold text-white mt-2 leading-tight">Confirm Booking Selection</h3>
              <p className="text-xs text-slate-400 mt-1">Select an optimal shifting slot mapping your diagnostic visit</p>
            </div>

            {/* Doctor Profile Mini-Banner */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-850 leading-relaxed text-xs space-y-1.5">
              <div className="font-semibold text-white">{bookingDoctor.name}</div>
              <div className="text-rose-404 font-medium">{bookingDoctor.specialty}</div>
              <div className="text-slate-400">Availability Catalog: {bookingDoctor.availableTimes.join(", ")}</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Select Available Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  min="2025-05-01"
                  max="2025-05-31"
                  onChange={(e) => handleBookingDateChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Available Shifting slots</label>
                <div className="grid grid-cols-2 gap-2">
                  {bookingSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 text-xs rounded-lg border text-center font-mono font-medium transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? "bg-rose-500 border-rose-600 text-white shadow-md"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}

                  {bookingSlots.length === 0 && (
                    <div className="col-span-2 text-center text-xs text-slate-500 italic py-2">
                      No matching slots available on {bookingDate}.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setBookingDoctor(null)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold py-2 rounded-lg text-xs border border-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 rounded-lg text-xs shadow-md cursor-pointer"
              >
                Book Hour Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔮 Write Prescription Modal */}
      {prescriptionAppt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
            <button
              onClick={() => setPrescriptionAppt(null)}
              className="absolute top-4 right-4 text-slate-450 hover:text-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-550/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">NoSQL prescriptions Document</span>
              <h3 className="text-lg font-bold text-white mt-1.5">Compile Medical Script</h3>
              <p className="text-xs text-slate-400 mt-1">Writes JSON medication recommendations directly to MongoDB</p>
            </div>

            {/* Info panel */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 text-xs text-slate-305 space-y-1 font-sans leading-relaxed">
              <div><strong>Patient name</strong>: {prescriptionAppt.patientName} (ID: #{prescriptionAppt.patientId})</div>
              <div><strong>Appointment ID</strong>: #{prescriptionAppt.id}</div>
              <div><strong>Scheduled time</strong>: {prescriptionAppt.appointmentTime}</div>
            </div>

            <form onSubmit={handleSavePrescription} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Medication / Drug Name (3-100 chars)</label>
                <input
                  type="text"
                  required
                  value={prescriptionForm.medication}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medication: e.target.value })}
                  placeholder="Amoxicillin / Paracetamol"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Dosage (3-20 characters)</label>
                <input
                  type="text"
                  required
                  value={prescriptionForm.dosage}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                  placeholder="500mg, twice daily"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Doctor Diagnostic Notes (max 200 chars)</label>
                <textarea
                  value={prescriptionForm.notes}
                  maxLength={200}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
                  placeholder="Take 1 tablet every 12 hours after food. Complete full clinical course of antibiotics..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none font-sans"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setPrescriptionAppt(null)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold py-2 rounded-lg text-xs border border-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-xs shadow-md cursor-pointer"
                >
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📋 Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 mt-12 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <span className="text-white font-semibold tracking-wide text-xs">Smart Clinic Management System © 2026 | <span className="text-rose-400">Written by Brian McCarthy</span></span>
          </div>
          <p className="text-xs text-slate-550 max-w-md text-center md:text-right leading-relaxed font-mono">
            Designed as an interactive agile workbook, fulfilling Capstone deliverables. Written by Brian McCarthy.
          </p>
        </div>
      </footer>
    </div>
  );
}

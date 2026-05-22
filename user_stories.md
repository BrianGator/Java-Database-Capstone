# Smart Clinic Management System - User Stories

This file contains the user stories mapped out for the Smart Clinic Management System. They follow the agile methodology template covering Admins, Patients, and Doctors.

---

## Admin User Stories

### Story 1: Secure Admin Login
**Title:** Admin User Authentication  
_As an admin, I want to log into the portal with my username and password, so that I can securely manage system resources and access restricted administrative functions._  
**Acceptance Criteria:**
1. The login form must require a username and password.
2. Invalid credentials must display an alert message saying "Invalid credentials!".
3. Successful login should yield a security token and redirect the admin to the Admin Dashboard.  
**Priority:** High  
**Story Points:** 5  
**Notes:**
- Hardcoded initial credentials 'admin' and 'admin@1234' are used for development/testing roles.

### Story 2: Secure Admin Logout
**Title:** Administrative Logout Session Termination  
_As an admin, I want to securely log out of the portal, so that I can prevent unauthorized access to the clinical backend when leaving my workstation._  
**Acceptance Criteria:**
1. Clicking 'Logout' must clear the session token and user role from browser security storage (`localStorage`).
2. The user must be redirected back to the root landing screen immediately.
3. Accessing `/adminDashboard` after logging out must be forbidden.  
**Priority:** Medium  
**Story Points:** 2  
**Notes:**
- Ensure that cached data remains secure on public computers in the clinic.

### Story 3: Add Doctors to the Portal
**Title:** Administrative Doctor Onboarding  
_As an admin, I want to register and add new doctor profiles to the Smart Clinic system, so that patients are able to view their availability and book slots._  
**Acceptance Criteria:**
1. Form input values must validate Doctor Full Name (3-100 characters), Specialization (3-50 characters), Email (valid email format), Phone (10 digits), Password (minimum 6 characters), and availability.
2. Saving a duplicate doctor email must return a conflict warning "Doctor already exists".
3. Added doctors must instantly populate the Doctor selection grid on dashboards.  
**Priority:** High  
**Story Points:** 8  
**Notes:**
- Admin can multi-select available time slots during onboarding.

### Story 4: Delete Doctor Profiles
**Title:** Administrative Doctor Deletion  
_As an admin, I want to delete a doctor's profile from the portal, so that retired or resigned clinical staff are removed from patient scheduling search records._  
**Acceptance Criteria:**
1. The deletion requires an explicit confirmation step before proceeding.
2. Associated appointments of the deleted doctor must be cleanly updated or canceled.
3. Deletion must instantly remove the doctor's card layout from the view.  
**Priority:** Medium  
**Story Points:** 5  
**Notes:**
- Use cascading logic so deletion of a doctor clean-deletes associated relational children records in MySQL.

### Story 5: Execute Monthly Usage Stored Procedures
**Title:** System Usage Diagnostics and Reporting  
_As an admin, I want to execute SQL stored procedures via the clinic CLI dashboard, so that I can track monthly appointment counts to analyze clinic workload._  
**Acceptance Criteria:**
1. Executing `CALL GetDoctorWithMostPatientsByMonth(month, year)` must fetch the doctor with the highest patient count.
2. Stored procedures should run efficiently by joining the relational database tables `appointment` and `doctor`.
3. The database analytics results should be output in clean, diagnostic report tables.  
**Priority:** Low  
**Story Points:** 3  
**Notes:**
- Helpful for clinic managers to evaluate high-capacity practitioners without burdening frontend UI services.

---

## Patient User Stories

### Story 6: Explore Doctors without Logging In
**Title:** Public Doctor Search & Filtering  
_As an unregistered patient, I want to search and view a list of available clinic practitioners, so that I can find a relevant specialist before registering an account._  
**Acceptance Criteria:**
1. The search input must perform real-time, case-insensitive partial searches on doctors.
2. Filter dropdowns must allow sorting in real-time by surgical/medical specialty and AM/PM time availability slots.
3. Users who select "Book Now" while unauthenticated must see an alert explaining login is required.  
**Priority:** Medium  
**Story Points:** 5  
**Notes:**
- Allows low-friction discovery for prospective patients visiting the clinic website.

### Story 7: Patient Registration / Sign Up
**Title:** Patient Account Creation  
_As a new patient, I want to self-sign up using my email, password, and contact info, so that I can gain secure booking rights inside the clinic portal._  
**Acceptance Criteria:**
1. The signup form validates Email format, Name (3-100 chars), Phone (10 numeric digits), and Password (minimum 6 digits).
2. Signing up with a phone number or email that is already registered returns a detailed conflict validation error.
3. Registration auto-logs or redirects the user directly to the login panel.  
**Priority:** High  
**Story Points:** 8  
**Notes:**
- Basic fields like address and demographics are captured to populate primary practitioner records.

### Story 8: Patient Secure Login
**Title:** Patient Portal Login  
_As a registered patient, I want to securely log into the system with my email and password, so that I can manage my appointments and medical prescriptions._  
**Acceptance Criteria:**
1. Submit path authenticates the user credentials against entries in the `patient` table.
2. Successful login returns a session token and updates the application layout to "loggedPatient" status.
3. Invalid passwords return a generic, clear authentication error.  
**Priority:** High  
**Story Points:** 5  
**Notes:**
- Session is persisted locally so active patient remains logged in during page transitions.

### Story 9: Consult Doctor by Booking Appointments
**Title:** Schedule Hour-Long Appointment Slots  
_As an authenticated patient, I want to book an hour-long consultation with a selected doctor, so that I can get diagnosed and treated for my symptoms._  
**Acceptance Criteria:**
1. Booking form validation locks the selection to available future timeslots matching the selected practitioner.
2. The endpoint blocks overlapping appointment schedules on identical times.
3. Confirmed bookings are immediately written to MySQL and display in "My Appointments".  
**Priority:** High  
**Story Points:** 8  
**Notes:**
- A default duration of 1 hour is computed natively by database layer and transient getters.

### Story 10: View Upcoming Appointments Checklist
**Title:** Patient Booking Tracker  
_As a patient, I want to view a chronological index of my upcoming appointments, so that I can prepare my medical papers and arrive on time._  
**Acceptance Criteria:**
1. Upcoming records are pulled from database and sorted ascending from nearest date onward.
2. Cancel buttons should permit patients to remove scheduled bookings safely.
3. Appointments marked as completed or past must be visually categorized differently than active bookings.  
**Priority:** Medium  
**Story Points:** 3  
**Notes:**
- Simplifies patient preparation cycles.

---

## Doctor User Stories

### Story 11: Doctor Secure Portal Authentication
**Title:** Physician Portal Login  
_As a clinic doctor, I want to authenticate into my medical terminal, so that I can access private patient lists and prescribe medications safely._  
**Acceptance Criteria:**
1. Login requires verifying credentials against columns in the `doctor` catalog table.
2. Authentication creates a clinician session, unlocking the clinical doctor menu links.
3. Incorrect logging attempts fail safely without leaking sensitive database indicators.  
**Priority:** High  
**Story Points:** 5  
**Notes:**
- The login token guarantees clinic GDPR and HIPAA data-access standards.

### Story 12: Doctor Calendar Schedule Viewer
**Title:** Practitioner Daily Workload List  
_As a doctor, I want to view a chronological diary listing all active patients booked to consult with me on any selected calendar date, so that I can organize my day._  
**Acceptance Criteria:**
1. Dashboard loads appointments specific to the doctor's authenticated ID and selected calendar date.
2. Search index filters active date records by partial patient keyword names dynamically.
3. A distinct "Today" shortcut button returns schedule tracking views to the current date instantly.  
**Priority:** High  
**Story Points:** 8  
**Notes:**
- Highly prioritized core scheduling view for practitioners.

### Story 13: Establish Custom Practice Availabilities
**Title:** Maintain Available Hours & Unavailability Markers  
_As a doctor, I want to fine-tune my weekly availability time ranges, so that patients are blocked from booking times during my off-hours._  
**Acceptance Criteria:**
1. Doctors can view a lists of hours matching their registered available times block.
2. Blocked or unselected times must disappear from available patient search selectors.
3. Booking calls on unavailable slots must trigger standard validation failures.  
**Priority:** High  
**Story Points:** 5  
**Notes:**
- Uses JPA `@ElementCollection` in relational schema to connect available hours list to doctor instances.

### Story 14: Modify Clinical Specialty & Bio Details
**Title:** Practitioner Bio & Profile Management  
_As a doctor, I want to modify my public catalog description, including medical specialty, contact details, and location, so that patients get correct details._  
**Acceptance Criteria:**
1. Profile form supports fields to alter phone digits, emails, and specialized medical categories.
2. Updates require JWT verification check and are validated for 10-digit phone and valid email expressions on submit.
3. Saved changes immediately refresh public practitioner lookup cards.  
**Priority:** Low  
**Story Points:** 5  
**Notes:**
- Essential to prevent diagnostic contact details routing errors.

### Story 15: Create Patient Diagnostic Prescriptions
**Title:** Add Document-based Medication Instructions  
_As a doctor, I want to add prescriptions (drugs, dosage, follow-up instructions) for a finished consultation, so that patients can fill medicines and recover._  
**Acceptance Criteria:**
1. The Prescription action loads an editing form referencing the unique clinical `appointmentId`.
2. Prescriptions are written as persistent document models in the MongoDB collection `prescriptions`.
3. Notes are marked as optional but limited to maximum 200 characters string size.  
**Priority:** High  
**Story Points:** 8  
**Notes:**
- Uses flexible MongoDB collection to handle varying medication and dosage combinations seamlessly.

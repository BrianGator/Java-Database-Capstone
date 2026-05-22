# Smart Clinic Management System - Architecture Design Document

## Section 1: Architecture Summary

The Smart Clinic Management System follows a modern, highly decoupled three-tier software architecture designed to handle both server-side rendered HTML views and RESTful web API endpoints. The three layers are:
1. **Presentation Tier**: Relies on Thymeleaf-rendered dynamic templates for administrative and medical staff dashboards, coexisting with vanilla/modular JavaScript and HTML pages for patients, modular schedules, and registration workflows.
2. **Application Tier (Business Logic Layer)**: Built with Spring Boot, this layer exposes MVC Controllers and REST Controllers to coordinate requests. Business rules, validation checks, and data operations are isolated inside a dedicated Service Layer to ensure a strict separation of concerns, transactional stability, and simple maintenance.
3. **Data Tier (Persistence Layer)**: Utilizes a dual-database architecture to leverage the best of both SQL and NoSQL storage paradigms. Relational, transactional information (patients, doctors, appointments, and credentials) is persisted in MySQL via Spring Data JPA. Flexible, variable-schema health data (such as prescription drugs, dosages, and clinician remarks) is managed as JSON/BSON document structures in MongoDB.

## Section 2: Numbered Flow of Data and Control

Below is the structured step-by-step cycle depicting how control and data flow from the client side down to the physical storage engines and back:

1. **Initiate Request**: A user interacts with the user interface by trying to book an appointment on the Patient portal or clicking a button in the Admin/Doctor Thymeleaf dashboard. This client-side event sends an HTTP request (or submits an HTML form) to the backend.
2. **Controller Routing**: The incoming web request lands inside the Spring Boot Controller Layer. Requests aimed at rendering the administration dashboard route to Spring MVC Controllers, while client-side dashboard queries are resolved by specialized REST Controllers mapping JSON objects.
3. **Delegate to Service Layer**: The selected Controller handles request parameters, executes basic format constraints, and delegates execution to the Service Layer. The Service Layer enforces business rules (e.g., verifying that a doctor does not have overlapping appointments or that a patient's requested date lies in the future).
4. **Repository Invocation**: Once business validation passes, the Service Layer queries database repositories. Depending on the targeted model, it invokes either Spring Data JPA repositories (for relational MySQL queries) or Spring Data MongoDB repositories (for flexible document-based prescription records).
5. **Database Execution**: The respective repositories trigger actions on the database tier:
   - **MySQL** reads/writes tables under ACID guarantees for core entities (e.g., patients, doctors, administrative users).
   - **MongoDB** inserts or updates nested documents in collections (e.g., prescriptions containing complex patient instructions).
6. **Model Binding & Mapping**: Retrieved rows or documents are marshalled by database driver abstractions into Java application models:
   - MySQL records are instantiated as JPA `@Entity` instances.
   - MongoDB BSON documents are bound into MongoDB `@Document` objects.
7. **Response Serialization & View Rendering**: The final application models are returned to the controller layer:
   - For Thymeleaf-rendered views, the model is bound to the HTML template context and served as server-rendered HTML.
   - For REST API paths, models (or mapped DTO objects) are serialized into readable JSON payloads and returned via an HTTP response block to the requesting dashboard client.

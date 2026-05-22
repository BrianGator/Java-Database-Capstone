# =========================================================================
# STAGE 1: COMPILATION & PACKAGING (BUILD STAGE)
# =========================================================================
# Utilizing a clean, official Maven image bundled with Eclipse Temurin JDK 17
# to perform the full Java class packaging and syntax checking tasks.
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Set the active, sandboxed working directory inside the build container.
WORKDIR /build

# Copy the complete codebase (including pom.xml, directories, etc.) into the container.
COPY . .

# Compile code, strip redundant files, and package the application into a JAR artifact.
# Skipping unit testing suite execution here to minimize compilation time during deploy.
RUN mvn clean package -DskipTests

# =========================================================================
# STAGE 2: PRODUCTION RUNTIME ENVIRONMENT (SLIM IMAGE STAGE)
# =========================================================================
# Adopting a lightweight JRE runtime environment based on Alpine Linux
# for extreme security hardening and minimal disk resource footprints on host.
FROM eclipse-temurin:17-jre-alpine

# Set the runtime configuration execution folder.
WORKDIR /app

# Safely extract ONLY the compiled production JAR file from the builder phase,
# leaving compilers, source code files, and build cache directories completely behind.
COPY --from=builder /build/app/target/*.jar app.jar

# Document and declare that the internal web application process listens on port 8080.
EXPOSE 8080

# Define the immutable run entrypoint to execute the compiled Spring application.
ENTRYPOINT ["java", "-jar", "app.jar"]


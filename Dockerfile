# Dockerfile for Mini D-Mart Fullstack Deployment (Spring Boot + React SPA)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and source files
COPY pom.xml .
COPY src ./src

# Build production JAR
RUN mvn clean package -DskipTests

# Execution Stage
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/mini-d-mart-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

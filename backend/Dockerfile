# ─── Stage 1: Build JAR with Maven & Eclipse Temurin JDK 21 ───
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven Wrapper & POM
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Pre-fetch Maven dependencies for caching
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and build production jar
COPY src/ src/
RUN ./mvnw clean package -DskipTests

# ─── Stage 2: Minimal Production Runtime Image ───
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy executable jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

ENV PORT=8088
EXPOSE 8088

ENTRYPOINT ["java", "-jar", "-Djava.security.egd=file:/dev/./urandom", "app.jar"]

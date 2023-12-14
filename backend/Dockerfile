FROM maven:3.8.5-openjdk-17 AS build
COPY . .
RUN mvn clean package -Pprod -DskipTests

FROM openjdk:17.0.1-jdk-slim
COPY --from=build /target/discordclonebackend-0.0.1-SNAPSHOT.jar discordclonebackend.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "discordclonebackend.jar"]
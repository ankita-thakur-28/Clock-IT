# Issue 01: Scaffold Spring Boot Backend & User Countdown Engine

Status: resolved

## Description
Scaffold the Spring Boot 3.x backend application and implement the `User` entity, repository, service layer, and REST controller for creating and retrieving milestone profiles with server-computed countdown days and phases.

## Acceptance Criteria
- [x] Maven Spring Boot 3 application setup.
- [x] `User` entity and DTOs created with milestone fields.
- [x] `CountdownService` calculating `daysRemaining` and 4-phase mapping accurately.
- [x] `POST /api/users` and `GET /api/users/{id}` working with validation.
- [x] Unit tests for `CountdownService` verifying boundary cases (e.g. 180d, 90d, 30d, 7d, 0d, past date).

## Comments
- Implemented `Phase`, `User`, `UserRepository`, `CountdownService`, `UserService`, `UserController`, and `HealthController`.
- 10/10 tests pass across `CountdownServiceTest` and `UserControllerTest`.

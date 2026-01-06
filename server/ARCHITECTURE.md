# Server Architecture

## Overview

- Stack: Express + TypeScript + Mongoose.
- Validation: Zod.
- Error handling: central middleware with uniform JSON errors.

## Structure

- `src/app.ts` — express app setup and middleware.
- `src/server.ts` — bootstrapping and DB connection.
- `src/routes/` — route definitions (no DB logic).
- `src/controllers/` — request/response mapping.
- `src/services/` — business logic and DB access.
- `src/models/` — Mongoose schemas and models.
- `src/validation/` — Zod schemas.
- `src/middleware/` — async/error utilities.
- `test/` — Vitest + Supertest integration tests.

## Patterns

- Controllers map Documents -> DTOs (no Mongoose documents leaked).
- Service layer handles queries and update logic.
- Validation on inputs, 400/404/500 error codes.

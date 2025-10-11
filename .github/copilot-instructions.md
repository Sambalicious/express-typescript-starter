# Copilot Instructions for Express TypeScript Starter

## Request/Response & Error Format

- Always follow the current codebase approach for request/response structure and error formatting.
- Responses should include a `message` and, where relevant, a `messageCode`.
- Errors should use the global error handler and return consistent JSON format.

## Formatting & Linting

- Use the project's Prettier and ESLint configuration for all generated code.
- Do not override formatting rules; always match the template's style.
- Use path aliases as configured in `tsconfig.json`.

## Architecture

- Use feature-based modular structure (controllers, routes, models, schemas, tests grouped by feature).
- Centralize middleware and utilities in their respective folders.
- Use Zod for validation and Prisma for database access.
- Always use async/await for asynchronous code.

## Testing

- Use Vitest for all tests.
- Place test files next to the feature they test.
- Use `supertest` for API endpoint tests.
- Use factories for test data generation.

## Error Handling

- Use a global error handler middleware.
- Do not leak internal error details to clients.

## Security

- Enforce secure cookie flags and short JWT expiry.
- Validate and sanitize all user input.

## Documentation

- Generate Swagger docs for all endpoints.

## Naming Conventions

- API routes should use pluralized resource names (e.g., `/profiles`, `/users`).
- Use the current versioning approach (e.g., `/api/v1/...`).
- Use camelCase for all function names.
- prefer using function declaration syntax for named functions (e.g., `function myFunction() {}`).
- Use arrow functions for anonymous functions (e.g., `const myFunc = () => {}`).
- Use descriptive names for variables and functions.
- Use `asyncHandler` for all async route handlers to catch errors.
- Use `.js` extensions in import statements to match the compiled output.
- Use `.ts` extensions in import statements within test files.
- Use `import { Router } from "express";` for route files.

- Use kebab-case for all feature files and folders (e.g., `user-profile.controller.ts`).
- Use camelCase for utility files (e.g., `asyncHandler.ts`).
- Use UPPER_CASE for constants (e.g., `JWT_COOKIE_NAME`).
- Use PascalCase for classes (e.g., `UserProfile`).

## Instructions for Copilot

- When generating code, always match the above conventions.
- If a new feature or file is requested, ask for:
  1. Feature name and purpose
  2. Required endpoints and data models
  3. Any custom validation or business logic
- For changes to architecture, ask for confirmation before applying major refactors.
- For new tests, ask for the expected behavior and edge cases to cover.

---

This file is subject to change as the template evolves. Always follow the latest project configuration and conventions.

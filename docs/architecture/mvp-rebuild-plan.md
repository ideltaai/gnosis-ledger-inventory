# MVP Rebuild Plan

## Phase 0 foundation

- Keep the current repository structure intact and stabilize from the existing root.
- Establish one standalone npm workspace at the repository root.
- Use TypeScript, ESLint, Vitest, Vue/Vite, Zod, and an optional PostgreSQL client.
- Keep legacy WordPress artifacts as reference material only; do not add runtime coupling to them.

## Runtime shape

- `src/api` contains a small Node HTTP API suitable for hardening into the inventory service.
- `src/web` contains the Vue/Vite frontend.
- `src/shared` contains validation and environment utilities shared by API and tests.
- PostgreSQL access is optional and activated only by `DATABASE_URL`.

## Near-term work

1. Replace health and validation examples with inventory domain endpoints.
2. Add migrations once the MVP data model is finalized.
3. Add authentication and role checks before exposing mutable inventory operations.
4. Add CI that runs install, lint, typecheck, tests, build, and the 300-line source guard.

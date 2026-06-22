# MVP Rebuild Plan

## Phase 0 foundation

- Keep the current repository structure intact and stabilize from the existing root.
- Establish one standalone npm workspace at the repository root.
- Use TypeScript, ESLint, Vitest, Vue/Vite, Zod, and PostgreSQL client tooling.
- Keep legacy WordPress artifacts as reference material only; do not add runtime coupling to them.

## Phase 1 persistence foundation

- Add PostgreSQL connection management through `DATABASE_URL`.
- Add migration and seed runners exposed through `npm run db:migrate` and `npm run db:seed`.
- Persist organizations, users, roles, permissions, categories, items, variants, vendors, pricing, locations, bins, barcode mappings, jobs, inventory units, inventory ledger, allocations, reason codes, and audit logs.
- Implement receiving and allocation as transactional services with append-first ledger records and audit metadata.
- Derive availability from persisted inventory units and open allocations rather than process memory.

## Runtime shape

- `src/api` contains the Node HTTP API.
- `src/db` contains PostgreSQL connection, migration, and seed concerns.
- `src/repositories` contains SQL query modules grouped by domain responsibility.
- `src/services` contains transactional workflows and availability calculations.
- `src/web` remains a minimal Vue/Vite status shell until inventory screens are explicitly scoped.

## Near-term work

1. Add authentication and role checks before exposing mutable inventory operations broadly.
2. Add CI that runs install, lint, typecheck, tests, build, migration smoke tests, and the 300-line source guard.
3. Add frontend inventory workflows in a later phase after API contracts stabilize.

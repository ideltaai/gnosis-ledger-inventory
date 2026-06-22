# Gnosis Ledger Inventory

Standalone inventory ledger foundation for a production-ready TypeScript API and Vue/Vite web client.

## Guardrails

- Standalone application: no WordPress runtime, Gnosis Dashboard dependency, portal API/frontend dependency, or other ledger product dependency.
- Integrations are optional and configured through environment variables.
- Hand-authored source files are kept below 300 lines.
- Secrets stay out of git; copy `.env.example` to a local ignored env file when needed.

## Tooling

- TypeScript for API, shared code, and Vue SFC type checking.
- ESLint 9 flat config and Prettier-compatible formatting.
- Vitest with jsdom.
- Zod validation.
- PostgreSQL via `pg`, optional until `DATABASE_URL` is provided.
- Vue 3 and Vite for the web app.

## Commands

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
npm run db:migrate
npm run db:seed
npm run dev:api
npm run dev:web
```

## Local development

1. Install dependencies with `npm install`.
2. Optionally copy `.env.example` to `.env.local` and set `DATABASE_URL`.
3. Start the API with `npm run dev:api`.
4. Start the web client with `npm run dev:web`.
5. Visit the Vite URL and confirm the health card renders.

## API smoke checks

```bash
curl http://localhost:4317/api/health
curl 'http://localhost:4317/api/inventory/availability?itemId=<item-uuid>&binId=<bin-uuid>'
curl -i -X POST http://localhost:4317/api/receiving \
  -H 'content-type: application/json' \
  -d '{"organizationId":"<org-uuid>","itemId":"<item-uuid>","binId":"<bin-uuid>","quantity":10}'
curl -i -X POST http://localhost:4317/api/allocations \
  -H 'content-type: application/json' \
  -d '{"organizationId":"<org-uuid>","itemId":"<item-uuid>","binId":"<bin-uuid>","quantity":4}'
```


## PostgreSQL persistence

Set `DATABASE_URL` before running persistence workflows. Migrations create the inventory schema, and seeds add NuePrint defaults for roles, categories, stock statuses, reason codes, and sample bins.

```bash
DATABASE_URL=postgres://user:pass@localhost:5432/gnosis_ledger_inventory npm run db:migrate
DATABASE_URL=postgres://user:pass@localhost:5432/gnosis_ledger_inventory npm run db:seed
```

Inventory-changing routes write through PostgreSQL transactions:

- `POST /api/receiving` writes an inventory unit, inventory ledger row, and audit log.
- `GET /api/inventory/availability?itemId=<uuid>&binId=<uuid>` derives availability from persisted units and open allocations.
- `POST /api/allocations` reads available inventory, rejects over-allocation, writes allocation and ledger records, and writes audit logs.
- Domain endpoints for categories, items, vendors, locations/bins, barcode mappings, jobs, reason codes, and roll measurements are documented in `docs/api/endpoints.md`.

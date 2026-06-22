# Gnosis Ledger Inventory

Standalone inventory ledger foundation for a production-ready TypeScript API and Vue/Vite web client.

## Guardrails

* Standalone application: no WordPress runtime, Gnosis Dashboard dependency, portal API/frontend dependency, or other ledger product dependency.
* Integrations are optional and configured through environment variables.
* Hand-authored source files are kept below 300 lines.
* Secrets stay out of git; copy `.env.example` to a local ignored env file when needed.

## Tooling

* TypeScript for API, shared code, and Vue SFC type checking.
* ESLint 9 flat config and Prettier-compatible formatting.
* Vitest with jsdom.
* Zod validation.
* PostgreSQL via `pg`.
* Vue 3 and Vite for the web app.

## Commands

Install and validate the project:

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
```

Run database setup after `DATABASE_URL` is configured:

```bash
npm run migrate
npm run seed
```

Start local development servers:

```bash
npm run dev:api
npm run dev:web
```

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` or `.env` if local environment variables are needed.
3. Set `DATABASE_URL` before running persistence workflows.
4. Run migrations with `npm run migrate`.
5. Run seed data with `npm run seed`.
6. Start the API with `npm run dev:api`.
7. Start the web client with `npm run dev:web`.
8. Visit the Vite URL and confirm the health card renders.

## API smoke checks

```bash
curl http://localhost:4317/api/health

curl -i -X POST http://localhost:4317/api/items/validate \
  -H 'content-type: application/json' \
  -d '{"sku":"ABC-001","name":"Sample item"}'

curl -i -X POST http://localhost:4317/api/items/validate \
  -H 'content-type: application/json' \
  -d '{}'
```

## PostgreSQL persistence

Set `DATABASE_URL` before running persistence workflows.

Example:

```bash
DATABASE_URL=postgres://user:pass@localhost:5432/gnosis_ledger_inventory npm run migrate
DATABASE_URL=postgres://user:pass@localhost:5432/gnosis_ledger_inventory npm run seed
```

Migrations create the inventory schema. Seeds add NuePrint defaults for:

* default organization
* roles and permissions
* inventory categories
* stock statuses
* reason codes
* sample vendors
* sample locations and bins
* sample inventory items

Inventory-changing routes write through PostgreSQL transactions:

* `POST /api/receiving` writes an inventory unit, inventory ledger row, and audit log.
* `POST /api/allocations` reads available inventory, rejects over-allocation, writes allocation records, and writes audit logs.

## Development rules

* Do not add WordPress, portal frontend, portal API, Gnosis Dashboard, or other ledger-product dependencies.
* Do not use in-memory arrays for persisted inventory workflows.
* Do not create fake repository methods, stubs, TODO placeholders, or dead routes.
* Keep imports clear and purpose-based.
* Split any hand-authored source file before it exceeds 300 lines.

# PostgreSQL Persistence

## Scope

Phase 1 replaces inventory-changing process state with PostgreSQL-backed repositories and services. The API must be run with `DATABASE_URL` for receiving and allocation endpoints.

## Tables

Migrations create organizations, users, roles, permissions through role permission arrays, categories, items, vendors, item vendor pricing, locations, bins, barcode mappings, inventory units, inventory ledger, allocations, jobs, reason codes, stock statuses, and audit logs.

## Transaction boundaries

- Receiving runs in one transaction and writes inventory units, inventory ledger, and audit logs.
- Allocation runs in one transaction, reads available inventory from persisted units and open allocations, rejects over-allocation, then writes allocations and audit logs.
- Roll-length calculation stays pure; saved roll measurements are persisted as inventory ledger records.

## Seeds

The NuePrint seed creates the default organization, admin/operations/viewer roles, core categories, stock statuses, reason codes, and sample warehouse bins.

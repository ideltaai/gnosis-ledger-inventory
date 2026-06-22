# PostgreSQL Persistence

## Scope

Phase 1 replaces inventory-changing process state with PostgreSQL-backed repositories and services. Receiving and allocation require `DATABASE_URL` because they are durable inventory workflows.

## Tables

Migrations create organizations, users, roles, permissions, role permissions, user roles, categories, items, item variants, vendors, item vendor pricing, locations, bins, barcode mappings, inventory units, inventory ledger, allocations, jobs, reason codes, stock statuses, and audit logs.

## Transaction boundaries

- Receiving runs in one transaction and writes inventory units, inventory ledger, and audit logs.
- Allocation runs in one transaction, reads availability from persisted units and open allocations, rejects over-allocation, then writes allocation, inventory ledger, and audit log records.
- Roll-length calculation stays pure; saved roll measurements are persisted as inventory ledger records.

## Seeds

The NuePrint seed creates the default organization, admin/operations/viewer roles, permissions, print-shop categories, reason codes, sample vendors, sample warehouse bins, sample items, item variants, and vendor pricing.

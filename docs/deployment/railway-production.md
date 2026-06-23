# Railway Production Deployment

This deployment runs Gnosis Inventory as one Railway application service plus one Railway PostgreSQL service. The Node API serves `/api/*` and the built Vue app from `dist/` with SPA fallback for dashboard routes.

## 1. Create Railway services

1. Create a Railway project.
2. Add a PostgreSQL service.
3. Add an app service from the `ideltaai/gnosis-ledger-inventory` GitHub repo.
4. Keep the app service and PostgreSQL service in the same Railway project.

## 2. Configure variables

Set these variables on the app service:

```env
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
AUTH_TOKEN_SECRET=<strong-random-secret>
DEFAULT_ADMIN_EMAIL=admin@nueprint.local
DEFAULT_ADMIN_PASSWORD=<temporary-strong-password>
```

Railway provides `PORT` automatically. Do not hard-code it in production unless Railway support directs you to do so.

## 3. Deploy

Railway should run the normal Node build from `npm run build` and start the production server with:

```bash
npm start
```

The production server binds to `0.0.0.0` and prefers `process.env.PORT`, falling back to `API_PORT`, then `4317`.

## 4. Run database setup

After the first successful deploy, run migrations and seed data from the Railway app service shell or a one-off command:

```bash
npm run migrate
npm run seed
```

The seed creates the default organization, roles, permissions, master data, and the initial admin user.

## 5. Smoke test

Open these URLs from the generated Railway domain:

```bash
curl -i https://<railway-domain>/api/health
curl -i https://<railway-domain>/
curl -i https://<railway-domain>/dashboard
curl -i https://<railway-domain>/settings/users
```

Expected results:

- `/api/health` returns API status and database status.
- `/` returns the Vue app.
- `/dashboard` and `/settings/users` return the Vue app via SPA fallback.
- The login screen is available before authentication.

## 6. First login

1. Log in with `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD`.
2. Immediately change the admin password.
3. Create named users for daily work.
4. Deactivate the default bootstrap admin if it is no longer needed.

## 7. Backups

Before entering real inventory, verify the Railway PostgreSQL backup and restore process for the project. Treat inventory, ledger, audit, and user data as production records once real shop-floor activity begins.

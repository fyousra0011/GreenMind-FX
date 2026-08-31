# GreenMind-FX Backend

This is the NestJS monorepo for GreenMind-FX, an IoT vertical farming platform.

## ADR decisions enforced

- Backend: NestJS (TypeScript)
- Database: PostgreSQL with TimescaleDB for telemetry
- Messaging: MQTT for device communication
- Real-time: Redis + queue workers for event processing
- Multi-tenancy: shared DB with `tenant_id` + `site_id` scoping

## Structure

- `apps/api` — main application
- `apps/api/src/modules/*` — module boundaries
- `libs/common` — shared cross-cutting utilities

## Important architecture rule

Each module enforces tenant and site scoping in the service layer, not only at the controller edge. This is required to avoid cross-tenant leakage in the platform.

## Environment

Install Node.js and npm locally before running the monorepo: `npm install` and then `npm run start:dev`.

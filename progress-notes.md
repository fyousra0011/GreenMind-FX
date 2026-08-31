# GreenMind-FX Progress Notes

## Overview
This document captures the recent progress made for the GreenMind-FX backend architecture and project setup. The goal is to keep track of what has been done, what decisions were made, and what still needs to happen next.

---

## 1) Project direction and architecture decisions
We aligned the GreenMind-FX backend to the decisions from the ADR for this project:

- Backend is NestJS with TypeScript.
- PostgreSQL with TimescaleDB is the database choice for telemetry and time-series sensor data.
- MQTT is the device communication layer.
- Redis and queue workers are planned for real-time event processing.
- Multi-tenancy is based on a shared database model using `tenant_id` and `site_id` scoping.
- We are not using schema-per-tenant or DB-per-tenant architecture at this stage.

This decision keeps the platform lean and startup-friendly while preserving isolation at the data access layer.

---

## 2) Initial backend monorepo setup
We started setting up the backend as a NestJS monorepo under the `backend/` folder while leaving the existing frontend project intact.

### Created structure
- `backend/`
  - `apps/api/`
  - `libs/`
  - root config files such as `package.json`, `tsconfig.json`, `nest-cli.json`, `jest.config.js`, `.eslintrc.js`, and `.prettierrc`

### Why this matters
This gives the project a cleaner production setup from the beginning. The app can grow into multiple services or packages without mixing business logic and shared infrastructure together.

---

## 3) Module boundaries created
We created the main module boundaries based on the planned platform:

- `auth`
- `tenants`
- `sites`
- `devices`
- `telemetry`
- `automation-rules`
- `billing`

These modules match the initial GreenMind-FX product domain and provide a clean place to add business logic, API routes, and future database work.

---

## 4) Multi-tenancy enforcement approach
A major decision was made to enforce tenant and site scoping in the service layer, not only at the controller edge.

### What this means
The platform is structured so that every service method can validate that the requested data belongs to the correct tenant and site combination before returning results or mutating data.

### Example of the intended pattern
A service method should always validate something like:

- tenantId matches the authenticated user / tenant context
- siteId is valid within that tenant
- a device or rule does not belong to a different site or tenant

This is essential for preventing data leakage between customers or locations.

---

## 5) Example tenant-scoped service logic drafted
We created sample service logic to demonstrate the intended behavior. The service methods check that records belong to the current tenant and site scope before returning them.

Examples include:
- site lookup by tenant and site
- device lookup by tenant and site
- automation rule lookup by tenant and site
- telemetry retrieval by tenant and site

This is a starting point and a production-safe pattern to build upon.

---

## 6) Shared app shell and base application layer
We also created the base NestJS application shell:

- `main.ts`
- `app.module.ts`
- `app.controller.ts`
- `app.service.ts`

This gives the API a starting place for bootstrapping, configuration loading, validation, and future endpoints.

---

## 7) Current development status
### Completed
- Project direction clarified around GreenMind-FX architecture
- Backend monorepo scaffold created
- Module boundaries for core platform functions created
- Shared app bootstrapping file structure created
- Shared multi-tenancy design direction documented in code structure

### Not yet completed
- Installing Node/npm locally and running the project
- Creating TypeORM / Prisma database schema
- Integrating PostgreSQL and TimescaleDB config
- Setting up MQTT broker integration
- Setting up Redis and event workers
- Adding real database entities, migrations, and repository patterns
- Adding authentication and authorization logic beyond the initial service stubs
- Creating tests and CI flows


## 8) Notes for viewers
The backend is still in the early architecture stage, but the foundation is consistent with the product direction. The important thing now is to keep the design disciplined and avoid shortcuts around tenant isolation, telemetry handling, and production infrastructure.

The project is moving in the right direction, and the next phase should focus on real backend implementation rather than more UI work.


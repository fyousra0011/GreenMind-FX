# ADR-Final: GreenMind-FX Platform Architecture

Status: Accepted

## Context
GreenMind-FX is a vertical farming platform built around live IoT telemetry, automation, monitoring, and customer operations. The product includes:

- device monitoring for temperature, humidity, water, pH, soil moisture, light, and CO2
- automation rules for irrigation, lighting, and climate controls
- plant health and growth tracking
- multi-site farm management
- customer/account billing and installation workflows
- real-time event processing for telemetry and alerts

The project is being built by a lean, early-stage team with constraints that matter:

- team size: small startup team, likely 3–6 engineers at the start
- budget: constrained startup budget
- timeline: MVP in a short window, with rapid iteration
- expected scale: initially a few dozen to a few hundred farms or deployments, growing into broader multi-site operations over time

The architecture must balance speed, operational simplicity, and compliance. For Malaysia, the relevant legal framework is the Personal Data Protection Act 2010 (PDPA), not just the EU GDPR.

---

## Decision 1: Recommended technology stack

Adopt:

- Frontend: React + TypeScript + Vite + Tailwind
- Backend: NestJS (TypeScript)
- Database: PostgreSQL with TimescaleDB for telemetry
- Messaging: MQTT for device communication
- Real-time event processing: Redis + queue workers
- Multi-tenant data model: shared database with tenant_id and site_id scoping
- Storage: S3-compatible object storage for files, media, and backups
- Authentication: managed auth provider with role-based access control
- Hosting: Vercel for frontend and lightweight stateless endpoints; Railway for persistent IoT telemetry, MQTT, and Redis-backed real-time services

### Why this fits GreenMind-FX

- Startup-friendly: TypeScript across frontend and backend reduces engineering overhead
- Lean team: NestJS provides structure without enterprise bloat
- Budget-conscious: managed services reduce platform operations and DevOps cost
- Real-time IoT fit: MQTT and Redis are better aligned with persistent device data than purely serverless-only setups
- Scale fit: PostgreSQL and TimescaleDB handle relational data and time-series telemetry efficiently
- Compliance-friendly: easier to add auditing, RBAC, retention, and access control with a clean service structure

### Tradeoff
This is not the simplest possible stack, but it is the most realistic for a real-time farming platform. A serverless-only architecture would be cheaper in theory, but it does not fit persistent MQTT connections and long-lived telemetry processing well.

---

## Decision 2: Multi-tenancy model

Choose: shared database with tenant_id + site_id scoping.

### Why this is the right fit

GreenMind-FX is fundamentally a multi-site product with tenant-owned resources such as:

- farms or customer installations
- plant zones and rows
- devices and controllers
- automation rules
- telemetry data
- billing records

The main pattern is:

- one shared Postgres database
- each table includes tenant_id and usually site_id
- service methods enforce access by tenant/site before reading or writing
- cross-tenant queries are blocked by service-level and repository-level safeguards

### Alternatives and tradeoffs

#### Shared DB with tenant_id + site_id
Pros:
- fastest path to MVP
- lowest cost and complexity
- simplest backup and restore process
- easiest for a small team to operate

Cons:
- requires discipline in queries and access control
- shared infrastructure means a bug can affect multiple tenants if isolation is broken

#### Schema-per-tenant
Pros:
- stronger logical isolation
- easier tenant-level data export in some cases

Cons:
- operational overhead increases sharply
- migration complexity rises with tenant count
- poor fit for startup speed and low complexity

#### DB-per-tenant
Pros:
- strongest physical isolation
- easiest to reason about extremely strict isolation

Cons:
- very expensive
- operationally heavy
- not suitable for a small, early-stage vertical farming SaaS

### Decision
Use shared DB + tenant_id + site_id as the default. Only move to stronger isolation if a large enterprise customer or strict compliance requirement makes it necessary.

---

## Decision 3: RTO/RPO targets

For GreenMind-FX, system-critical operations are not hospital-grade, but the platform is still operationally important because crop health depends on timely telemetry and automation.

Recommended targets:

- RPO for telemetry data: 5–15 minutes
- RTO for telemetry platform: 1–2 hours
- RPO for automation rules/configuration: 15 minutes
- RTO for automation / control services: 30–60 minutes
- RPO for business/customer records: 24 hours
- RTO for admin and billing systems: 4–12 hours

Operational practice:

- continuous or frequent database backup for critical operational data
- hourly or near-real-time snapshot strategy for configuration data
- point-in-time recovery for relational records
- quarterly restore drills
- fallback local automation behavior for edge cases where cloud connectivity is interrupted

This is realistic for a startup with real-time device needs but without the operational appetite for extremely expensive, highly redundant infrastructure from day one.

---

## Decision 4: PII and retention policy draft

GreenMind-FX deals with both operational telemetry and customer/user data. Some telemetry is not personal data by itself, but once tied to a user, household, farm address, or device owner it becomes part of a personal data set.

### PII fields to treat as sensitive

- full names
- email addresses
- phone numbers
- home or farm address
- installation photos and site details
- payment contact information
- emergency contact data
- device ownership and site association
- support tickets and messaging records
- login metadata and IP addresses
- health/disability information when collected for farm suitability or support
- any data linked to minors or family households

### Retention draft

- customer account records: retain while active + 3–5 years after closure
- installation/site records: 5 years
- device and maintenance logs: 1–3 years
- raw telemetry: 12–24 months
- aggregated analytics: 2–5 years
- support tickets and messages: 12–24 months
- audit and security logs: 90–180 days
- backup retention: 30–90 days
- payment data: minimal retention, only to the extent needed for finance or legal obligations, with tokenization and no raw card data stored by the app

### Malaysia PDPA alignment

If operating in Malaysia, the core framework is the Personal Data Protection Act 2010 (PDPA). Relevant principles include:

- notice and consent
- purpose limitation
- data minimization
- security safeguards
- access and correction rights
- deletion or anonymization when data is no longer needed
- cross-border transfer controls
- special care where personal data relates to minors or households

This means GreenMind-FX must design for:

- clear consent and notice language
- user access and correction workflows
- deletion requests and retention schedules
- lawful data minimization
- secure storage of secrets and customer data
- separation of identifiable and de-identified analytics data

---

## Decision 5: Secrets management and production environment handling

Use host-injected environment secrets in production rather than plaintext env files.

### Decision

- Local/dev/staging: `.env` files allowed
- Production: environment variables injected by the hosting platform or secret manager
- No real secrets should live in source control
- `NODE_ENV` must be explicitly set and validated at startup
- `DB_SSL` must be required and set to true in production

This is the correct posture for a startup because it is secure, low-cost, and easy to operate.

### Tradeoff

Compared with a full managed vault:
- platform-injected secrets are simpler and cheaper
- vaults are stronger in larger organizations, but add more setup and operational burden

Compared with plaintext repo env files:
- platform injection is far safer
- avoids accidental leaks via git or developer machines
- easier to rotate and audit

---

## Decision 6: Hosting split

Supersedes the earlier Vercel-only assumption in ADR-001.

### Decision

- Frontend: Vercel
- Thin stateless API: Vercel only if needed
- Real-time IoT and telemetry ingestion: Railway
- Redis and queue processing: Railway-managed Redis / queue services
- PostgreSQL + TimescaleDB: managed cloud database

### Why

Vercel is good for frontend and stateless web use, but GreenMind-FX needs persistent MQTT clients and long-lived telemetry processing. Serverless functions do not hold long-lived connections well. A persistent runtime service is required for real-time operations.

### Tradeoff

Vercel-only is simpler at first glance, but it is the wrong fit for persistent MQTT and real-time telemetry workloads. A split hosting model is more operationally complex, but it matches the actual product requirements and is therefore the correct choice for production.

---

## Final outcome
GreenMind-FX should be built as a startup-friendly but production-aware platform:

- modular NestJS backend
- shared DB multi-tenancy with tenant_id + site_id
- TimescaleDB for telemetry and Postgres for relational data
- MQTT + Redis for live device and automation processing
- fail-fast boot validation for missing env variables and insecure production settings
- platform-injected secrets in production
- Vercel for frontend and minimal stateless endpoints
- Railway for the always-on IoT runtime
- clear data retention and PDPA-aligned privacy policies

This architecture is the best fit for GreenMind-FX’s budget, team size, timeline, and expected scale while still being safe and realistic for production operations.

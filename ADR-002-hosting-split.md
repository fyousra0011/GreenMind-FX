# ADR-002: Hosting split for GreenMind-FX

Status: Accepted

Supersedes: ADR-001 (Vercel-only assumption for the API layer)

## Context
The earlier ADR assumed Vercel could host the entire application stack. That was a useful initial simplification, but GreenMind-FX is not a normal stateless web app. It includes:

- real-time IoT telemetry
- persistent MQTT device connections
- Redis pub/sub and queue processing
- long-lived background workers
- device control and automation workflows

These requirements create a mismatch with a purely serverless deployment model. Vercel is excellent for frontend hosting and lightweight stateless API endpoints, but it is not ideal for long-running, always-connected services that must maintain persistent socket sessions.

The platform must support continuous telemetry ingestion from farm devices, and real-time automation decisions based on Redis events and live data streams. That means the architecture needs a persistent runtime layer separate from the frontend hosting layer.

## Decision
Use a hosting split:

- Frontend: Vercel
- Thin stateless API layer: Vercel, if needed for lightweight REST endpoints, but not the primary IoT runtime
- Real-time IoT platform: Railway
- Redis and queue services: Railway managed Redis / managed queue infrastructure
- PostgreSQL and TimescaleDB: managed database service, preferably a cloud-managed Postgres instance with TimescaleDB enabled
- MQTT broker and telemetry ingestion service: Railway or a dedicated container-based deployment on Railway/Fly.io, with a persistent process model

We choose Railway for the long-lived runtime services because it is a good fit for a small team building a real-time app without heavy DevOps overhead.

Why Railway:
- simpler than managing raw containers on AWS/GCP at startup stage
- supports persistent services and real-time workloads better than a purely serverless deployment
- easier to operate than a fully custom container platform
- suitable for early-stage startups that need to move quickly
- keeps the technical burden lower than building and maintaining an AWS/GCP cluster from day one

## Reasoning
The main issue is not just API hosting. The critical problem is ongoing device connectivity.

GreenMind-FX needs:

- device telemetry arriving continuously
- MQTT persistent client connections
- Redis pub/sub listeners
- event workers for automations
- real-time monitoring and alerts

These are not ideal workloads for a serverless-only deployment model. Serverless functions are usually short-lived and stateless. They are good at request/response flows, but not for maintaining a socket connection that must stay open for months.

The architecture should therefore separate concerns:

1. Frontend experience and generic user flows: Vercel
2. Real-time IoT ingestion and stream processing: persistent service on Railway
3. Data storage and analytics: PostgreSQL + TimescaleDB
4. Messaging and decoupling: Redis + queue workers

This separation reduces architectural mismatch and keeps operational complexity manageable.

## Tradeoffs

### Option A: Vercel only for everything
Pros:
- easiest deployment model
- very low ops cost
- fast prototyping
- good for frontend and simple stateless APIs

Cons:
- weak fit for persistent MQTT clients
- poor fit for long-lived socket-based telemetry streams
- poor fit for Redis pub/sub consumers that must remain alive
- can create hidden production issues when engineers assume serverless is equivalent to always-on infrastructure

### Option B: Split hosting with Vercel + Railway
Pros:
- most practical balance for a small team
- good fit for real-time ingest and persistent services
- keeps frontend fast and simple
- reduces complexity versus AWS/GCP-first architecture
- suitable for startup tempo

Cons:
- requires managing multiple deployment targets
- adds operational coordination between frontend and backend services
- some cost and monitoring complexity from a multi-service topology

### Option C: Full AWS/GCP container or VM setup
Pros:
- maximum control
- highly flexible
- strong production maturity and customizability

Cons:
- much higher setup complexity
- more DevOps burden
- slower startup execution for a lean team
- not necessary for the initial GreenMind-FX scale if the goal is to get product traction first

## Consequences
This hosting split creates an architecture that matches the product reality:

- Vercel handles the web experience and lightweight UI/API use cases
- Railway hosts the persistent runtime for device ingestion and real-time flows
- Redis and queue infrastructure remain dedicated to event-driven behavior
- Postgres/TimescaleDB remains the durable system of record

This is the right decision for GreenMind-FX as an IoT platform, and it supersedes the Vercel-only assumption in ADR-001.

## Final note
This is a product-first architecture decision, not a purely cost-driven one. The real constraint is the nature of the workload: real-time farming telemetry and persistent device communication require persistent service runtime, not just stateless serverless endpoints.

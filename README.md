# Nómada Fantasma

<p align="center">
  <strong>A bilingual discovery and booking operations platform for Lake Atitlán, Guatemala.</strong>
</p>

<p align="center">
  <a href="https://nomadafantasma.com/es">Live website</a> ·
  <a href="https://nomadafantasma.com/es/rutas-magicas">Explore experiences</a> ·
  <a href="https://nomadafantasma.com/en">English version</a>
</p>

![Lake Atitlán experience](public/images/rutas/atitlan.jpg)

## Product overview

Nómada Fantasma helps travelers discover local experiences around Lake Atitlán and turn that interest into structured booking requests.

The product connects two sides of the same workflow:

- A bilingual public experience for exploring towns, tours, guides, and transportation.
- An internal reception system for reviewing requests, coordinating next steps, and tracking operational status.

The goal is not only to present attractive travel content. It is to make discovery, booking intake, and day-to-day coordination clearer and more reliable.

## What the product solves

### For travelers

- Discover towns and experiences with local context.
- Compare tours, guides, and shuttle options.
- Navigate the platform in Spanish or English.
- Submit structured requests with clear next steps.
- Use responsive booking flows on mobile and desktop.

### For operations

- Receive booking requests in a consistent format.
- Review tours, shuttles, guides, and accommodation requests from an internal workspace.
- Track request, payment, and communication status.
- Preserve operational context when catalog information changes.
- Coordinate transactional emails and provider notifications.

## Core product surfaces

| Surface | Purpose |
|---|---|
| Town and route discovery | Introduces Lake Atitlán destinations, context, and nearby experiences |
| Tours and guides | Presents bookable experiences and structured reservation flows |
| Shuttle booking | Captures route, schedule, agency, passenger, and contact information |
| Interactive maps | Helps travelers understand destinations geographically |
| Bilingual experience | Maintains Spanish and English routes and interface content |
| Internal reception | Centralizes operational requests and status management |
| Notifications | Supports transactional communication with travelers and operators |

## Engineering highlights

- Next.js App Router with server and client components.
- Spanish and English routing through next-intl.
- Supabase Postgres, Auth, Row Level Security, and versioned migrations.
- Server-side validation for reservation and shuttle requests.
- Database-backed pricing and operational data instead of trusting browser input.
- Transactional email templates with Resend and React Email.
- Internal authentication and reception workflows.
- Rate limiting for public request endpoints.
- Automated TypeScript, lint, test, and build checks.

## Architecture

~~~text
Traveler
   |
   v
Bilingual Next.js experience
   |
   +--> Towns, tours, guides, maps, and shuttles
   |
   +--> Reservation and shuttle APIs
                |
                v
       Validation and business rules
                |
                v
      Supabase Postgres and Auth
                |
        +-------+--------+
        |                |
        v                v
Internal reception   Email notifications
~~~

The application follows a modular monolith approach: public pages, request APIs, operational workflows, and external integrations live in one deployable product while domain responsibilities remain separated.

## Technology

| Area | Technologies |
|---|---|
| Application | Next.js 16, React 19, TypeScript |
| Interface | Tailwind CSS, Framer Motion, Leaflet |
| Internationalization | next-intl |
| Data and authentication | Supabase, PostgreSQL, Auth, RLS |
| Communication | Resend, React Email |
| Validation | Zod |
| Testing and delivery | Vitest, GitHub Actions, Vercel |

## Quality and reliability

The project is designed around a few practical rules:

- Prices and important booking rules are resolved on the server.
- Spanish and English content must remain aligned.
- Public flows include explicit loading, success, and error states.
- Sensitive credentials stay server-side.
- Booking and shuttle logic is covered by automated tests.
- Changes are checked with TypeScript, ESLint, tests, and production builds.

## Local development

### Requirements

- Node.js compatible with Next.js 16
- pnpm 10
- A Supabase project or local Supabase environment

### Setup

~~~bash
git clone https://github.com/pascal1010100/nomada-fantasma.git
cd nomada-fantasma
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
~~~

Open http://localhost:3000/es.

### Verification

~~~bash
pnpm typecheck
pnpm lint
pnpm test -- --run
pnpm build
~~~

## Project status

Nómada Fantasma is an active product. The public travel experience and the internal operational system evolve incrementally so new features do not compromise existing booking workflows.

## Author

Built and maintained by [José Manuel Aguilar](https://github.com/pascal1010100).

[Portfolio](https://portafolio1010100.vercel.app/) ·
[LinkedIn](https://www.linkedin.com/in/josema-aguilar-dev/) ·
[Email](mailto:josemanu0885@gmail.com)

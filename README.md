# Trackmania with Friends 🏎️

Plan multiplayer sessions in **Trackmania** — look up maps, check leaderboards, and see who in your group has played what.

## Features

- **Have we played this?** — Enter a map ID and your group of players to see each person's best time, rank, and when they last played it.
- **Map lookup** — Search by map ID to view name, author, and thumbnail from the official Nadeo API.
- **Map finder** — Discover random maps from Trackmania Exchange to queue up next.
- **Group management** — Save and edit your regular playgroup (stored locally in the browser).

## How it works

The app talks to three APIs:

- **Nadeo Server API** (`nadeo-server-client.ts`) — official Ubisoft endpoint for maps, map records, and leaderboards.
- **Nadeo OAuth API** (`nadeo-oauth-client.ts`) — obtains and refreshes server tokens using `ENCODED_CREDENTIALS`.
- **Trackmania Exchange API** (`mania-exchange-client.ts`) — community-driven map database for random map discovery.

## Tech stack

| Category | Libraries |
|---|---|
| **Framework** | Next.js 16, React 19, TypeScript |
| **Data fetching** | TanStack React Query, axios |
| **Validation** | Zod, @t3-oss/env-nextjs |
| **Styling** | Tailwind CSS, class-variance-authority, tailwind-merge |
| **UI** | Radix UI primitives, lucide-react, sonner (toasts), next-themes |
| **Dev tooling** | ESLint (next/core-web-vitals), PostCSS |

## Infrastructure (IaC)

The project uses **OpenTofu** (the open-source Terraform fork) to manage infrastructure on **Google Cloud Run**.

```
iac/
├── main.tf          — Cloud Run v2 service definition
├── variables.tf     — Project, region, image, secrets
└── outputs.tf       — Service URI
```

### CI/CD pipeline (GitHub Actions)

A fully automated pipeline runs on every push:

1. **Lint** — `npm run lint`
2. **Validate IaC** — `tofu fmt -check && tofu validate`
3. **Build & push** — Docker image to Docker Hub (`garridoy/tm-with-friends`)
4. **Deploy** — OpenTofu apply to Cloud Run (main branch only)

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires environment variables (`CLIENT_ID`, `CLIENT_SECRET`, `ENCODED_CREDENTIALS`) for Nadeo API authentication.

## License

MIT

# dashboard-ui

The web dashboard of [Telark](https://github.com/telark/telark), a protection gate for your Kubernetes applications. It is where operators see their applications, run protection plans, read Insights and manage access.

This repository holds the single-page app only. It has no backend of its own: it calls the Telark services, which ship with the Telark Helm chart. To run Telark, follow the [getting started guide](https://github.com/telark/telark/blob/main/docs/getting-started.md).

## What is in the dashboard

| Area | What operators do there |
|---|---|
| Applications | Browse discovered applications and their workloads, the plans that cover them, change history and rollback, and Insights for each app |
| Protection plans | Create, schedule, approve, cancel and reactivate plans; see health, violations and reports |
| Insights | Incident cards and setup recommendations, updated live |
| Access & permissions | Users, groups, access roles and categories (environments and tags) |
| Settings | Profile, appearance, security, identity provider (Google SSO) and the local AI runtime |

Every action is gated by the signed-in user's permissions, deny rules included; the backend enforces the same checks.

Stack: React 19, TypeScript 6, Vite 8, Redux Toolkit, Ant Design 6.

## How it talks to Telark

The dashboard never reaches Kubernetes, Redis or NATS. It calls four Telark services over HTTP:

| Service | Used for |
|---|---|
| `auth` | Passkey and Google sign-in, sessions, permissions |
| `discovery` | Applications, workloads, protection-plan actions, Insights reads |
| `exporter` | Stored resources, snapshots and rollback history, notifications, categories, reports |
| `analyzer` | Analyze, live Insights events, AI runtime status and model install |

```mermaid
flowchart LR
  Browser(["Operator's browser"]) -->|loads SPA| UI["dashboard-ui\n(this repo)"]

  UI -->|passkey / Google OIDC login,\nsessions, roles| AUTH(auth)
  UI -->|apps, workloads,\nprotection plans| DISC(discovery)
  UI -->|snapshots, rollback,\nnotifications feed| EXP(exporter)
  UI -->|analyze, live events,\nruntime| ANL(analyzer)

  DISC -.->|publish events| NATS[(NATS)] -.-> NTF(notifier) -.->|persist CR| EXP

  classDef svc fill:#eef2ff,stroke:#6366f1,color:#312e81;
  classDef peer fill:#f1f5f9,stroke:#94a3b8,color:#334155;
  class AUTH,DISC,EXP,ANL,NTF svc;
  class Browser,UI peer;
```

In a cluster build (`vite build --mode cluster`) the app calls `/api/<service>/api/v1/...` on its own origin, and the bundled nginx proxies those paths to the services. In local development it calls `http://localhost:<port>` directly (exporter `8002`, discovery `8004`, auth `8006`, analyzer `8007`, see `src/constants/rest/urls.ts`). All API paths live in `src/constants/rest/paths.ts` and `endpoints.ts`.

## Develop

Run the Telark services (or port-forward them to the ports above), then:

```sh
npm install
npm run dev          # http://localhost:3000
npm run check-all    # type-check and lint: run before every PR
```

| Script | Purpose |
|---|---|
| `npm run build` | Production build |
| `npm run build:cluster` | In-cluster build, used by the Dockerfile |
| `npm run build:analyze` | Build with a bundle-size report |
| `npm run serve` | Preview a build |
| `npm run lint:f`, `npm run format` | Autofix lint, format |
| `npm run check-all-and-build` | What the release pipeline runs |

Conventions, enforced by `eslint.config.mjs`:

- No `console.*` outside `src/logging/**`; use the project logger.
- Constants live in `src/constants/**` or a feature's `constants/` folder, not inline.
- Colours come only from `DEFAULT_COLORS` in `src/constants/shared/colors.ts`; colour literals elsewhere fail lint.
- No new `any`.

This repository has no CI of its own. Before a PR, run `npm run check-all`, `npm run build`, and exercise the change against real services.

## Build and release

Images and charts are built from the Telark repository, not here: [`build-ui.yaml`](https://github.com/telark/telark/blob/main/.github/workflows/build-ui.yaml) checks out this repo, runs `npm run check-all-and-build`, builds the image from this [`Dockerfile`](./Dockerfile) and signs it; [`release-charts.yaml`](https://github.com/telark/telark/blob/main/.github/workflows/release-charts.yaml) publishes the chart. See [publishing](https://github.com/telark/telark/blob/main/docs/PUBLISHING.md).

The image serves the app with nginx on port 8080. It sets a Content-Security-Policy and the usual security headers, strips `X-Service-Token`, `X-User-ID`, `X-Username` and `X-Email` from browser requests, and answers 404 for `/api/<service>/api/v1/internal/...`. Add `Strict-Transport-Security` where TLS terminates (ingress or load balancer).

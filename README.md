# dashboard-uissss

The web dashboard of [Telark](https://github.com/telark/telark), a protection gate for your Kubernetes applications. It is where operators see their applications, run protection plans, read Insights, and manage access.

This repository contains the single-page application only. It has no backend of its own: it calls the Telark services, which ship with the Telark Helm chart. To run Telark, follow the [getting started guide](https://github.com/telark/telark/blob/main/docs/getting-started.md).

## What is in the dashboard

| Area | What operators do there |
|---|---|
| Applications | Browse discovered applications and their workloads, the plans that cover them, change history and rollback, and Insights for each app |
| Protection plans | Create, schedule, approve, cancel, and reactivate plans; see health, violations, and reports |
| Insights | Incident cards and setup recommendations, updated live |
| Access & permissions | Users, groups, access roles, and categories such as environments and tags |
| Settings | Profile, appearance, security, identity provider (Google SSO), and the local AI runtime |

Every action is gated by the signed-in user's permissions, including deny rules; the backend enforces the same checks.

**Stack:** React 19, TypeScript 6, Vite 8, Redux Toolkit, Ant Design 6.

## How it talks to Telark

The dashboard does not communicate directly with Kubernetes, Redis, or NATS. It calls four Telark services over HTTP:

| Service | Used for |
|---|---|
| `auth` | Passkey and Google sign-in, sessions, and permissions |
| `discovery` | Applications, workloads, protection-plan actions, and Insights reads |
| `exporter` | Stored resources, snapshots, rollback history, notifications, categories, and reports |
| `analyzer` | Analysis, live Insights events, AI runtime status, and model installation |

```mermaid
flowchart LR

  Browser(["Operator's browser"]) -->|loads SPA| UI["dashboard-ui<br/>(this repo)"]

  UI -->|passkey / Google OIDC login,<br/>sessions, roles| AUTH(auth)

  UI -->|apps, workloads,<br/>protection plans| DISC(discovery)

  UI -->|snapshots, rollback,<br/>notifications feed| EXP(exporter)

  UI -->|analyze, live events,<br/>runtime| ANL(analyzer)

  DISC -.->|publish events| NATS[(NATS)] -.-> NTF(notifier) -.->|persist CR| EXP

  classDef svc fill:#eef2ff,stroke:#6366f1,color:#312e81;
  classDef peer fill:#f1f5f9,stroke:#94a3b8,color:#334155;

  class AUTH,DISC,EXP,ANL,NTF svc;
  class Browser,UI peer;
````

In a cluster build (`vite build --mode cluster`), the app calls `/api/<service>/api/v1/...` on its own origin, and the bundled nginx proxies those paths to the services.

In local development, it calls `http://localhost:<port>` directly:

| Service     |   Port |
| ----------- | -----: |
| `exporter`  | `8002` |
| `discovery` | `8004` |
| `auth`      | `8006` |
| `analyzer`  | `8007` |

See `src/constants/rest/urls.ts` for the configured service URLs.

## Develop

The dashboard depends on the Telark backend services. For local development, the recommended setup is to run Telark locally and use the existing port-forwarding script:

```sh
./scripts/local-port-forward.sh
```

The script is located in the [Telark repository](https://github.com/telark/telark/blob/main/scripts/local-port-forward.sh) and forwards the required services to the ports expected by the dashboard.

After the port forwards are active:

```sh
npm install
npm run dev          # http://localhost:3000
npm run check-all    # type-check and lint; run before every PR
```

The dashboard uses these local service endpoints when running in development mode. See `src/constants/rest/urls.ts` for the configured URLs.

| Script                        | Purpose                                       |
| ----------------------------- | --------------------------------------------- |
| `npm run build`               | Production build                              |
| `npm run build:cluster`       | In-cluster build used by the Docker image     |
| `npm run build:analyze`       | Build with a bundle-size report               |
| `npm run serve`               | Preview a build                               |
| `npm run lint:f`              | Autofix lint issues                           |
| `npm run format`              | Format the codebase                           |
| `npm run check-all`           | Type-check and lint                           |
| `npm run check-all-and-build` | Full validation used by the UI build pipeline |

### Code conventions

The following conventions are enforced by `eslint.config.mjs`:

* No `console.*` outside `src/logging/**`; use the project logger.
* Constants belong in `src/constants/**` or a feature's `constants/` folder, not inline.
* Colours come only from `DEFAULT_COLORS` in `src/constants/shared/colors.ts`; colour literals elsewhere fail lint.
* No new `any` types.

## Build & Release

**Image builds and Helm chart releases are not managed in this repository.** They are owned by the [Telark](https://github.com/telark/telark) repository.

* [`telark/.github/workflows/build-ui.yaml`](https://github.com/telark/telark/blob/main/.github/workflows/build-ui.yaml) ("Build · UI Image") checks out this repository at a selected branch (default `main`), runs the `gate-ui` job (`npm run check-all-and-build`), then builds and pushes the image from this repository's [`Dockerfile`](./Dockerfile). The Dockerfile uses a `node:26-alpine3.24` build stage and an nginx serving stage. The workflow also handles versioning and cosign signing.

* [`telark/.github/workflows/release-charts.yaml`](https://github.com/telark/telark/blob/main/.github/workflows/release-charts.yaml) ("Release · Publish Charts") packages, pushes, and signs the `telark` and `telark-crds` Helm charts to `oci://ghcr.io/telark/charts`.

* [`telark/docs/PUBLISHING.md`](https://github.com/telark/telark/blob/main/docs/PUBLISHING.md) documents the manual publish path for testing a chart or image release.

This repository's [`Dockerfile`](./Dockerfile) only defines how the UI image is built; it is invoked by the Telark workflow above, not by CI configured in this repository.

## Branching

**Branching**: `<type>/<kebab-case-description>`

Use the following conventional branch types:

* `feat/` — new functionality
* `fix/` — bug fixes
* `refactor/` — code restructuring without changing behavior
* `perf/` — performance improvements
* `docs/` — documentation-only changes
* `test/` — adding or updating tests
* `build/` — build system or dependency changes
* `ci/` — CI/CD workflow changes
* `chore/` — maintenance and tooling
* `hotfix/` — urgent production fixes
* `release/` — release preparation

Examples:

`feat/add-auth-layer-using-webauthn`
`fix/apps-and-plans-sync`
`refactor/restructure-feature-modules`
`perf/optimize-app-discovery`
`docs/update-branching-guidelines`
`test/add-protection-plan-tests`
`build/update-typescript`
`ci/harden-github-actions`
`chore/update-dependencies`
`hotfix/fix-snapshot-cleanup`
`release/0.1.0`

Branch names should be:

* lowercase
* descriptive and concise
* prefixed with one of the approved types
* written using `kebab-case`

The canonical format is:

`<type>/<description>`

## Commits

**Commits**: follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

`<type>(<optional-scope>): <description>`

Use these commit types:

* `feat:` — new UI functionality
* `fix:` — UI bug fixes
* `refactor:` — UI code restructuring without changing behavior
* `perf:` — UI performance improvements
* `docs:` — documentation-only changes
* `test:` — adding or updating UI tests
* `build:` — build system or dependency changes
* `ci:` — CI/CD changes
* `chore:` — maintenance and tooling changes
* `revert:` — revert a previous commit

Common UI scopes include:

`auth`, `apps`, `plans`, `insights`, `components`, `layout`, `navigation`, `theme`, `api`, `deps`, `config`

Examples:

`feat(auth): add WebAuthn authentication`
`feat(plans): add protection plan approval flow`
`fix(apps): prevent multiple loaders from being displayed`
`refactor(components): restructure reusable application components`
`perf(apps): optimize application list rendering`
`build(deps): update TypeScript`
`chore(theme): centralize UI colors`

Commit descriptions should be:

* concise
* written in the imperative mood
* lowercase after the prefix
* free of unnecessary punctuation
* focused on one logical change

Breaking changes must use `!` after the type or scope:

`feat(api)!: change dashboard API response handling`

or include a `BREAKING CHANGE:` footer in the commit body.

A release tool may map `feat:` commits to a minor version bump, `fix:` commits to a patch version bump, and breaking changes to a major version bump.

Do not use non-standard tags such as `[Major]` or `[Minor]`. Use Conventional Commit types, scopes, and breaking-change notation instead.

## PR checklist

This repository has no `.github/workflows` of its own, so there is no automatic per-PR CI. The only automated check that touches this code is the `gate-ui` job in Telark's [`build-ui.yaml`](https://github.com/telark/telark/blob/main/.github/workflows/build-ui.yaml) workflow.

When a UI image is built, it checks out this repository and runs `npm ci` followed by `npm run check-all-and-build`. Because this check runs only on demand, run the checks locally before opening a PR:

* [ ] `npm run check-all` passes (type-check + lint)
* [ ] `npm run build` succeeds
* [ ] The change has been manually exercised against the relevant backend services
* [ ] No new `any` types
* [ ] No new `console.*` statements
* [ ] No new inline literals that belong in `constants/`

## Security

The production image applies browser security headers through `nginx/nginx.conf`, including:

* `Content-Security-Policy`
* `X-Frame-Options`
* `X-Content-Type-Options`
* `Referrer-Policy`
* `Permissions-Policy`

The nginx configuration also strips browser-supplied service identity headers before proxying to backend services and returns `404` for `/api/<service>/api/v1/internal/...` paths so internal service routes are not exposed through the browser.

nginx serves plain HTTP on port `8080`, so `Strict-Transport-Security` is not configured here. HSTS should be added where TLS terminates, such as the ingress or load balancer.

## Production documentation

Installation, sizing, architecture, and verification for the complete Telark system live in the `telark` repository, not here:

* [`telark/docs/INSTALL.md`](https://github.com/telark/telark/blob/main/docs/INSTALL.md) — prerequisites, install-time flags, sizing modes, and verification steps
* [`telark/docs/architecture.md`](https://github.com/telark/telark/blob/main/docs/architecture.md) — system architecture, service responsibilities, and data flow
* [`telark/docs/CRDS.md`](https://github.com/telark/telark/blob/main/docs/CRDS.md) — CRD groups and kinds exposed by the backend services
* [`telark/docs/adr/`](https://github.com/telark/telark/tree/main/docs/adr/) — architecture decision records

## Contributing, security and license

See [`CONTRIBUTING.md`](./CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md), and [`GOVERNANCE.md`](./GOVERNANCE.md).

Report vulnerabilities privately as described in [`SECURITY.md`](./SECURITY.md).

This repository is source-available under the [Elastic License 2.0](./LICENSE.md), like the rest of Telark.

# PLAN.md — k6 functional + performance suite for the telark dashboard

> Phase 1 deliverable. Approved before Phase 2 implementation.

## A. Codebase analysis

### UI side (`Desktop/dashboard-ui/`)

- HTTP layer: `src/api/client/instances.ts` exports **four** axios instances — `exporterApiClient`, `discoveryApiClient`, `authApiClient`, `enrichmentApiClient`. (The task said "three backend services" — the UI in fact talks to a 4th, `enrichment-service`, see §G.)
- Every endpoint string is centralized in `src/constants/rest/paths.ts` + `endpoints.ts`. Every feature client uses `Client(<instance>, Endpoints.X.Y.path, …)`. There are no scattered URL literals.
- Auth-token interceptor: `createSessionTokenInterceptor()` attaches `X-Session-Token` to every `authApiClient` request. Other instances inherit the same via a shared store.
- Per-service health interceptor with circuit-breaker — k6 traffic that fails repeatedly will trip it; need to keep VU counts low so we don't accidentally suppress further requests mid-scenario.
- Polling sequence: `POLLING_DELAYS.SEQUENCE = [2,4,8,12,20,30]s` — used by force-sync and plan-status pages. k6 scenarios polling those flows should mimic this cadence, not hammer.

#### UI → axios-instance routing (full catalog)

| Domain | Read goes to | Write/mutation goes to |
|---|---|---|
| Auth — login/register/logout/oidc/passkeys/permissions/config | `authApiClient` | `authApiClient` |
| Sessions list/details/delete | `exporterApiClient` | `exporterApiClient` |
| Users / Groups / Roles / Categories | `exporterApiClient` | Create/Patch → `exporterApiClient`; **Delete → `authApiClient`** (async cleanup that adds finalizers, then auth-service kicks the cascading delete chain) |
| Applications list/details/snapshots/rollbacks (list) | `exporterApiClient` | Update → `exporterApiClient`; **Delete/Sync/TriggerRollback → `discoveryApiClient`** |
| Protection plans — list/get-by-id | `exporterApiClient` | **Templates/Status/Violations/Prepare/Cancel/Clear/Update/Duplicate/Reactivate → `discoveryApiClient`**, which writes through to exporter via REST |
| Notifications | `exporterApiClient` | `exporterApiClient` |
| Globalconfig get/patch | `exporterApiClient` | `exporterApiClient` |
| Snapshots get / manifest / infos | `exporterApiClient` | n/a |
| Namespaces (analyze) | `discoveryApiClient` | n/a |
| Validate AI provider key | `enrichmentApiClient` | n/a |

#### Notable UI-side behaviors

- `fetchPlanViolations` overrides the global 30s axios timeout to `10_000` ms.
- `triggerApplicationSync` uses `SYNC_CONSTANTS.APPLICATION_FORCE_SYNC_TIMEOUT_MS` (separate constant).
- `getApplicationSnapshotSummaries` fan-outs one GET per snapshot generation via `Promise.allSettled` — this is the single biggest UI client-side cost.

### Backend services

#### `auth-service` (Go, port 8080)
Routes from `routes/routes.go`:
- `POST auth/login/start|finish`, `POST auth/logout`, `POST auth/register/start`
- `POST auth/oidc/google/callback|nonce`
- `GET auth/config` (public bootstrap), `GET auth/permissions`
- Passkey CRUD via proxy (5 routes), all forward to exporter's internal passkey store
- `DELETE auth/users/{id}/cleanup`, `DELETE auth/groups/{id}/cleanup`, `DELETE auth/roles/{id}/cleanup`
- Status: `/api/v1/status/{health,ready,live}`

Login is **WebAuthn passkey** (`go-webauthn` lib). LoginStart returns `CredentialAssertion` options; LoginFinish requires a signed assertion from a real authenticator. **k6 cannot perform WebAuthn**.

#### `discovery-service` (Go, port 8080, 2 replicas)
Routes from `routes/routes.go`:
- Analyze: `GET analyze/namespaces/get`, `analyze/workloads/...`, `analyze/resources/...`
- Applications: `GET enrich`, `POST trigger-rollback`, **`POST sync`** (async via Redis Stream `forcesync:queue`, group `forcesync-workers`, 4 workers × 2 replicas, 300s job timeout), `DELETE cleanup`
- Protection plans: templates / prepare / cancel / clear / status / violations / duplicate / reactivate / update
- Status liveness/readiness

Discovery is the **write-side API for plans/apps**; it writes through to exporter via `internal/rest/clients/plans/protection` (30s timeout). Force-sync handler enqueues onto Redis Stream, returns **`202 Accepted`** with `jobId`. Status is observed via the read side later.

Dependencies: NATS (for service events), Redis (for force-sync queue + plan tick coordination), Kubernetes API (LIST QPS 100, burst 200).

#### `exporter-service` (Go, port 8080, 1 replica)
Routes from `routes/base.go`:
- Applications, GlobalConfig, Users, Groups, Roles, Categories, Sessions, Passkeys (internal), Snapshots, Notifications, Protection Plans (list/get), Status, Cleanup (finalizer add/remove)

Exporter is the **read source of truth** and the **CRD writer**. It serves cached LISTs (`performance.NewCachedListHandlerFunc`) backed by Kubernetes informers. PUT/PATCH/POST flow through `concurrency.GetLock(plan.ID)` per-resource locks, then `generics.GenericCreateCustomResource` writes the CRD to the cluster.

Snapshots are stored on a PVC mounted at `/snapshots`. Snapshot reads can fan-out per generation.

#### `enrichment-service` (Python — discovered, not in original "three backends" list)
- `api_server.py`, `enricher.py`, `providers/` (Groq default). UI hits it for **AI provider key validation** in the Insights/Governance settings page.

### Deployment topology (`release-manager/helm/app`)

- All services run as `ClusterIP` on port 8080. `replicas: exporter=1, discovery=2, enrichment=1, auth=1, ui=…`.
- **There is no separate Ingress yaml in `release-manager`**. Public access is via the **UI pod's nginx**, which reverse-proxies:
  - `/api/exporter/ → http://telark-exporter-service:8080/`
  - `/api/discovery/ → http://telark-discovery-service:8080/`
  - `/api/auth/ → http://telark-auth-service:8080/`
  - `/api/enrichment/ → http://telark-enrichment-service:8080/`
  - `proxy_read_timeout 60s` and `proxy_send_timeout 60s` (so any UI-facing request taking > 60s will be cut by nginx — relevant for plan prepare/force-sync).
- Health probes: `/api/v1/status/{live,ready}` on each service, 15s period, 15s timeout, threshold 3.
- Discovery env (relevant to perf): K8s QPS 100 / burst 200, informer resync 600s ± 20% jitter, snapshot fetch deadline 5s, force-sync workers 4, job timeout 300s, coordination lock TTL 120s.
- Exporter env: K8s QPS 50 / burst 100, snapshot PVC 1Gi.

→ **k6 must target the UI pod's hostname.** The base URL is one origin (`https://<dashboard-host>`), and the suite walks `/api/<svc>/api/v1/...` paths from there — exactly as the UI does.

## B. Service relationship & end-to-end flow analysis

### B.1 Service relationship map

| Service | Consumes | Consumed by |
|---|---|---|
| `auth-service` | `exporter-service` (passkey storage REST), external Google OIDC JWKS, `webauthn` external relying-party metadata | UI nginx (`/api/auth/*`) |
| `discovery-service` | `exporter-service` (REST, via `internal/rest/clients/*` — plans/apps/notifications), Redis (force-sync streams, lock coordination, plan tick), NATS (event bus), Kubernetes API (LIST/WATCH/PATCH) | UI nginx (`/api/discovery/*`) |
| `exporter-service` | Kubernetes API (CRD CRUD), local PVC (`/snapshots`) | UI nginx (`/api/exporter/*`), `discovery-service`, `auth-service` (passkey proxy), `notifier-service` (notifications emit) |
| `enrichment-service` | External AI providers (Groq/Anthropic/Gemini), Redis | UI nginx (`/api/enrichment/*`), `discovery-service` (probable, see §G) |

Failure-propagation modes that matter for k6 interpretation:
- Exporter unreachable → discovery plan/app writes return 5xx after 30s timeout.
- Redis down → force-sync `503` (writes `retryAfterSec`), plan tick paused.
- Auth-service down → all authenticated UI calls fail at the session-token interceptor (UI's circuit breaker trips).
- Discovery down → app sync 503, plan operations 5xx; reads still served by exporter.

### B.2 End-to-end flow diagrams (prose)

**F1 — Page bootstrap.** Browser loads `/` → UI fetches `GET /api/auth/api/v1/auth/config` (public, exporter not consulted) → if logged in, `GET /api/auth/api/v1/auth/permissions` → `GET /api/exporter/api/v1/resources/globalconfig/get` → page-specific reads (apps list, notifications, plans list).

**F2 — Login (WebAuthn).** UI `POST /api/auth/api/v1/auth/login/start {email}` → auth-service looks up user + passkeys in exporter, generates challenge, stores in Redis, returns `CredentialAssertion`. Browser invokes `navigator.credentials.get(...)` (native), then `POST /auth/login/finish {signed assertion}` → auth-service verifies, issues `sessionToken`, returns user. (**k6 cannot reproduce step 2 — see §C, scenario `auth_session_lifecycle` uses a pre-issued token.**)

**F3 — Session lifecycle.** Logged-in user opens "My Sessions" → `GET /api/exporter/api/v1/auth/sessions/{userId}/get` → click a row → `GET /api/exporter/api/v1/auth/sessions/tokens/{token}/get` → "Revoke" → `DELETE /api/exporter/api/v1/auth/sessions/tokens/{token}/delete`. All exporter-only (sessions stored as CRDs).

**F4 — RBAC create-then-use (users/groups/roles).** Click "Create user" → `POST /api/exporter/api/v1/resources/users/create` (CRD write under per-ID lock) → list refresh `GET .../get` → click user → `GET .../findbyid/{id}/get` → edit → `PATCH .../{id}/patch` → delete → **`DELETE /api/auth/api/v1/auth/users/{id}/cleanup`** which fans out: auth adds finalizers via exporter's cleanup routes (`PATCH /resources/{kind}/add-finalizer`), then orchestrates the cascade and finally removes finalizers. Same shape for groups/roles. Categories follow a simpler exporter-only delete (`DELETE classification/categories/{id}/delete`).

**F5 — Applications browse + snapshot inspection.** `GET /api/exporter/api/v1/resources/applications/get` (cached LIST from informers) → click app → `GET .../resources/applications/{name}/get` (cache + details) → UI calls `getApplicationSnapshotSummaries(refs[])` which performs **one `GET /api/exporter/api/v1/snapshots/{id}/get?scope=apps&namespace=…&generation=…` per snapshot ref in parallel via `Promise.allSettled`** → optional `GET .../snapshots/{id}/manifest?…` for selected snapshot → `GET .../applications/{name}/rollbacks/get`. **Highest fan-out on the read path.**

**F6 — Force sync app.** Click "Force sync" → `POST /api/discovery/api/v1/resources/applications/{name}/sync?reason=…` with `X-User-ID` header. Discovery handler: deadline 5s, builds `EnqueueRequest`, calls `ingress.Enqueue` → writes to Redis Stream `forcesync:queue` (dedup TTL 600s) → returns **`202 Accepted` `{jobId, appName, phase, status}`** or `503 {retryAfterSec}` if Redis is down. Async: one of the 4 workers × 2 replicas picks it up → does K8s LIST → writes snapshot via exporter PATCH → updates app phase. UI observes completion by re-fetching `GET /resources/applications/{name}/get` against the exporter (the cache is invalidated when the worker writes through). **No status endpoint** for force-sync per route inventory — UI polls the app's `phase` field.

**F7 — Protection plan full lifecycle.** Open plans page → `GET /api/exporter/api/v1/plans/protection/get` → "New plan" wizard → `GET /api/discovery/api/v1/plans/protection/templates` + `GET /api/discovery/api/v1/analyze/namespaces/get` (K8s LIST via discovery) → submit → `POST /api/discovery/api/v1/plans/protection/prepare` with `X-User-ID` header → discovery validates, resolves participants, applies wire-up, then HTTPs to exporter `POST /plans/protection/create` (30s timeout, per-ID lock at exporter, CRD write). UI then polls `GET /api/discovery/api/v1/plans/protection/{id}/status` (state-machine progression) and `GET .../violations?limit=N` (engine output, 10s timeout). User actions: cancel → `POST .../{id}/cancel` (discovery → exporter PATCH); duplicate → `POST .../{id}/duplicate` (read source from exporter, validate, write new plan); reactivate → `POST .../{id}/reactivate`; update → `POST .../{id}/update`; clear → `DELETE .../{id}/clear` (discovery → exporter DELETE CRD).

**F8 — Notifications.** `GET /api/exporter/api/v1/notifications/get?userId=…&limit=…&cursor=…` (cursor-paginated) → user opens notification → `PATCH .../{id}/markasread?userId=…` → "Mark all read" → `POST .../markallread?userId=…` → "Clear" → `DELETE .../clear?userId=…`.

**F9 — Insights settings.** Validate AI key: `POST /api/enrichment/api/v1/provider/validate-api-key` (no auth header — public-ish dev) → set provider → `PATCH /api/exporter/api/v1/resources/globalconfig/patch`. Set excluded namespaces: `GET /api/discovery/api/v1/analyze/namespaces/get` (K8s LIST) → `PATCH globalconfig`. Snapshot storage: `GET /api/exporter/api/v1/snapshots/infos` → `PATCH globalconfig`.

### B.3 Hot paths flagged

| Hot path | Why hot | Owner |
|---|---|---|
| Plan-prepare end-to-end | UI → discovery (validate) → exporter REST hop (30s ceiling) → per-ID lock → K8s CRD apply → exporter informer cache refresh | discovery + exporter |
| Snapshot summary fan-out | One exporter GET per snapshot generation, parallel; bound by exporter K8s QPS 50 | exporter |
| Plan violations | Compiles engine output; 10s UI ceiling | discovery |
| Discovery namespaces LIST | K8s LIST against apiserver, no caching layer shown in routes | discovery |
| Force-sync enqueue + completion | Enqueue cheap; completion gated by 4-workers/replica + 5s K8s GET deadline per resource | discovery + exporter cache invalidation |
| Plan list + plan-by-id | Exporter-cached but listMutex held during LIST | exporter |
| RBAC delete | Async finalizer cascade (auth → exporter add/remove-finalizer + actual delete) | auth + exporter |

## C. Scenarios (7)

### S1 — `bootstrap_flow`
- **Does**: simulates the first 2 seconds after a logged-in user loads the dashboard.
- **Calls**: `GET auth/config` → `GET auth/permissions` → `GET resources/globalconfig/get` → `GET resources/applications/get` → `GET notifications/get?userId&limit=20` → `GET plans/protection/get`.
- **Services**: auth, exporter (4x).
- **Why**: highest-frequency real-world flow. Catches auth-config publication broken, permissions handler regression, globalconfig schema drift, exporter cache cold-start slowness, notifications cursor bug.
- **Hot paths**: plan list + plan-by-id (light end), RBAC reads.
- **Complexity**: simple.

### S2 — `auth_session_lifecycle`
- **Does**: starts from a pre-issued `SESSION_TOKEN` env var, walks "My sessions" panel.
- **Calls**: `GET auth/sessions/{userId}/get` → `GET auth/sessions/tokens/{firstReturnedToken}/get` → `DELETE auth/sessions/tokens/{firstReturnedToken}/delete` (or a designated non-current token).
- **Services**: exporter only.
- **Why**: validates the session read/write contract every scenario depends on.
- **Complexity**: simple.

### S3 — `rbac_crud`
- **Does**: one journey covering users + groups + roles + categories.
- **Calls** (per kind): `POST create` → `GET get` (list) → `GET .../{id}/get` → `PATCH .../{id}/patch` → `DELETE` (auth cleanup for users/groups/roles; categories direct).
- **Services**: exporter (writes), auth (deletes for users/groups/roles).
- **Why**: only flow exercising cross-service async delete cascade.
- **Hot paths**: RBAC delete cascade.
- **Complexity**: moderate.

### S4 — `applications_browse`
- **Does**: list apps → pick one → fetch details → fetch snapshot summaries (fan-out) → rollbacks → manifest.
- **Services**: exporter only.
- **Why**: heaviest read journey; bound by exporter K8s QPS 50 ceiling.
- **Hot paths**: snapshot summary fan-out.
- **Complexity**: heavy.

### S5 — `application_force_sync`
- **Does**: POST sync for a designated test app → poll the app's phase via exporter `GET .../{name}/get` until Idle/Synced or 90s timeout.
- **Services**: discovery (enqueue), exporter (status read), Redis + K8s (invisible).
- **Why**: only end-to-end coverage of async work pipeline.
- **Hot paths**: force-sync enqueue + completion.
- **Complexity**: heavy.

### S6 — `protection_plan_lifecycle`
- **Does**: full plan CRUD across discovery↔exporter boundary.
- **Calls**: templates → namespaces → prepare → status poll → violations → duplicate → cancel → reactivate → update → clear (+ duplicate clear).
- **Services**: discovery (everywhere), exporter (read + inter-service write target).
- **Why**: most service-rich flow.
- **Hot paths**: plan-prepare end-to-end, plan violations, plan list+get.
- **Complexity**: heavy.

### S7 — `notifications_flow`
- **Does**: cursor-paginated list → mark first as read → mark all read → clear.
- **Services**: exporter only.
- **Why**: only flow exercising cursor pagination.
- **Complexity**: simple.

### Why 7

F2 (WebAuthn) untestable; F9 (AI key) external dep. Remaining 7 flows each cover a structurally distinct path. Dropping any leaves a gap; adding more duplicates the same exporter-write + auth-cleanup shape.

## D. Folder layout

```
Desktop/dashboard-ui/k6/
├── PLAN.md
├── README.md
├── USAGE.md
├── lib/
│   ├── config.js
│   ├── http.js
│   ├── auth.js
│   ├── assert.js
│   ├── metrics.js
│   ├── report.js
│   └── fixtures.js
├── scenarios/
│   ├── bootstrap_flow.js
│   ├── auth_session_lifecycle.js
│   ├── rbac_crud.js
│   ├── applications_browse.js
│   ├── application_force_sync.js
│   ├── protection_plan_lifecycle.js
│   └── notifications_flow.js
└── results/                 (gitignored)
```

**Extensibility**: new scenario = one file in `scenarios/` importing from `lib/`. No copy-paste, no top-of-file boilerplate.

## E. Configuration and test design

### Configuration
- Single `-e KEY=val` env-var contract (no `.env` magic). `lib/config.js` exposes `cfg.baseUrl`, `cfg.sessionToken`, `cfg.userId`, `cfg.testAppName`, `cfg.testEmail`, with default `BASE_URL=http://localhost:3000`.
- Full env-var list: `USAGE.md`.

### Authentication
- Token passed via `SESSION_TOKEN` env var. Rationale: WebAuthn cannot be performed from k6.
- `lib/auth.js` adds `X-Session-Token` and (for writes that need it) `X-User-ID`. All scenarios call via `lib/http.js`; no scenario reads env directly.
- No refresh strategy — TTL > suite runtime.

### Test data
- Mutating scenarios use `k6-test-` namespace prefix.
- Resource names include `RUN_ID` to avoid collisions between concurrent runs.
- Plan + RBAC + notifications scenarios fully clean up at end of iteration.
- Force-sync test app is configured via env, must pre-exist.

### Functional assertions
- `assertOk(res, name, extraChecks?)` and `assertShape(res, name, shapeFn)` in `lib/assert.js`. Every HTTP call wraps `assertOk`; significant responses add `assertShape`.

### Thresholds
See `lib/metrics.js#THRESHOLDS`. Reasoning per row:

| Metric | Threshold | Why |
|---|---|---|
| `auth_config_duration` | `p(95)<300` | static config + Redis lookup, no DB |
| `auth_permissions_duration` | `p(95)<500` | one Redis session lookup + permissions read |
| `auth_login_start_duration` | `p(95)<1200` | exporter passkey lookup + WebAuthn challenge gen + Redis store |
| `session_read_duration` | `p(95)<400` | exporter cached read |
| `session_delete_duration` | `p(95)<800` | exporter CRD delete + cache invalidate |
| `cached_list_duration` | `p(95)<400` | served from informer cache |
| `cached_get_duration` | `p(95)<300` | same cache, smaller payload |
| `rbac_write_duration` | `p(95)<1500` | CRD write + per-ID lock + informer roundtrip |
| `rbac_cleanup_duration` | `p(95)<2500` | finalizer cascade (auth → exporter PATCH × 2 → DELETE) |
| `globalconfig_get_duration` | `p(95)<250` | tiny CRD |
| `globalconfig_patch_duration` | `p(95)<1200` | CRD write + apply lock |
| `namespaces_list_duration` | `p(95)<1500` | live K8s LIST, not cached |
| `snapshot_summary_duration` | `p(95)<1500` | single-gen read; PVC IO bound |
| `snapshot_fanout_total_duration` | `p(95)<5000` | bound by exporter QPS 50 |
| `snapshot_manifest_duration` | `p(95)<2000` | one PVC file read |
| `force_sync_enqueue_duration` | `p(95)<800` | Redis stream XADD + dedup check |
| `force_sync_completion_duration` | `p(95)<90000` | enqueue → terminal app phase; bound by 300s job timeout |
| `plan_templates_duration` | `p(95)<400` | small static-ish list |
| `plan_status_duration` | `p(95)<800` | state-machine read |
| `plan_violations_duration` | `p(95)<2500` | engine query; UI itself caps at 10s |
| `plan_prepare_duration` | `p(95)<3500` | discovery validate + exporter REST write (30s ceiling) |
| `plan_mutate_duration` | `p(95)<2500` | discovery → exporter write, lighter than prepare |
| `notif_list_duration` | `p(95)<600` | indexed list lookup |
| `notif_mutate_duration` | `p(95)<800` | write |

### Custom metrics
Each scenario imports the metric names from `lib/metrics.js#METRICS` so shared metrics (e.g., `cached_list_duration` used in S1, S3, S4, S6, S7) emit to the same series.

### Error-handling
`assertOk` failures log `[FAIL]` with status + body excerpt and fail the iteration's checks, but scenario continues to next step so partial timing data is still captured. Setup steps (e.g., S6 prepare returning an id) abort the iteration if they fail because subsequent steps depend on the return value.

## F. Results / reporting design

Per-run output (each scenario writes 3 files into `results/`):
- **`<scenario>_<ts>.html`** — primary report via [`k6-reporter`](https://github.com/benc-uk/k6-reporter) loaded from CDN by `lib/report.js`. Sections: date/env/scenario/total duration, pass/fail checks table, per-metric p50/p95/p99 vs threshold side-by-side, plain-English line per metric, "what to look at" list of breached thresholds and slowest endpoint.
- **`<scenario>_<ts>.json`** — built-in summary JSON for CI gates / trend tracking.
- **`<scenario>_<ts>.txt`** — built-in `textSummary` for grep-ability.

Console: `[NN] step.name 200 142ms` per call.

Why this stack: lightest community option that already shows thresholds vs actuals side by side. No build step.

## G. Open questions and risks

1. **Enrichment service in scope?** UI talks to a 4th service the task didn't list. Recommendation: out of scope (external Groq quota). Documented in §A.
2. **WebAuthn login untestable from k6.** Suite uses pre-issued `SESSION_TOKEN`. Confirmed acceptable.
3. **BASE_URL default**: localhost via UI's nginx proxy. Cluster runs must override.
4. **Mutating scenarios need test data**: documented in USAGE.md (test app must pre-exist for S5; namespace + run-id-based names for others).
5. **`X-User-ID` source**: passed as separate env var since token doesn't encode it for our use.
6. **Plan template selection**: scenario auto-picks first template if `TEST_PLAN_TEMPLATE_ID` not set.
7. **Force-sync completion signal**: app `phase` field on exporter (no dedicated status endpoint).
8. **Plan-violations engine warmth**: first call after restart slower; recommend warm-up iteration.
9. **What this suite WON'T catch**: UI rendering, JS errors, race conditions invisible to HTTP, accessibility. Need different tools.
10. **k6 is black-box**: cannot attribute slow exporter to specific cause. Documented in README.md.

## Phase 1 final self-review

1. **Flow coverage**: F1→S1, F2→deferred (untestable), F3→S2, F4→S3, F5→S4, F6→S5, F7→S6, F8→S7, F9→deferred (external). All testable flows mapped. **Confirmed**.
2. **Scenario justification**: one-sentence regression catch per scenario, all distinct. **Confirmed**.
3. **Naming**: scenario names ≤30 chars; metrics use `<domain>_<verb>_duration`. **Confirmed**.
4. **Threshold sanity**: each row anchored in code-observed behavior (lock pattern, QPS, UI timeouts). **Confirmed**.
5. **Report clarity**: plain-English per metric, thresholds beside actuals, "what to look at" section. **Confirmed**.
6. **Service relationship completeness**: verified both sides of every inter-service call (discovery `clients/protectionplans.go` + exporter `handlers/plans/protection/CreatePlan`; discovery force-sync handler + worker ingress; auth cleanup handlers + exporter finalizer routes; nginx config + each service.yaml). **Confirmed**.
7. **Open questions**: 10 listed, none silently assumed. **Confirmed**.

**Changes made during self-review**:
- Originally 9 scenarios (separate users/groups/roles/categories). Merged into S3 `rbac_crud` — same shape, avoids 4 near-duplicate files.
- Originally proposed `BASE_URL=https://dev-cluster-ingress`. Changed default to localhost because `release-manager` has no Ingress yaml — public access is via UI pod's nginx, and local dev mirrors that shape.

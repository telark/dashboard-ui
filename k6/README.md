# Plsyro dashboard k6 suite

End-to-end functional + performance test suite that exercises the same APIs the dashboard UI calls. The goal is **not** stress testing — it is single-user / small-team realistic flow validation, with timing baselines per endpoint.

## What this suite does

Every scenario walks a real user journey:

- Issues the same HTTP calls the React UI issues, in the same order.
- Validates each response has a 2xx status and a sane body shape.
- Records per-endpoint timings as named k6 trend metrics.
- Asserts pass/fail thresholds tuned per endpoint type (not generic ceilings).
- Emits a human-readable HTML report per run plus raw JSON.

## What this suite does NOT do

- It does **not** test the React UI itself (rendering, JS errors, navigation correctness). Use Playwright/Cypress for that.
- It does **not** test WebAuthn login flow — k6 cannot drive a real authenticator. The suite assumes a pre-issued `SESSION_TOKEN`.
- It does **not** stress-test. VU counts are 1–2, iterations are bounded. To regress under load, fork a scenario and raise `vus`/`duration`.
- It does **not** attribute slow exporter latency to a specific backend cause. k6 is black-box: when a scenario is slow, correlate with backend traces/logs (Grafana / loki / OpenTelemetry / kubectl logs).

## High-level structure

```
k6/
├── lib/                     # shared helpers — every scenario imports from here
│   ├── config.js            # env-var loader, BASE_URL + per-service path builders
│   ├── http.js              # k6 http wrapper, metric+log+assert in one call
│   ├── auth.js              # X-Session-Token + X-User-ID header injection
│   ├── assert.js            # consistent 2xx + body-shape assertions
│   ├── metrics.js           # central metric names + threshold table
│   ├── fixtures.js          # per-run test data names (k6-user-<runId>, ...)
│   └── report.js            # handleSummary → html + json + txt
├── scenarios/               # one file per user journey
├── results/                 # html / json / txt per run (gitignored)
├── PLAN.md                  # Phase 1 discovery + design doc
└── USAGE.md                 # operator reference (commands, env vars)
```

Adding a new scenario = create one file under `scenarios/`, import from `lib/`. No copy-paste.

## UI endpoint → backend service mapping

| UI client | nginx proxy_pass | Routes |
|---|---|---|
| `authApiClient` | `/api/auth/` → `plsyro-auth-service:8080` | login start/finish, logout, register/start, oidc google callback/nonce, config, permissions, passkeys (CRUD via proxy), user/group/role async cleanup |
| `discoveryApiClient` | `/api/discovery/` → `plsyro-discovery-service:8080` | analyze namespaces/workloads/resources, application enrich/rollback/sync/cleanup, protection plans (templates/prepare/cancel/clear/status/violations/duplicate/reactivate/update) |
| `exporterApiClient` | `/api/exporter/` → `plsyro-exporter-service:8080` | applications, globalconfig, users, groups, roles, categories, sessions, internal passkeys, snapshots, notifications, protection plans (list/get), cleanup finalizers |
| `enrichmentApiClient` | `/api/enrichment/` → `plsyro-enrichment-service:8080` | provider/validate-api-key (out of suite scope) |

UI builds URLs as `/api/{service}/api/v1/{path}` in-cluster; the suite uses the same pattern via `lib/config.js#path.*`.

## Flow map covered

Each scenario maps to one or more of the end-to-end flows analyzed in `PLAN.md` §B.2.

| Scenario | Flow(s) | Hot path covered |
|---|---|---|
| `bootstrap_flow` | F1 page bootstrap | none specifically |
| `auth_session_lifecycle` | F3 session lifecycle | none |
| `rbac_crud` | F4 user/group/role/category CRUD | RBAC delete cascade (auth → exporter finalizers) |
| `applications_browse` | F5 apps + snapshot inspection | snapshot summary fan-out (bound by exporter K8s QPS 50) |
| `application_force_sync` | F6 force sync | Redis Stream enqueue + worker round-trip |
| `protection_plan_lifecycle` | F7 plan full lifecycle | discovery↔exporter inter-service writes, plan violations engine |
| `notifications_flow` | F8 notifications | cursor pagination |

F2 (WebAuthn login) and F9 (AI provider validation) are intentionally out of scope — see `PLAN.md` §G.

## What each scenario reveals

| Scenario | Pass means | Fail likely means |
|---|---|---|
| `bootstrap_flow` | Bootstrap calls all under their thresholds, all 2xx | Auth config publication broken; permissions handler regression; globalconfig schema drift; exporter cache cold-start slowness |
| `auth_session_lifecycle` | Session list/get/delete contract intact | Session-token header rename; sessions CRD shape change; exporter delete path broken |
| `rbac_crud` | Per-kind CRUD round trips OK, async delete cascade completes | Finalizer cascade regression (auth ↔ exporter add/remove-finalizer); cache invalidation broken; lock contention on writes |
| `applications_browse` | Snapshot fan-out stays under 5s; per-snapshot under 1.5s | Exporter K8s QPS ceiling reached; PVC IO slow; informer cache miss storms |
| `application_force_sync` | App reaches a terminal phase within 90s | Redis Stream backed up; workers starved; exporter cache fails to invalidate after worker writes through |
| `protection_plan_lifecycle` | Plan prepare under 3.5s; status reaches a terminal state; mutations all OK | discovery↔exporter contract drift; per-ID lock contention; violations engine slow; state-machine transition bug |
| `notifications_flow` | Cursor pagination works, mutate calls under 800ms | Cursor handling regression; mark-all batch slow; clear endpoint broken |

## Black-box note (important)

k6 sees only HTTP from the UI's perspective. If `application_force_sync` is slow it could be: discovery enqueue slow, Redis IO slow, workers slow, exporter cache invalidation slow, K8s apiserver slow. The suite says **what** is slow, not **why**. To attribute:

1. Note the failing metric and the time window from the HTML report.
2. Pull discovery + exporter logs for that window.
3. Cross-reference with K8s apiserver metrics if available.

## Usage

See `USAGE.md` for installation, environment variables, and copy-pasteable commands.

## Threshold table

See `lib/metrics.js#THRESHOLDS` for the full table with the reasoning in `PLAN.md` §E.

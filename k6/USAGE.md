# USAGE — Plsyro dashboard k6 suite

Operator reference. No narrative. Copy-paste commands below.

## Cheat sheet (3 most common)

```bash
# 1. smoke check that all scenarios parse
for f in k6/scenarios/*.js; do k6 inspect "$f" >/dev/null && echo "OK $f" || echo "FAIL $f"; done

# 2. run one scenario against localhost
BASE_URL=http://localhost:3000 \
SESSION_TOKEN=<token> \
USER_ID=<userId> \
k6 run k6/scenarios/bootstrap_flow.js

# 3. run all scenarios in sequence
for f in k6/scenarios/*.js; do \
  BASE_URL=http://localhost:3000 SESSION_TOKEN=<token> USER_ID=<userId> \
  k6 run "$f"; \
done
```

## Prerequisites

### Install k6

| OS | Command |
|---|---|
| macOS (Homebrew) | `brew install k6` |
| Linux (Debian/Ubuntu) | `sudo gpg -k && sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69 && echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list && sudo apt-get update && sudo apt-get install k6` |
| Linux (Fedora/CentOS) | `sudo dnf install https://dl.k6.io/rpm/repo.rpm && sudo dnf install k6` |
| Windows | `winget install k6 --source winget` |

Verify: `k6 version`.

### Obtain a session token

Log into the dashboard in a browser. The token lives in browser storage (dev tools → Application → Local Storage / Session Storage, look for the key the app stores `sessionToken` under). Copy the string.

Also note your `userId` from the same source (the auth response contains `user.id`).

## Environment variables

| Var | Default | Used by | Notes |
|---|---|---|---|
| `BASE_URL` | `http://localhost:3000` | all | Origin only, no trailing slash; the suite appends `/api/{service}/api/v1/...` |
| `SESSION_TOKEN` | _(required for all)_ | all | Value of the `X-Session-Token` header |
| `USER_ID` | _(required for most)_ | bootstrap, sessions, rbac, force_sync, plan, notifications | Value of the `X-User-ID` header |
| `TEST_APP_NAME` | _(required for S5)_ | `application_force_sync` | Must be an existing app in the target cluster |
| `TEST_NAMESPACE` | `k6-test` | rbac, plan | Reserved namespace for test resources |
| `TEST_PLAN_TEMPLATE_ID` | (auto-pick first available) | `protection_plan_lifecycle` | Skip auto-pick by setting explicitly |
| `TEST_EMAIL` | `k6-test@example.com` | rbac | Email for created test user |
| `FORCE_SYNC_POLL_TIMEOUT_SEC` | `90` | `application_force_sync` | Cap on how long to wait for sync completion |
| `PLAN_STATUS_POLL_TIMEOUT_SEC` | `60` | `protection_plan_lifecycle` | Cap on plan-state poll |
| `DELETE_OWN_SESSION` | `false` | `auth_session_lifecycle` | Set `true` to allow deleting the SESSION_TOKEN's own session |
| `RUN_ID` | `Date.now()` | rbac, plan | Used in created-resource names to avoid collisions |
| `OUTPUT_DIR` | `./results` | report | Where to write HTML/JSON/TXT |

## Per-scenario commands (copy-pasteable)

Each command assumes you have exported `BASE_URL`, `SESSION_TOKEN`, `USER_ID` already (`export VAR=val` in your shell).

### S1 — bootstrap_flow

```bash
k6 run k6/scenarios/bootstrap_flow.js
```

### S2 — auth_session_lifecycle

```bash
# safe (does not delete own session)
k6 run k6/scenarios/auth_session_lifecycle.js

# explicitly opt in to deleting the calling session (will log you out)
DELETE_OWN_SESSION=true k6 run k6/scenarios/auth_session_lifecycle.js
```

### S3 — rbac_crud

```bash
k6 run k6/scenarios/rbac_crud.js
```

### S4 — applications_browse

```bash
k6 run k6/scenarios/applications_browse.js
```

If the cluster has no applications, the scenario logs `[info] no applications returned` and exits cleanly.

### S5 — application_force_sync

```bash
TEST_APP_NAME=my-app k6 run k6/scenarios/application_force_sync.js
```

### S6 — protection_plan_lifecycle

```bash
# auto-picks the first template returned by the discovery service
k6 run k6/scenarios/protection_plan_lifecycle.js

# pin a specific template
TEST_PLAN_TEMPLATE_ID=my-template-id k6 run k6/scenarios/protection_plan_lifecycle.js
```

### S7 — notifications_flow

```bash
k6 run k6/scenarios/notifications_flow.js
```

## Run all scenarios in sequence

```bash
export BASE_URL=http://localhost:3000
export SESSION_TOKEN=<token>
export USER_ID=<userId>
export TEST_APP_NAME=<app-name>

for f in k6/scenarios/*.js; do
  echo "=== $f ==="
  k6 run "$f"
done
```

## Different environments

```bash
# local dev (Vite dev server proxy or nginx pod port-forward)
BASE_URL=http://localhost:3000 k6 run ...

# kubectl port-forward to UI pod
kubectl -n plsyro port-forward svc/plsyro-ui-service 8080:8080
BASE_URL=http://localhost:8080 k6 run ...

# deployed dev cluster (real ingress)
BASE_URL=https://dashboard.dev.example.com k6 run ...
```

## Output formats

By default each scenario writes 3 files into `results/`:

- `<scenario>_<ts>.html` — primary human report (open in browser)
- `<scenario>_<ts>.json` — raw k6 summary (CI gates, trend tracking)
- `<scenario>_<ts>.txt` — same text summary that printed to console

Console also shows step-by-step output during the run (`[01] step.name 200 142ms`).

Override output dir: `OUTPUT_DIR=/tmp/k6-out k6 run ...`.

## Interpreting results

1. Open the latest HTML in `results/`.
2. Look at the **Checks** table — every assertion is listed with ✓/✗.
3. Look at the **Thresholds** table — every named metric is shown with its p50/p95/p99 and the configured threshold. Anything red breached its threshold.
4. The **What to look at** section (in the report) flags the slowest endpoint of the run.
5. For failures, search the console output for `[FAIL]` lines — each includes the response status and the first 300 chars of the body.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `connection refused` | `BASE_URL` wrong, or UI service not reachable | `curl $BASE_URL/api/v1/status/ready` from the same machine |
| 401 on every call | `SESSION_TOKEN` empty / expired | Re-issue token from browser, export again |
| 403 on plan/sync writes | `USER_ID` missing or doesn't match token | Re-export both vars |
| 503 on force-sync | Redis stream queue down or back-pressured (returns `retryAfterSec`) | Check Redis + discovery logs; verify ingress hasn't trimmed at 5000 |
| Snapshot fan-out times out | Exporter QPS 50 ceiling hit | Lower iterations, or raise EXPORTER_K8S_CLIENT_QPS in release-manager |
| Threshold breached but only on first run | Cold cache | Warm up the app: hit the endpoint once via curl, then re-run k6 |
| `cannot resolve plsyro-...-service` from outside cluster | You ran against in-cluster service DNS from outside | Use `kubectl port-forward` or the public ingress URL |
| `TypeError: cannot read property '...' of null` in scenario logs | Backend returned an unexpected body shape (likely 5xx HTML page) | Check console for `[FAIL]` line with body excerpt |

## Notes

- The suite uses k6 HTTP only — no extensions, no browser module.
- `lib/report.js` pulls `k6-reporter` from a CDN URL at runtime; first run on a fresh machine needs internet access. To run offline, vendor that script and rewrite the import to a local path.
- Default VU count is 1 per scenario. To simulate small-team concurrent usage, override with `-i <iterations> --vus <n>` on the `k6 run` line (do not edit scenario files for ad-hoc tuning).

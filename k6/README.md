# telark dashboard k6 tests

Tests that check the dashboard's APIs work and measure how fast they are. Each test walks a real user flow (login session reuse, browse apps, create a protection plan, etc.) and reports per-step timings.

Same shape as `exporter-service/k6/`: each run is one Kubernetes Job inside the cluster, runs once, cleans itself up.

## Folder layout

```
k6/
├── README.md             this file — what + why
├── USAGE.md              how to run (copy-paste commands)
├── PLAN.md               design doc (read if you want the full picture)
├── lib/                  shared helpers — every test imports from here
├── scenarios/            one file per user flow (7 total)
├── cluster/
│   ├── job.yaml          K8s Job template
│   └── run.sh            run one test in-cluster; cleans up after
└── results/              logs + JSON summaries (gitignored)
```

## The 7 tests

| Test | What it does |
|---|---|
| `bootstrap_flow` | Page load: auth config, permissions, global config, apps list, notifications, plans list |
| `auth_session_lifecycle` | List your sessions, view one, delete a non-current one |
| `rbac_crud` | Create + read + update + delete one of each: user, group, role, category |
| `applications_browse` | List apps, open one, fetch all its snapshot summaries and one manifest |
| `application_force_sync` | Trigger a force-sync on one app, poll until it finishes |
| `protection_plan_lifecycle` | Create a plan, poll status, view violations, duplicate, cancel, reactivate, update, clear |
| `notifications_flow` | List notifications (with cursor pagination), mark read, mark all, clear |

## How to run one test

```sh
cd /Users/houssem/Desktop/dashboard-ui

# get a session token from the browser (Application → Storage)
export SESSION_TOKEN=<your-token>
export USER_ID=<your-user-id>

k6/cluster/run.sh bootstrap_flow
```

The script creates a K8s Job in the `telark` namespace, runs the test, streams logs, copies result files, then deletes the Job and ConfigMap. **Nothing stays in the cluster between runs.**

Full command reference: see [`USAGE.md`](./USAGE.md).

## What you get back

After a run finishes:

```
k6/results/
├── bootstrap_flow-20260517-145322.log         # full pod log (raw k6 output)
└── bootstrap_flow-20260517-145322-json/       # k6 summary files
    ├── bootstrap_flow_20260517-145322.json    # raw summary JSON
    └── bootstrap_flow_20260517-145322.txt     # human-readable summary
```

Open the `.txt` to see pass/fail and per-endpoint timings. Use the `.json` for trend analysis later.

## What each test catches when it fails

| Test | Fail likely means |
|---|---|
| `bootstrap_flow` | Auth config or permissions handler broke; global config schema drifted; apps list slow |
| `auth_session_lifecycle` | Session-token header rename; session storage shape changed; delete path broken |
| `rbac_crud` | Async delete cascade broken (auth → exporter finalizers); write-path lock contention |
| `applications_browse` | Snapshot fan-out hit exporter's K8s rate limit; PVC slow; cache miss storm |
| `application_force_sync` | Redis stream backed up; force-sync workers starved; cache failed to invalidate |
| `protection_plan_lifecycle` | discovery → exporter contract drift; plan validation broke; state machine stuck |
| `notifications_flow` | Cursor pagination regression; mark-all batch slow; clear endpoint broken |

## How the test talks to services

Tests target the four backend services directly via their in-cluster DNS names (NOT through the UI's nginx). One env var per service, overridable:

| Service | Default URL |
|---|---|
| exporter | `http://telark-exporter-service.telark.svc.cluster.local:8080` |
| discovery | `http://telark-discovery-service.telark.svc.cluster.local:8080` |
| auth | `http://telark-auth-service.telark.svc.cluster.local:8080` |
| enrichment | `http://telark-enrichment-service.telark.svc.cluster.local:8080` |

Each test calls the same paths the UI's React code calls — see the per-service mapping table in `PLAN.md` §A.

## What this suite does NOT do

- Does NOT test the React UI itself (rendering, JS errors, navigation). Use Playwright/Cypress for that.
- Does NOT do real WebAuthn login (passkey signing needs a browser). Suite uses a pre-issued `SESSION_TOKEN`.
- Does NOT stress-test. VU counts are 1–2. To check load behavior, fork a scenario and raise `vus`.
- Does NOT say WHY a backend is slow — k6 sees only HTTP. When a test is slow, cross-reference backend logs / traces.

## Add a new test

Create `scenarios/<name>.js`:

```js
import { path, requireToken, requireUserId } from '../lib/config.js';
import { get } from '../lib/http.js';
import { METRICS, pickThresholds } from '../lib/metrics.js';
import { buildSummary } from '../lib/report.js';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: pickThresholds([METRICS.CACHED_LIST]),
};

export const setup = () => { requireToken(); requireUserId(); };

export default function () {
  get(path.exporter('resources/applications/get'), {
    name: 'apps.list',
    metric: METRICS.CACHED_LIST,
  });
}

export const handleSummary = buildSummary('<name>');
```

Then add `<name>` to `VALID_SCENARIOS` in `cluster/run.sh`. Done — no other wiring needed.

# How to run the k6 tests

Copy-paste commands. Each test runs as a one-time Kubernetes Job that cleans itself up.

## Before you start

You need:

1. `kubectl` configured for the cluster running telark (try `kubectl get pods -n telark` — should list pods).
2. A **session token** and your **user id**:
   - Log into the dashboard in a browser.
   - Open DevTools → **Application** tab → **Local Storage** (or Session Storage).
   - Find the key holding the auth state. Copy `sessionToken` and `user.id`.

That's it. No local k6 install needed (the Job runs `grafana/k6:latest` inside the cluster).

## Cheat sheet

```sh
cd /Users/houssem/Desktop/dashboard-ui

export SESSION_TOKEN=<paste-from-browser>
export USER_ID=<paste-from-browser>

# run one test
k6/cluster/run.sh bootstrap_flow

# run all 7 tests one after the other
for s in bootstrap_flow auth_session_lifecycle rbac_crud applications_browse \
         protection_plan_lifecycle notifications_flow; do
  k6/cluster/run.sh "$s"
done

# results land in k6/results/
ls k6/results/
```

`application_force_sync` is intentionally omitted from the loop — it needs `TEST_APP_NAME` (see below).

## Run each test

All seven commands assume `SESSION_TOKEN` + `USER_ID` are exported.

```sh
k6/cluster/run.sh bootstrap_flow
k6/cluster/run.sh auth_session_lifecycle
k6/cluster/run.sh rbac_crud
k6/cluster/run.sh applications_browse
k6/cluster/run.sh protection_plan_lifecycle
k6/cluster/run.sh notifications_flow

# this one needs an existing app name
TEST_APP_NAME=my-app k6/cluster/run.sh application_force_sync
```

## What happens when you run

1. The script flattens `lib/` + `scenarios/` into a temp dir and uploads them as a per-run ConfigMap.
2. It renders `cluster/job.yaml` with your env values and applies the Job.
3. It waits for the pod, streams logs live (also saved to `k6/results/<run>.log`).
4. After the Job finishes it copies the JSON + TXT summary out of the pod into `k6/results/<run>-json/`.
5. It deletes the Job and ConfigMap (guaranteed by an `EXIT` trap — even if you Ctrl-C).

You'll see lines like:

```
[build] flattening k6 scripts into /tmp/k6-flat-...
[build] creating configmap telark/k6-scripts-bootstrap_flow-...
[apply] scenario=bootstrap_flow run=bootstrap_flow-... ns=telark
[wait]  pod scheduling (up to 60s)
[pod]   k6-bootstrap_flow-...-abcde
[logs]  streaming to k6/results/bootstrap_flow-...log
... (k6 output) ...
[status] complete
[copy]  pod:/tmp/results/. → k6/results/bootstrap_flow-...-json
[done]  scenario=bootstrap_flow run=... status=complete
[cleanup] deleting job telark/k6-bootstrap_flow-...
[cleanup] deleting configmap telark/k6-scripts-bootstrap_flow-...
```

## Env vars

### Required (always)

| Var | What |
|---|---|
| `SESSION_TOKEN` | Pre-issued session token from the browser |
| `USER_ID` | User id matching that token |

### Required (one test only)

| Var | What | Needed for |
|---|---|---|
| `TEST_APP_NAME` | Name of an existing application in the cluster | `application_force_sync` |

### Optional (have defaults)

| Var | Default | When to override |
|---|---|---|
| `EXPORTER_BASE_URL` | `http://telark-exporter-service.telark.svc.cluster.local:8080` | Service runs in a different namespace |
| `DISCOVERY_BASE_URL` | `http://telark-discovery-service.telark.svc.cluster.local:8080` | Same |
| `AUTH_BASE_URL` | `http://telark-auth-service.telark.svc.cluster.local:8080` | Same |
| `ANALYZER_BASE_URL` | `http://telark-analyzer-service.telark.svc.cluster.local:8080` | Same |
| `TEST_PLAN_TEMPLATE_ID` | (auto-pick first available) | Pin to a specific plan template |
| `FORCE_SYNC_POLL_TIMEOUT_SEC` | `90` | Force-sync takes longer than 90s on your cluster |
| `PLAN_STATUS_POLL_TIMEOUT_SEC` | `60` | Same idea, for plan state machine |
| `DELETE_OWN_SESSION` | `false` | Set `true` to allow the test to delete the session it's using (will log you out) |
| `WAIT_TIMEOUT` | `15m` | Cluster is slow and the Job needs longer |
| `IMAGE` | `grafana/k6:latest` | Use a private registry mirror |

## Target a different namespace

```sh
k6/cluster/run.sh bootstrap_flow my-other-namespace
```

Make sure the dashboard service DNS names also match — override `*_BASE_URL` env vars accordingly.

## See the results

After a run:

```sh
ls k6/results/
# bootstrap_flow-20260517-145322.log
# bootstrap_flow-20260517-145322-json/

# read the human summary
cat k6/results/bootstrap_flow-*-json/bootstrap_flow_*.txt

# full pod log
cat k6/results/bootstrap_flow-*.log
```

The TXT file shows: per-metric p50/p95/p99, threshold pass/fail, total checks passed.

## Abort a run

`Ctrl-C` the script. The `EXIT` trap deletes the Job + ConfigMap for you. If something is really stuck:

```sh
kubectl -n telark get jobs -l app=k6-dashboard
kubectl -n telark delete job <name>
kubectl -n telark get configmap -l app=k6-dashboard 2>/dev/null  # rare; usually auto-cleaned
```

## Run from your laptop (no cluster)

Only useful for editing tests + checking syntax. Real timings need the in-cluster Job.

```sh
brew install k6                                              # macOS, one time

kubectl -n telark port-forward svc/telark-exporter-service 8002:8080 &
kubectl -n telark port-forward svc/telark-discovery-service 8004:8080 &
kubectl -n telark port-forward svc/telark-auth-service 8006:8080 &
kubectl -n telark port-forward svc/telark-analyzer-service 8007:8080 &

EXPORTER_BASE_URL=http://localhost:8002 \
DISCOVERY_BASE_URL=http://localhost:8004 \
AUTH_BASE_URL=http://localhost:8006 \
ANALYZER_BASE_URL=http://localhost:8007 \
SESSION_TOKEN=<token> USER_ID=<id> \
k6 run k6/scenarios/bootstrap_flow.js
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `ERROR: SESSION_TOKEN env var is required` | You forgot to export it | `export SESSION_TOKEN=<token>` |
| `pod did not appear within 60s` | Cluster can't pull `grafana/k6:latest`, or namespace lacks permission | Check `kubectl describe job k6-... -n telark`; pre-pull the image or set `IMAGE=` |
| All requests return 401 | Token expired | Re-copy from the browser |
| All plan/sync writes return 403 | `USER_ID` doesn't match the token's user | Re-export both vars from the same browser session |
| `503` on force-sync | Redis queue down or back-pressured | Check `kubectl logs deploy/telark-discovery-service -n telark` |
| Job stuck `unknown` after 15m | Test scenario hung (likely a long poll) | Raise `WAIT_TIMEOUT=30m`, or check pod logs while it runs |
| `unknown scenario 'foo'` | Typo in test name | List valid names: `head -50 k6/cluster/run.sh \| grep VALID_SCENARIOS -A 8` |

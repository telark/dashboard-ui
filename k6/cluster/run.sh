#!/usr/bin/env bash
#
# Run one k6 scenario for the Plsyro dashboard as a K8s Job.
#
# Lifecycle per invocation:
#   1. Flatten k6 scripts to a temp dir (ConfigMap mount needs flat layout).
#   2. Create a per-run ConfigMap with the flattened scripts.
#   3. Render Job manifest from job.yaml template.
#   4. Apply Job. Wait for pod. Stream logs to results/<run>.log.
#   5. Wait for Job completion. Copy result JSON/TXT out of the pod.
#   6. Delete Job + ConfigMap (always, via EXIT trap).
#
# Usage:
#   k6/cluster/run.sh <scenario> [namespace]
#
# Scenarios:
#   bootstrap_flow | auth_session_lifecycle | rbac_crud |
#   applications_browse | application_force_sync | protection_plan_lifecycle |
#   notifications_flow
#
# Required env (no defaults):
#   SESSION_TOKEN   pre-issued session token (browser → Application → Storage)
#   USER_ID         user id matching SESSION_TOKEN
#
# Required for one scenario:
#   TEST_APP_NAME   application name that must exist in the target cluster
#                   (only needed for: application_force_sync)
#
# Optional env (sensible defaults):
#   EXPORTER_BASE_URL              http://plsyro-exporter-service.plsyro.svc.cluster.local:8080
#   DISCOVERY_BASE_URL             http://plsyro-discovery-service.plsyro.svc.cluster.local:8080
#   AUTH_BASE_URL                  http://plsyro-auth-service.plsyro.svc.cluster.local:8080
#   ENRICHMENT_BASE_URL            http://plsyro-enrichment-service.plsyro.svc.cluster.local:8080
#   TEST_PLAN_TEMPLATE_ID          auto-pick first template if empty
#   FORCE_SYNC_POLL_TIMEOUT_SEC    90
#   PLAN_STATUS_POLL_TIMEOUT_SEC   60
#   DELETE_OWN_SESSION             false
#   WAIT_TIMEOUT                   15m
#   IMAGE                          grafana/k6:latest

set -euo pipefail

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

readonly VALID_SCENARIOS=(
  bootstrap_flow
  auth_session_lifecycle
  rbac_crud
  applications_browse
  application_force_sync
  protection_plan_lifecycle
  notifications_flow
)
readonly DEFAULT_NAMESPACE="plsyro"
readonly DEFAULT_EXPORTER_URL="http://plsyro-exporter-service.plsyro.svc.cluster.local:8080"
readonly DEFAULT_DISCOVERY_URL="http://plsyro-discovery-service.plsyro.svc.cluster.local:8080"
readonly DEFAULT_AUTH_URL="http://plsyro-auth-service.plsyro.svc.cluster.local:8080"
readonly DEFAULT_ENRICHMENT_URL="http://plsyro-enrichment-service.plsyro.svc.cluster.local:8080"
readonly DEFAULT_FORCE_SYNC_POLL_TIMEOUT_SEC="90"
readonly DEFAULT_PLAN_STATUS_POLL_TIMEOUT_SEC="60"
readonly DEFAULT_DELETE_OWN_SESSION="false"
readonly DEFAULT_WAIT_TIMEOUT="15m"
readonly DEFAULT_IMAGE="grafana/k6:latest"
readonly POD_APPEAR_TIMEOUT_SECONDS=60
readonly POD_RUNNING_TIMEOUT="2m"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

log() { echo "[$1] ${*:2}"; }
die() { echo "ERROR: $*" >&2; exit 1; }

is_valid_scenario() {
  local name="$1"
  for v in "${VALID_SCENARIOS[@]}"; do
    [[ "$v" == "$name" ]] && return 0
  done
  return 1
}

# In-place sed that works on both macOS and Linux.
sed_inplace() {
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' "$@"
  else
    sed -i "$@"
  fi
}

# ---------------------------------------------------------------------------
# Argument + env parsing
# ---------------------------------------------------------------------------

parse_arguments() {
  SCENARIO="${1:-}"
  NAMESPACE="${2:-${DEFAULT_NAMESPACE}}"

  if [[ -z "${SCENARIO}" ]]; then
    die "usage: $(basename "$0") <${VALID_SCENARIOS[*]}> [namespace]"
  fi
  if ! is_valid_scenario "${SCENARIO}"; then
    die "unknown scenario '${SCENARIO}'. Valid: ${VALID_SCENARIOS[*]}"
  fi
}

check_required_env() {
  [[ -n "${SESSION_TOKEN:-}" ]] || die "SESSION_TOKEN env var is required"
  [[ -n "${USER_ID:-}" ]]       || die "USER_ID env var is required"
  if [[ "${SCENARIO}" == "application_force_sync" ]]; then
    [[ -n "${TEST_APP_NAME:-}" ]] || die "TEST_APP_NAME env var is required for application_force_sync"
  fi
}

apply_env_defaults() {
  EXPORTER_URL="${EXPORTER_BASE_URL:-${DEFAULT_EXPORTER_URL}}"
  DISCOVERY_URL="${DISCOVERY_BASE_URL:-${DEFAULT_DISCOVERY_URL}}"
  AUTH_URL="${AUTH_BASE_URL:-${DEFAULT_AUTH_URL}}"
  ENRICHMENT_URL="${ENRICHMENT_BASE_URL:-${DEFAULT_ENRICHMENT_URL}}"
  TEST_APP_NAME="${TEST_APP_NAME:-}"
  TEST_PLAN_TEMPLATE_ID="${TEST_PLAN_TEMPLATE_ID:-}"
  FORCE_SYNC_POLL_TIMEOUT_SEC="${FORCE_SYNC_POLL_TIMEOUT_SEC:-${DEFAULT_FORCE_SYNC_POLL_TIMEOUT_SEC}}"
  PLAN_STATUS_POLL_TIMEOUT_SEC="${PLAN_STATUS_POLL_TIMEOUT_SEC:-${DEFAULT_PLAN_STATUS_POLL_TIMEOUT_SEC}}"
  DELETE_OWN_SESSION="${DELETE_OWN_SESSION:-${DEFAULT_DELETE_OWN_SESSION}}"
  WAIT_TIMEOUT="${WAIT_TIMEOUT:-${DEFAULT_WAIT_TIMEOUT}}"
  IMAGE="${IMAGE:-${DEFAULT_IMAGE}}"
}

compute_run_identifiers() {
  RUN_TAG="${SCENARIO}-$(date +%Y%m%d-%H%M%S)"
  JOB_NAME="k6-${RUN_TAG}"
  CONFIGMAP_NAME="k6-scripts-${RUN_TAG}"
}

compute_paths() {
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  K6_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
  JOB_TEMPLATE="${SCRIPT_DIR}/job.yaml"
  RESULTS_DIR="${K6_DIR}/results"
  RUN_LOG="${RESULTS_DIR}/${RUN_TAG}.log"
  RUN_JSON_DIR="${RESULTS_DIR}/${RUN_TAG}-json"

  FLAT_DIR="$(mktemp -d -t k6-flat-XXXXXX)"
  RENDERED_JOB="$(mktemp -t k6-job-XXXXXX.yaml)"

  mkdir -p "${RESULTS_DIR}"
}

# ---------------------------------------------------------------------------
# Cleanup (registered with trap; runs on EXIT/INT/TERM)
# ---------------------------------------------------------------------------

cleanup_all() {
  echo
  log cleanup "deleting job ${NAMESPACE}/${JOB_NAME}"
  kubectl -n "${NAMESPACE}" delete job "${JOB_NAME}" \
    --ignore-not-found --wait=false >/dev/null 2>&1 || true

  log cleanup "deleting configmap ${NAMESPACE}/${CONFIGMAP_NAME}"
  kubectl -n "${NAMESPACE}" delete configmap "${CONFIGMAP_NAME}" \
    --ignore-not-found --wait=false >/dev/null 2>&1 || true

  rm -rf "${FLAT_DIR}" "${RENDERED_JOB}" 2>/dev/null || true
}

# ---------------------------------------------------------------------------
# Script flattening + ConfigMap upload
# ---------------------------------------------------------------------------

flatten_k6_scripts() {
  log build "flattening k6 scripts into ${FLAT_DIR}"
  cp "${K6_DIR}"/lib/*.js       "${FLAT_DIR}/"
  cp "${K6_DIR}"/scenarios/*.js "${FLAT_DIR}/"

  # ConfigMap volume mounts all keys in one directory. Rewrite relative imports.
  sed_inplace -E "s|'\\.\\./lib/|'./|g" "${FLAT_DIR}"/*.js

  if grep -nE "from '\\.\\." "${FLAT_DIR}"/*.js >/dev/null; then
    grep -nE "from '\\.\\." "${FLAT_DIR}"/*.js >&2
    die "relative parent imports remain after flatten"
  fi
}

build_configmap_arguments() {
  CM_FILE_ARGS=()
  for f in "${FLAT_DIR}"/*.js; do
    CM_FILE_ARGS+=("--from-file=$(basename "$f")=$f")
  done
}

create_configmap() {
  build_configmap_arguments
  log build "creating configmap ${NAMESPACE}/${CONFIGMAP_NAME}"
  kubectl -n "${NAMESPACE}" create configmap "${CONFIGMAP_NAME}" \
    "${CM_FILE_ARGS[@]}" >/dev/null
}

# ---------------------------------------------------------------------------
# Job manifest rendering + apply
# ---------------------------------------------------------------------------

# Escape value for safe insertion into sed replacement (handles | and &).
sed_escape() {
  printf '%s' "$1" | sed -e 's/[\\&|]/\\&/g'
}

render_job_manifest() {
  local exp_url disc_url auth_url enrich_url token user app tpl
  exp_url=$(sed_escape "${EXPORTER_URL}")
  disc_url=$(sed_escape "${DISCOVERY_URL}")
  auth_url=$(sed_escape "${AUTH_URL}")
  enrich_url=$(sed_escape "${ENRICHMENT_URL}")
  token=$(sed_escape "${SESSION_TOKEN}")
  user=$(sed_escape "${USER_ID}")
  app=$(sed_escape "${TEST_APP_NAME}")
  tpl=$(sed_escape "${TEST_PLAN_TEMPLATE_ID}")

  sed \
    -e "s|__RUN__|${RUN_TAG}|g" \
    -e "s|__SCENARIO__|${SCENARIO}|g" \
    -e "s|__NAMESPACE__|${NAMESPACE}|g" \
    -e "s|__CONFIGMAP__|${CONFIGMAP_NAME}|g" \
    -e "s|__EXPORTER_URL__|${exp_url}|g" \
    -e "s|__DISCOVERY_URL__|${disc_url}|g" \
    -e "s|__AUTH_URL__|${auth_url}|g" \
    -e "s|__ENRICHMENT_URL__|${enrich_url}|g" \
    -e "s|__SESSION_TOKEN__|${token}|g" \
    -e "s|__USER_ID__|${user}|g" \
    -e "s|__TEST_APP_NAME__|${app}|g" \
    -e "s|__TEST_PLAN_TEMPLATE_ID__|${tpl}|g" \
    -e "s|__FORCE_SYNC_POLL_TIMEOUT_SEC__|${FORCE_SYNC_POLL_TIMEOUT_SEC}|g" \
    -e "s|__PLAN_STATUS_POLL_TIMEOUT_SEC__|${PLAN_STATUS_POLL_TIMEOUT_SEC}|g" \
    -e "s|__DELETE_OWN_SESSION__|${DELETE_OWN_SESSION}|g" \
    -e "s|__RUN_TAG__|${RUN_TAG}|g" \
    "${JOB_TEMPLATE}" > "${RENDERED_JOB}"

  if [[ "${IMAGE}" != "${DEFAULT_IMAGE}" ]]; then
    sed_inplace -E "s|image: ${DEFAULT_IMAGE}|image: ${IMAGE}|" "${RENDERED_JOB}"
  fi
}

print_run_banner() {
  log apply "scenario=${SCENARIO} run=${RUN_TAG} ns=${NAMESPACE}"
  echo "       EXPORTER_BASE_URL=${EXPORTER_URL}"
  echo "       DISCOVERY_BASE_URL=${DISCOVERY_URL}"
  echo "       AUTH_BASE_URL=${AUTH_URL}"
  echo "       ENRICHMENT_BASE_URL=${ENRICHMENT_URL}"
  echo "       USER_ID=${USER_ID}"
  [[ -n "${TEST_APP_NAME}" ]] && echo "       TEST_APP_NAME=${TEST_APP_NAME}"
  [[ -n "${TEST_PLAN_TEMPLATE_ID}" ]] && echo "       TEST_PLAN_TEMPLATE_ID=${TEST_PLAN_TEMPLATE_ID}"
}

apply_job_manifest() {
  kubectl apply -f "${RENDERED_JOB}" >/dev/null
}

# ---------------------------------------------------------------------------
# Job execution: wait for pod, stream logs, wait for completion
# ---------------------------------------------------------------------------

wait_for_pod_to_appear() {
  log wait "pod scheduling (up to ${POD_APPEAR_TIMEOUT_SECONDS}s)"
  POD_NAME=""
  for _ in $(seq 1 "${POD_APPEAR_TIMEOUT_SECONDS}"); do
    POD_NAME=$(kubectl -n "${NAMESPACE}" get pod -l "run=${RUN_TAG}" \
      -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || true)
    if [[ -n "${POD_NAME}" ]]; then return 0; fi
    sleep 1
  done

  kubectl -n "${NAMESPACE}" describe job "${JOB_NAME}" || true
  die "pod for run=${RUN_TAG} did not appear within ${POD_APPEAR_TIMEOUT_SECONDS}s"
}

wait_for_pod_to_start_running() {
  log wait "pod ${POD_NAME} container start (up to 120s)"
  local phase=""
  for _ in $(seq 1 120); do
    phase=$(kubectl -n "${NAMESPACE}" get pod "${POD_NAME}" \
      -o jsonpath='{.status.phase}' 2>/dev/null || echo "")
    case "${phase}" in
      Running|Succeeded|Failed) return 0 ;;
    esac
    sleep 1
  done

  kubectl -n "${NAMESPACE}" describe pod "${POD_NAME}" || true
  die "pod ${POD_NAME} stuck in phase '${phase}' after 120s"
}

stream_pod_logs() {
  log logs "streaming to ${RUN_LOG}"
  echo
  kubectl -n "${NAMESPACE}" logs --follow \
    --pod-running-timeout="${POD_RUNNING_TIMEOUT}" \
    "${POD_NAME}" 2>&1 | tee "${RUN_LOG}" || true
}

wait_for_job_completion() {
  echo
  log wait "job completion (timeout ${WAIT_TIMEOUT})"

  if kubectl -n "${NAMESPACE}" wait --for=condition=complete \
       --timeout="${WAIT_TIMEOUT}" "job/${JOB_NAME}" 2>/dev/null; then
    JOB_STATUS="complete"
  elif kubectl -n "${NAMESPACE}" wait --for=condition=failed \
       --timeout=10s "job/${JOB_NAME}" 2>/dev/null; then
    JOB_STATUS="failed"
  else
    JOB_STATUS="unknown"
  fi
  log status "${JOB_STATUS}"
}

# ---------------------------------------------------------------------------
# Results
# ---------------------------------------------------------------------------

copy_results_from_pod() {
  if ! kubectl -n "${NAMESPACE}" get pod "${POD_NAME}" >/dev/null 2>&1; then
    log copy "pod gone before copy — skipping"
    return 0
  fi

  log copy "${POD_NAME}:/tmp/results/. → ${RUN_JSON_DIR}"
  mkdir -p "${RUN_JSON_DIR}"
  if ! kubectl -n "${NAMESPACE}" cp "${POD_NAME}:/tmp/results/." \
       "${RUN_JSON_DIR}" 2>/dev/null; then
    echo "       (no result files in /tmp/results — handleSummary may have skipped)"
  fi
}

print_done_summary() {
  echo
  log done "scenario=${SCENARIO} run=${RUN_TAG} status=${JOB_STATUS}"
  echo "       log:     ${RUN_LOG}"
  echo "       results: ${RUN_JSON_DIR}/"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

main() {
  parse_arguments "$@"
  check_required_env
  apply_env_defaults
  compute_run_identifiers
  compute_paths

  trap cleanup_all EXIT INT TERM

  flatten_k6_scripts
  create_configmap
  render_job_manifest
  print_run_banner
  apply_job_manifest

  wait_for_pod_to_appear
  log pod "${POD_NAME}"
  wait_for_pod_to_start_running
  stream_pod_logs
  wait_for_job_completion
  copy_results_from_pod
  print_done_summary
}

main "$@"

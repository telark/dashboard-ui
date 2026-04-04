import { APPLICATIONS_UI } from '../constants';
import type { ApplicationSnapshot, ApplicationSnapshotSummary } from '../models';
import { SNAPSHOT_SCOPE_APPS } from '../clients/snapshots';

function snapshotDedupKey(s: ApplicationSnapshotSummary): string {
  if (s.path != null && s.path.length > 0) return s.path;
  return `${s.namespace}|${s.generation}|${s.id}`;
}

export function applicationSnapshotStableKey(s: ApplicationSnapshotSummary): string {
  return snapshotDedupKey(s);
}

function sameGeneration(a: number, b: number): boolean {
  return Number(a) === Number(b);
}

function pickFromPool(
  pool: ApplicationSnapshotSummary[],
  idx: number,
  d: ApplicationSnapshot,
): ApplicationSnapshotSummary | null {
  if (idx < 0) return null;
  const [row] = pool.splice(idx, 1);
  return {
    ...row,
    path: row.path ?? d.path,
    severity: row.severity ?? d.severity,
    takenAt: row.takenAt ?? d.takenAt,
  };
}

function takeMatchingExporterRow(
  d: ApplicationSnapshot,
  pool: ApplicationSnapshotSummary[],
): ApplicationSnapshotSummary | null {
  if (d.path) {
    const byPath = pool.findIndex((s) => s.path === d.path);
    const matched = pickFromPool(pool, byPath, d);
    if (matched) return matched;
  }

  const strictIdx = pool.findIndex(
    (s) =>
      s.id === d.id &&
      s.namespace === d.namespace &&
      sameGeneration(s.generation, d.generation),
  );
  const strict = pickFromPool(pool, strictIdx, d);
  if (strict) return strict;

  const byGenIdx = pool.findIndex(
    (s) => s.namespace === d.namespace && sameGeneration(s.generation, d.generation),
  );
  return pickFromPool(pool, byGenIdx, d);
}

function appendUniquePoolRows(
  ordered: ApplicationSnapshotSummary[],
  pool: ApplicationSnapshotSummary[],
): void {
  const seen = new Set(ordered.map(snapshotDedupKey));
  for (const s of pool) {
    const k = snapshotDedupKey(s);
    if (!seen.has(k)) {
      ordered.push(s);
      seen.add(k);
    }
  }
}

export function mergeApplicationSnapshotSources(
  fromDetails: ApplicationSnapshot[] | undefined,
  fromExporter: ApplicationSnapshotSummary[],
): ApplicationSnapshotSummary[] {
  const details = fromDetails ?? [];
  const pool = [...fromExporter];
  const ordered: ApplicationSnapshotSummary[] = [];

  for (const d of details) {
    const matched = takeMatchingExporterRow(d, pool);
    if (matched) {
      ordered.push(matched);
    } else {
      ordered.push({
        id: d.id,
        scope: SNAPSHOT_SCOPE_APPS,
        namespace: d.namespace,
        generation: d.generation,
        size: APPLICATIONS_UI.FALLBACKS.EMPTY,
        consumed: APPLICATIONS_UI.FALLBACKS.EMPTY,
        path: d.path,
        severity: d.severity,
        takenAt: d.takenAt,
      });
    }
  }

  appendUniquePoolRows(ordered, pool);

  return ordered.sort((a, b) => {
    if (b.generation !== a.generation) return b.generation - a.generation;
    return applicationSnapshotStableKey(a).localeCompare(applicationSnapshotStableKey(b));
  });
}

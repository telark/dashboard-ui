import { Client, exporterApiClient } from '../../../api/index';
import logger from '../../../logging';
import { Endpoints } from '../../../constants';
import type { ResourceDetailsResponse } from '../../../interfaces/http';
import type { ExtendedAxiosError } from '../../../api/client/normalize';
import { APPLICATIONS_ERROR_MESSAGES } from '../constants';
import { APPLICATIONS_UI } from '../constants/texts';
import type {
  ApplicationSnapshot,
  ApplicationSnapshotSummary,
  SnapshotStorageInfos,
  SnapshotStorageMetric,
} from '../models';

export const SNAPSHOT_SCOPE_APPS = 'apps';

const EMPTY_SNAPSHOT_METRIC: SnapshotStorageMetric = { bytes: 0, kb: 0, mb: 0, percent: 0 };

const finiteOrZero = (value: unknown): number =>
  Number.isFinite(Number(value)) ? Number(value) : 0;

function normalizeSnapshotMetric(input: unknown): SnapshotStorageMetric {
  if (!input || typeof input !== 'object') return EMPTY_SNAPSHOT_METRIC;
  const metric = input as Partial<SnapshotStorageMetric>;
  return {
    bytes: finiteOrZero(metric.bytes),
    kb: finiteOrZero(metric.kb),
    mb: finiteOrZero(metric.mb),
    percent: finiteOrZero(metric.percent),
  };
}

function normalizeSnapshotInfos(input: unknown): SnapshotStorageInfos | null {
  if (!input || typeof input !== 'object') return null;
  const payload =
    'data' in (input as Record<string, unknown>) ? (input as { data?: unknown }).data : input;
  if (!payload || typeof payload !== 'object') return null;
  const raw = payload as Record<string, unknown>;
  return {
    totalPVCSpace: normalizeSnapshotMetric(raw.totalPVCSpace),
    consumedSpace: normalizeSnapshotMetric(raw.consumedSpace),
    availableSpace: normalizeSnapshotMetric(raw.availableSpace),
    totalSnapshots: finiteOrZero(raw.totalSnapshots),
  };
}

export const getSnapshotInfos = async (): Promise<SnapshotStorageInfos | null> => {
  const { path, method } = Endpoints.SNAPSHOTS.GET_INFOS;
  const res = await Client<SnapshotStorageInfos | ResourceDetailsResponse<SnapshotStorageInfos>>(
    exporterApiClient,
    path,
    { method },
  );
  return normalizeSnapshotInfos(res);
};

function buildSnapshotQueryString(namespace: string, generation: number): string {
  return new URLSearchParams({
    scope: SNAPSHOT_SCOPE_APPS,
    namespace,
    generation: String(generation),
  }).toString();
}

function extractRawSnapshotRows(data: unknown): unknown[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.items)) return o.items;
    if (Array.isArray(o.snapshots)) return o.snapshots;
    if (Array.isArray(o.data)) return o.data;
    return [data];
  }
  return [];
}

function mapExporterRowToSummary(row: unknown): ApplicationSnapshotSummary | null {
  if (row == null || typeof row !== 'object') return null;
  const o = row as Record<string, unknown>;
  const rawId = o.id;
  let id: string;
  if (typeof rawId === 'string' && rawId.length > 0) id = rawId;
  else if (rawId != null && String(rawId).length > 0) id = String(rawId);
  else return null;

  const scope = typeof o.scope === 'string' ? o.scope : SNAPSHOT_SCOPE_APPS;
  const namespace = typeof o.namespace === 'string' ? o.namespace : '';
  const rawGen = o.generation;
  let generation = 0;
  if (typeof rawGen === 'number' && !Number.isNaN(rawGen)) generation = rawGen;
  else if (rawGen != null) {
    const n = Number(rawGen);
    if (!Number.isNaN(n)) generation = n;
  }

  const fileSize = o.fileSize ?? o.size;
  let size = '';
  if (typeof fileSize === 'string') size = fileSize;
  else if (fileSize != null) size = String(fileSize);

  const consumedRaw = o.pvcUsedPercent ?? o.consumed;
  let consumed = '';
  if (typeof consumedRaw === 'string') consumed = consumedRaw;
  else if (consumedRaw != null) consumed = String(consumedRaw);

  const pvcTotal = typeof o.pvcTotal === 'string' ? o.pvcTotal : undefined;
  const pvcAvailable = typeof o.pvcAvailable === 'string' ? o.pvcAvailable : undefined;
  const severity = typeof o.severity === 'string' ? o.severity : undefined;
  const path = typeof o.path === 'string' && o.path.length > 0 ? o.path : undefined;
  const takenAtRaw = o.takenAt ?? o.taken_at;
  const takenAt = typeof takenAtRaw === 'string' && takenAtRaw.length > 0 ? takenAtRaw : undefined;

  return {
    id,
    scope,
    namespace,
    generation,
    size,
    consumed,
    path,
    severity,
    takenAt,
    pvcTotal,
    pvcAvailable,
  };
}

function detailToPlaceholderSummary(
  ref: ApplicationSnapshot,
  unavailable: boolean,
): ApplicationSnapshotSummary {
  return {
    id: ref.id,
    scope: SNAPSHOT_SCOPE_APPS,
    namespace: ref.namespace,
    generation: ref.generation,
    size: APPLICATIONS_UI.FALLBACKS.EMPTY,
    consumed: '',
    path: ref.path,
    severity: ref.severity,
    takenAt: ref.takenAt,
    unavailable,
  };
}

// Only a not-found answer proves the file is gone: a transient failure must not
// mark a healthy snapshot unavailable and disable its rollback.
function isSnapshotFileMissing(error: unknown): boolean {
  return (error as ExtendedAxiosError)?.normalized?.isNotFound === true;
}

function enrichSummaryFromDetail(
  d: ApplicationSnapshot,
  api: ApplicationSnapshotSummary,
): ApplicationSnapshotSummary {
  const gen = api.generation !== 0 && !Number.isNaN(api.generation) ? api.generation : d.generation;
  return {
    ...api,
    id: api.id || d.id,
    namespace: api.namespace || d.namespace,
    generation: gen,
    path: api.path ?? d.path,
    severity: api.severity ?? d.severity,
    takenAt: api.takenAt ?? d.takenAt,
  };
}

async function fetchSingleSnapshotStorage(
  ref: ApplicationSnapshot,
): Promise<ApplicationSnapshotSummary | null> {
  const qs = buildSnapshotQueryString(ref.namespace, ref.generation);
  const urlPath = `${Endpoints.SNAPSHOTS.GET_BY_ID(ref.id).path}?${qs}`;
  try {
    const resp = await Client<ResourceDetailsResponse<unknown>>(exporterApiClient, urlPath);
    const rows = extractRawSnapshotRows(resp.data);
    for (const row of rows) {
      const mapped = mapExporterRowToSummary(row);
      if (mapped) return enrichSummaryFromDetail(ref, mapped);
    }
    return null;
  } catch (error) {
    if (isSnapshotFileMissing(error)) return null;
    throw error;
  }
}

async function fetchSnapshotSummariesPerRef(
  refs: ApplicationSnapshot[],
): Promise<ApplicationSnapshotSummary[]> {
  const settled = await Promise.allSettled(refs.map((ref) => fetchSingleSnapshotStorage(ref)));
  const out: ApplicationSnapshotSummary[] = [];
  for (let i = 0; i < settled.length; i++) {
    const res = settled[i];
    const ref = refs[i];
    if (res.status === 'fulfilled' && res.value != null) {
      out.push(res.value);
    } else {
      // Resolved with no row means the exporter answered and has no file for the
      // ref; a rejection is a transient failure, which says nothing about it.
      out.push(detailToPlaceholderSummary(ref, res.status === 'fulfilled'));
    }
  }
  return out;
}

export const getApplicationSnapshotSummaries = async (
  snapshotRefs: ApplicationSnapshot[] | undefined,
  canReadFiles: boolean,
): Promise<ApplicationSnapshotSummary[]> => {
  // The per-ref GET is refused under the manifest deny rule; a skipped read proves
  // nothing about the file, so the refs stay listed and never show as missing.
  if (!canReadFiles)
    return (snapshotRefs ?? []).map((ref) => detailToPlaceholderSummary(ref, false));
  if (snapshotRefs != null && snapshotRefs.length > 0) {
    try {
      return await fetchSnapshotSummariesPerRef(snapshotRefs);
    } catch (error) {
      logger.error(
        `${APPLICATIONS_ERROR_MESSAGES.CLIENT.FETCH_APPLICATION_SNAPSHOTS_FAILED} (per-gen):`,
        error,
      );
      throw error;
    }
  }
  return [];
};

export const getSnapshotManifest = async (
  snapshotId: string,
  params: { namespace: string; generation: number },
): Promise<unknown> => {
  try {
    const qs = buildSnapshotQueryString(params.namespace, params.generation);
    const path = `${Endpoints.SNAPSHOTS.GET_MANIFEST(snapshotId).path}?${qs}`;
    return await Client<unknown>(exporterApiClient, path);
  } catch (error) {
    logger.error(
      `${APPLICATIONS_ERROR_MESSAGES.CLIENT.FETCH_SNAPSHOT_MANIFEST_FAILED} "${snapshotId}" gen=${params.generation}:`,
      error,
    );
    throw error;
  }
};

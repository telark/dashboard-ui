import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import { APPLICATIONS_ERROR_MESSAGES } from '../constants';
import { APPLICATIONS_UI } from '../constants/texts';
import type { ApplicationSnapshot, ApplicationSnapshotSummary } from '../models';

export const SNAPSHOT_SCOPE_APPS = 'apps';

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

  return {
    id,
    scope,
    namespace,
    generation,
    size,
    consumed,
    path,
    severity,
    pvcTotal,
    pvcAvailable,
  };
}

function detailToPlaceholderSummary(ref: ApplicationSnapshot): ApplicationSnapshotSummary {
  return {
    id: ref.id,
    scope: SNAPSHOT_SCOPE_APPS,
    namespace: ref.namespace,
    generation: ref.generation,
    size: APPLICATIONS_UI.FALLBACKS.EMPTY,
    consumed: '',
    path: ref.path,
    severity: ref.severity,
  };
}

function enrichSummaryFromDetail(
  d: ApplicationSnapshot,
  api: ApplicationSnapshotSummary,
): ApplicationSnapshotSummary {
  const gen =
    api.generation !== 0 && !Number.isNaN(api.generation) ? api.generation : d.generation;
  return {
    ...api,
    id: api.id || d.id,
    namespace: api.namespace || d.namespace,
    generation: gen,
    path: api.path ?? d.path,
    severity: api.severity ?? d.severity,
  };
}

async function fetchSingleSnapshotStorage(
  applicationId: string,
  ref: ApplicationSnapshot,
): Promise<ApplicationSnapshotSummary | null> {
  const qs = buildSnapshotQueryString(ref.namespace, ref.generation);
  const urlPath = `${Endpoints.SNAPSHOTS.GET_BY_ID(applicationId).path}?${qs}`;
  const resp = await Client<ResourceDetailsResponse<unknown>>(exporterApiClient, urlPath);
  const rows = extractRawSnapshotRows(resp.data);
  for (const row of rows) {
    const mapped = mapExporterRowToSummary(row);
    if (mapped) return enrichSummaryFromDetail(ref, mapped);
  }
  return null;
}

async function fetchSnapshotSummariesPerRef(
  applicationId: string,
  refs: ApplicationSnapshot[],
): Promise<ApplicationSnapshotSummary[]> {
  const settled = await Promise.allSettled(
    refs.map((ref) => fetchSingleSnapshotStorage(applicationId, ref)),
  );
  const out: ApplicationSnapshotSummary[] = [];
  for (let i = 0; i < settled.length; i++) {
    const res = settled[i];
    const ref = refs[i];
    if (res.status === 'fulfilled' && res.value != null) {
      out.push(res.value);
    } else {
      out.push(detailToPlaceholderSummary(ref));
    }
  }
  return out;
}

/** Single GET (no generation); backend may return one or many rows. */
export const getSnapshotsByApplicationId = async (
  applicationId: string,
): Promise<ApplicationSnapshotSummary[]> => {
  try {
    const path = `${Endpoints.SNAPSHOTS.GET_BY_ID(applicationId).path}?scope=${encodeURIComponent(
      SNAPSHOT_SCOPE_APPS,
    )}`;
    const resp = await Client<ResourceDetailsResponse<unknown>>(exporterApiClient, path);
    const rows = extractRawSnapshotRows(resp.data);
    return rows
      .map(mapExporterRowToSummary)
      .filter((s): s is ApplicationSnapshotSummary => s != null);
  } catch (error) {
    logger.error(
      `${APPLICATIONS_ERROR_MESSAGES.CLIENT.FETCH_APPLICATION_SNAPSHOTS_FAILED} "${applicationId}":`,
      error,
    );
    throw error;
  }
};

/**
 * When the CR lists snapshots (same `id`, different `generation`), call get once per ref
 * with `namespace` + `generation` query params (same as manifest).
 */
export const getApplicationSnapshotSummaries = async (
  applicationId: string,
  snapshotRefs?: ApplicationSnapshot[],
): Promise<ApplicationSnapshotSummary[]> => {
  if (snapshotRefs != null && snapshotRefs.length > 0) {
    try {
      return await fetchSnapshotSummariesPerRef(applicationId, snapshotRefs);
    } catch (error) {
      logger.error(
        `${APPLICATIONS_ERROR_MESSAGES.CLIENT.FETCH_APPLICATION_SNAPSHOTS_FAILED} "${applicationId}" (per-gen):`,
        error,
      );
      throw error;
    }
  }
  return getSnapshotsByApplicationId(applicationId);
};

export const getSnapshotManifest = async (
  applicationId: string,
  params: { namespace: string; generation: number },
): Promise<unknown> => {
  try {
    const qs = buildSnapshotQueryString(params.namespace, params.generation);
    const path = `${Endpoints.SNAPSHOTS.GET_MANIFEST(applicationId).path}?${qs}`;
    return await Client<unknown>(exporterApiClient, path);
  } catch (error) {
    logger.error(
      `${APPLICATIONS_ERROR_MESSAGES.CLIENT.FETCH_SNAPSHOT_MANIFEST_FAILED} "${applicationId}" gen=${params.generation}:`,
      error,
    );
    throw error;
  }
};

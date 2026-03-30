import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import { APPLICATIONS_ERROR_MESSAGES } from '../constants';
import type { ApplicationSnapshotSummary } from '../models';

export const SNAPSHOT_SCOPE_APPS = 'apps';

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

export const getSnapshotsByApplicationId = async (
  applicationId: string,
): Promise<ApplicationSnapshotSummary[]> => {
  try {
    // exporter-service exposes `GET snapshots/{id}/get?scope=apps[&namespace=...&generation=...]`
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

export const getSnapshotManifest = async (snapshotId: string) => {
  try {
    const path = `${Endpoints.SNAPSHOTS.GET_MANIFEST(snapshotId).path}?scope=${encodeURIComponent(
      SNAPSHOT_SCOPE_APPS,
    )}`;
    // manifest endpoint returns raw JSON, not ResourceDetailsResponse
    return await Client<unknown>(exporterApiClient, path);
  } catch (error) {
    logger.error(
      `${APPLICATIONS_ERROR_MESSAGES.CLIENT.FETCH_SNAPSHOT_MANIFEST_FAILED} "${snapshotId}":`,
      error,
    );
    throw error;
  }
};


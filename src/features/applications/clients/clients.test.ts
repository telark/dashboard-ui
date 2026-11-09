import type { JsonBodyType } from 'msw';
import { describe, expect, it } from 'vitest';
import { Endpoints, EMPTY_VALUE, HEADER_VALUES, HTTP_HEADERS } from '../../../constants';
import { describeClients, EMPTY_LIST_BODY, mockEndpoint, mockList } from '../../../test';
import { buildApplicationSnapshot } from '../../../test/factories/applications';
import {
  abortApplicationRollback,
  fetchApplicationDetails,
  fetchApplications,
  fetchDiscoveryStatus,
  getApplicationSnapshotSummaries,
  getSnapshotInfos,
  getSnapshotManifest,
  resetApplication,
  triggerApplicationRollback,
  triggerApplicationSync,
  updateApplication,
} from '.';

const NAME = 'orders';
const ROLLBACK_ID = 'rollback-1';
const SNAPSHOT_ID = 'snapshot-1';
const SNAPSHOT_PARAMS = { namespace: 'payments', generation: 4 };

describeClients('applications', [
  {
    name: 'fetchApplications',
    service: 'exporter',
    endpoint: Endpoints.APPLICATIONS.GET_ALL,
    call: () => fetchApplications(),
    response: EMPTY_LIST_BODY,
  },
  {
    name: 'fetchApplicationDetails',
    service: 'exporter',
    endpoint: Endpoints.APPLICATIONS.GET_DETAILS(NAME),
    call: () => fetchApplicationDetails(NAME),
    response: { data: { name: NAME } },
  },
  {
    name: 'updateApplication',
    service: 'exporter',
    endpoint: Endpoints.APPLICATIONS.UPDATE(NAME),
    call: () => updateApplication(NAME, { displayName: 'Orders' }),
    body: { spec: { displayName: 'Orders' } },
  },
  {
    name: 'resetApplication',
    service: 'discovery',
    endpoint: Endpoints.APPLICATIONS.RESET(NAME),
    call: () => resetApplication(NAME),
  },
  {
    name: 'triggerApplicationRollback',
    service: 'discovery',
    endpoint: Endpoints.APPLICATIONS.TRIGGER_ROLLBACK(NAME),
    call: () => triggerApplicationRollback(NAME, { snapshotGeneration: 2, triggeredBy: 'user-1' }),
    body: { snapshotGeneration: 2, triggeredBy: 'user-1' },
  },
  {
    name: 'abortApplicationRollback',
    service: 'discovery',
    endpoint: Endpoints.APPLICATIONS.ABORT_ROLLBACK(NAME, ROLLBACK_ID),
    call: () => abortApplicationRollback(NAME, ROLLBACK_ID),
  },
  {
    name: 'triggerApplicationSync',
    service: 'discovery',
    endpoint: Endpoints.SYNC.APPLICATION(NAME),
    call: () => triggerApplicationSync(NAME),
    response: { data: { jobId: 'job-1' } },
  },
  {
    name: 'fetchDiscoveryStatus',
    service: 'discovery',
    endpoint: Endpoints.APPLICATIONS.DISCOVERY_STATUS,
    call: () => fetchDiscoveryStatus(),
    response: { data: { inProgress: false } },
  },
  {
    name: 'getSnapshotManifest',
    service: 'exporter',
    endpoint: Endpoints.SNAPSHOTS.GET_MANIFEST(SNAPSHOT_ID),
    call: () => getSnapshotManifest(SNAPSHOT_ID, SNAPSHOT_PARAMS),
  },
]);

describe('fetchApplications', () => {
  it('marks a silent poll so the connectivity banner stays quiet', async () => {
    const list = mockList('exporter', Endpoints.APPLICATIONS.GET_ALL, []);

    await fetchApplications(true);

    expect(list.calls[0].headers.get(HTTP_HEADERS.CUSTOM.SILENT_NETWORK)).toBe(
      HEADER_VALUES.SILENT_NETWORK,
    );
  });
});

describe('getSnapshotManifest', () => {
  it('asks for the snapshot of that namespace and generation', async () => {
    const manifest = mockEndpoint('exporter', Endpoints.SNAPSHOTS.GET_MANIFEST(SNAPSHOT_ID), {});

    await getSnapshotManifest(SNAPSHOT_ID, SNAPSHOT_PARAMS);

    const params = manifest.calls[0].url.searchParams;
    expect(params.get('namespace')).toBe(SNAPSHOT_PARAMS.namespace);
    expect(params.get('generation')).toBe(String(SNAPSHOT_PARAMS.generation));
  });
});

describe('getSnapshotInfos', () => {
  const METRIC = { bytes: 1024, kb: 1, mb: 0, percent: 10 };
  const EMPTY_METRIC = { bytes: 0, kb: 0, mb: 0, percent: 0 };

  it.each([
    ['a bare payload', { totalPVCSpace: METRIC, totalSnapshots: 3 }],
    ['a wrapped payload', { data: { totalPVCSpace: METRIC, totalSnapshots: 3 } }],
  ])('normalizes %s and fills what is missing', async (_label, response) => {
    mockEndpoint('exporter', Endpoints.SNAPSHOTS.GET_INFOS, response);

    await expect(getSnapshotInfos()).resolves.toEqual({
      totalPVCSpace: METRIC,
      consumedSpace: EMPTY_METRIC,
      availableSpace: EMPTY_METRIC,
      totalSnapshots: 3,
    });
  });

  it.each([
    ['no payload', null],
    ['an empty wrapper', { data: null }],
  ])('returns null for %s', async (_label, response) => {
    mockEndpoint('exporter', Endpoints.SNAPSHOTS.GET_INFOS, response);

    await expect(getSnapshotInfos()).resolves.toBeNull();
  });

  it('treats non-numeric metric values as zero', async () => {
    mockEndpoint('exporter', Endpoints.SNAPSHOTS.GET_INFOS, {
      totalPVCSpace: { bytes: 'lots', kb: null, mb: 2, percent: '50' },
      totalSnapshots: 'none',
    });

    await expect(getSnapshotInfos()).resolves.toMatchObject({
      totalPVCSpace: { bytes: 0, kb: 0, mb: 2, percent: 50 },
      totalSnapshots: 0,
    });
  });
});

describe('getApplicationSnapshotSummaries', () => {
  const ref = buildApplicationSnapshot({
    id: 'snap-1',
    namespace: 'payments',
    generation: 5,
    severity: 'high',
    path: '/snap/1.yaml',
  });
  const mockRow = (body: JsonBodyType, status = 200) =>
    mockEndpoint('exporter', Endpoints.SNAPSHOTS.GET_BY_ID(ref.id), body, { status });

  it('keeps the refs listed, with no size, when the viewer may not read files', async () => {
    const [summary] = await getApplicationSnapshotSummaries([ref], false);

    expect(summary).toMatchObject({ id: ref.id, size: EMPTY_VALUE, unavailable: false });
  });

  it('returns nothing for no refs', async () => {
    await expect(getApplicationSnapshotSummaries(undefined, true)).resolves.toEqual([]);
    await expect(getApplicationSnapshotSummaries([], true)).resolves.toEqual([]);
  });

  const ROW = { id: 'row-1', generation: 5, fileSize: '12MB' };

  it.each([
    ['items list', { items: [ROW] }, '12MB'],
    ['snapshots list', { snapshots: [{ id: 'row-1', generation: '5', size: 12 }] }, '12'],
    ['data list', { data: [ROW] }, '12MB'],
    ['plain row', ROW, '12MB'],
    ['array of rows', [ROW], '12MB'],
  ])('reads the exporter row out of a %s', async (_label, data, size) => {
    mockRow({ data });

    const [summary] = await getApplicationSnapshotSummaries([ref], true);

    expect(summary).toMatchObject({ id: 'row-1', generation: 5, size, namespace: ref.namespace });
  });

  it('fills a row from its ref, pvc fields included', async () => {
    mockRow({
      data: {
        id: 'row-1',
        pvcUsedPercent: 40,
        pvcTotal: '1Gi',
        pvcAvailable: '600Mi',
        severity: 'low',
        taken_at: '2026-03-01T00:00:00Z',
      },
    });

    const [summary] = await getApplicationSnapshotSummaries([ref], true);

    expect(summary).toMatchObject({
      generation: ref.generation,
      consumed: '40',
      pvcTotal: '1Gi',
      pvcAvailable: '600Mi',
      severity: 'low',
      takenAt: '2026-03-01T00:00:00Z',
      path: ref.path,
    });
  });

  it.each([
    ['an empty answer', { data: null }, 200, true],
    ['rows without an id', { data: [{ generation: 5 }] }, 200, true],
    ['a 404', {}, 404, true],
    ['a transient failure', {}, 500, false],
  ])('for %s, unavailable is %s', async (_label, body, status, unavailable) => {
    mockRow(body, status);

    const [summary] = await getApplicationSnapshotSummaries([ref], true);

    expect(summary).toMatchObject({ id: ref.id, unavailable });
  });
});

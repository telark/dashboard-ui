import { describe, expect, it } from 'vitest';
import { EMPTY_VALUE, UTILS_TEXTS } from '../../../constants';
import {
  buildApplication,
  buildApplicationRollback,
  buildApplicationSnapshot,
  buildApplicationWith,
  buildChangeLogEntry,
} from '../../../test/factories/applications';
import { buildPlan } from '../../../test/factories/plans';
import { APPLICATIONS_UI } from '../constants';
import type { ApplicationCoverage, ApplicationSnapshotSummary } from '../models';
import { buildCoverageIndex, getApplicationCoverage, getApplicationProtection } from './coverage';
import { getManifestErrorCopy } from './manifestError';
import {
  formatBytes,
  formatBytesPair,
  formatMillicores,
  formatMillicoresPair,
  parseCpuToMillicores,
  parseMemoryToBytes,
} from './k8sQuantity';
import { filterByExcludedNamespaces } from './management/state';
import { mapApplicationsData, mapSingleApplicationData } from './mappers/applicationMapper';
import {
  applicationSnapshotStableKey,
  mergeApplicationSnapshotSources,
} from './mergeApplicationSnapshotSources';
import {
  classifyRollbackStatus,
  formatRollbackNamespaceRef,
  formatRollbackStatusLabel,
  hasActiveRollback,
} from './rollbacks';

describe('rollback status', () => {
  it.each([
    ['', 'unknown'],
    ['Aborted', 'aborted'],
    ['canceled', 'aborted'],
    ['Failed', 'failed'],
    ['error', 'failed'],
    ['success', 'success'],
    ['completed', 'success'],
    ['pending', 'pending'],
    ['in_progress', 'inProgress'],
    ['running', 'inProgress'],
    ['started', 'inProgress'],
    ['weird', 'unknown'],
  ])('classifyRollbackStatus(%j) is %j', (raw, expected) => {
    expect(classifyRollbackStatus(raw)).toBe(expected);
  });

  it.each([
    ['in_progress', 'In Progress'],
    ['  ', 'Unknown'],
    ['DONE', 'Done'],
  ])('formatRollbackStatusLabel(%j) is %j', (raw, expected) => {
    expect(formatRollbackStatusLabel(raw)).toBe(expected);
  });

  it.each([
    ['payments', 'ns/payments'],
    ['', `ns/${EMPTY_VALUE}`],
    [undefined, `ns/${EMPTY_VALUE}`],
  ])('formatRollbackNamespaceRef(%j) is %j', (raw, expected) => {
    expect(formatRollbackNamespaceRef(raw)).toBe(expected);
  });

  it.each([
    [[], false],
    [undefined, false],
    [[buildApplicationRollback({ status: 'success' })], false],
    [[buildApplicationRollback({ status: 'in_progress' })], true],
  ])('hasActiveRollback(%j) is %s', (rollbacks, expected) => {
    expect(hasActiveRollback(rollbacks)).toBe(expected);
  });
});

describe('quantities', () => {
  it.each([
    ['250m', 250],
    ['1.5', 1500],
    ['2e3', 2_000_000],
    ['', null],
    ['  ', null],
    [null, null],
    ['1Gi', null],
    ['abc', null],
  ])('parseCpuToMillicores(%j) is %j', (raw, expected) => {
    expect(parseCpuToMillicores(raw)).toBe(expected);
  });

  it.each([
    ['512Mi', 512 * 1024 ** 2],
    ['1Gi', 1024 ** 3],
    ['1k', 1000],
    ['100', 100],
    ['2X', null],
    [null, null],
  ])('parseMemoryToBytes(%j) is %j', (raw, expected) => {
    expect(parseMemoryToBytes(raw)).toBe(expected);
  });

  it.each([
    [999, '999m'],
    [1500, '1.5'],
  ])('formatMillicores(%i) is %j', (value, expected) => {
    expect(formatMillicores(value)).toBe(expected);
  });

  it.each([
    [512, '512 B'],
    [1024 ** 2 * 1.5, '1.5 MiB'],
    [1024 ** 5 * 3, '3072 TiB'],
  ])('formatBytes(%d) is %j', (value, expected) => {
    expect(formatBytes(value)).toBe(expected);
  });

  it('keeps a pair in the unit of its scale', () => {
    expect(formatMillicoresPair(6, 50)).toBe('6m / 50m');
    expect(formatMillicoresPair(500, 2000)).toBe('0.5 / 2');
    expect(formatBytesPair(1024 ** 2, 1024 ** 3)).toBe('0 GiB / 1 GiB');
  });
});

describe('getManifestErrorCopy', () => {
  it.each([
    ['Request failed with status code 404', true],
    ['Request failed with status code 500', false],
  ])('%s', (raw, notFound) => {
    const copy = getManifestErrorCopy(raw);

    expect(copy).toMatchObject({ detail: raw, notFound });
    expect(copy.title).toBe(
      notFound
        ? APPLICATIONS_UI.SECTIONS.SNAPSHOTS.MANIFEST_NOT_FOUND_TITLE
        : APPLICATIONS_UI.SECTIONS.SNAPSHOTS.MANIFEST_ERROR_TITLE,
    );
  });
});

describe('filterByExcludedNamespaces', () => {
  const inPayments = buildApplication();
  const noNamespace = buildApplication({ namespaces: { total: 0, items: [] } });

  it.each([
    [[], [inPayments, noNamespace]],
    [['payments'], [noNamespace]],
    [['ops'], [inPayments, noNamespace]],
  ])('excluding %j', (excluded, expected) => {
    expect(filterByExcludedNamespaces([inPayments, noNamespace], excluded)).toEqual(expected);
  });
});

describe('application mapper', () => {
  it('rejects anything but an object for details', () => {
    expect(() => mapSingleApplicationData(null)).toThrow(UTILS_TEXTS.ERRORS.MISSING_DATA);
    expect(() => mapSingleApplicationData('oops')).toThrow(UTILS_TEXTS.ERRORS.MISSING_DATA);
  });

  it('fills every absent field with a safe default', () => {
    expect(mapSingleApplicationData({ name: 'orders' })).toMatchObject({
      name: 'orders',
      displayName: '',
      description: null,
      images: [],
      ports: [],
      envVarKeys: [],
      resources: [],
      snapshots: [],
      rollbacks: [],
      resourceCount: 0,
      namespaces: { total: 0, items: [] },
      health: { status: 'unknown', readyReplicas: 0 },
      managed: { by: '' },
      history: { generation: 0, changeLog: [] },
    });
  });

  it('strips the detail-only arrays from list rows', () => {
    const application = buildApplicationWith({
      snapshots: [buildApplicationSnapshot()],
      history: { changeLog: [buildChangeLogEntry({ generation: 1 })] },
    });

    const [row] = mapApplicationsData({ status: 200, data: { items: [application] } });

    expect(row.snapshots).toEqual([]);
    expect(row.history.changeLog[0].changes).toEqual([]);
    expect(row.history.changeLog[0].generation).toBe(1);
  });

  it('rejects a failed list envelope', () => {
    expect(() => mapApplicationsData({ status: 500, data: null })).toThrow(
      UTILS_TEXTS.ERRORS.INVALID_DATA_FORMAT,
    );
  });
});

describe('coverage', () => {
  const enforcing = buildPlan({
    name: 'enforced',
    phase: 'active',
    mode: 'enforce',
    scope: { type: 'applications', applicationRefs: ['orders'], namespaces: [] },
  });
  const auditing = buildPlan({
    name: 'audited',
    phase: 'active',
    mode: 'audit',
    scope: { type: 'namespaces', applicationRefs: [], namespaces: ['payments'] },
  });
  const upcoming = buildPlan({
    name: 'later',
    phase: 'scheduled',
    mode: 'enforce',
    scope: { type: 'applications', applicationRefs: ['orders'], namespaces: [] },
  });
  const ended = buildPlan({
    name: 'ended',
    phase: 'terminated',
    scope: { type: 'applications', applicationRefs: ['orders'], namespaces: [] },
  });
  const orders = buildApplication({ name: 'orders' });

  it('classifies each covering plan and ignores ended ones', () => {
    const index = buildCoverageIndex([enforcing, auditing, upcoming, ended]);

    expect(getApplicationCoverage(index, orders)).toEqual({
      enforcing: ['enforced'],
      auditing: ['audited'],
      upcoming: ['later'],
    });
  });

  it('reports the strongest state, or none', () => {
    const coverage = (over: Partial<ApplicationCoverage>): ApplicationCoverage => ({
      known: true,
      enforcing: [],
      auditing: [],
      upcoming: [],
      ...over,
    });

    expect(getApplicationProtection(coverage({ enforcing: ['a'], auditing: ['b'] }))).toBe(
      'enforcing',
    );
    expect(getApplicationProtection(coverage({ upcoming: ['a'] }))).toBe('upcoming');
    expect(getApplicationProtection(coverage({}))).toBe('none');
  });
});

describe('mergeApplicationSnapshotSources', () => {
  const detail = buildApplicationSnapshot({
    id: 'a',
    namespace: 'payments',
    generation: 2,
    path: '/a',
    severity: 'high',
    takenAt: 't1',
  });
  const summary = (over: Partial<ApplicationSnapshotSummary>): ApplicationSnapshotSummary => ({
    id: 'a',
    scope: 'apps',
    namespace: 'payments',
    generation: 2,
    size: '10MB',
    consumed: '5',
    ...over,
  });

  it.each<[string, Partial<ApplicationSnapshotSummary>, Partial<ApplicationSnapshotSummary>]>([
    [
      'by path, filling the row from the details',
      { path: '/a' },
      { size: '10MB', severity: 'high', takenAt: 't1', path: '/a' },
    ],
    ['by id and generation without a path', { path: undefined }, { path: '/a' }],
    [
      'by namespace and generation when the id differs',
      { id: 'other', path: undefined },
      { id: 'other' },
    ],
  ])('matches %s', (_label, over, expected) => {
    const [merged] = mergeApplicationSnapshotSources([detail], [summary(over)]);

    expect(merged).toMatchObject(expected);
  });

  it('lists a detail with no exporter row, without a size', () => {
    const [merged] = mergeApplicationSnapshotSources([detail], []);

    expect(merged).toMatchObject({ id: 'a', size: EMPTY_VALUE, consumed: EMPTY_VALUE });
  });

  it('appends exporter rows the details do not know, newest generation first', () => {
    const extra = summary({ id: 'b', generation: 7, path: '/b' });

    const merged = mergeApplicationSnapshotSources([detail], [extra]);

    expect(merged.map((row) => row.generation)).toEqual([7, 2]);
  });

  it('keys a snapshot by its path, or by its identity without one', () => {
    expect(applicationSnapshotStableKey(summary({ path: '/a' }))).toBe('/a');
    expect(applicationSnapshotStableKey(summary({ path: '' }))).toBe('payments|2|a');
  });
});

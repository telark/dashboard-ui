import { describe, expect, it } from 'vitest';
import { buildApplication } from '../../../../test/factories/applications';
import { SNAPSHOT_MANIFEST_CACHE_LIMIT } from '../../constants';
import type { ApplicationsState, SyncStatusValue } from '../../models';
import reducer, {
  clearAllFilters,
  downgradeOrphanedSyncStatus,
  endSync,
  fetchAllApplicationsSilentThunk,
  fetchAllApplicationsThunk,
  fetchApplicationDetailsThunk,
  fetchApplicationSnapshotsThunk,
  fetchSnapshotManifestThunk,
  removeFilterValue,
  resetApplicationThunk,
  setSearchValue,
  setSyncCompletedAt,
  setSyncLastError,
  startSync,
  toggleSelectedName,
} from './applicationsSlice';

const initial = (over: Partial<ApplicationsState> = {}): ApplicationsState => ({
  ...reducer(undefined, { type: 'init' }),
  ...over,
});

describe('applications slice', () => {
  it('tracks a sync start and end', () => {
    const syncing = reducer(initial(), startSync('orders'));
    expect(syncing.syncing).toEqual({ orders: true });
    expect(reducer(syncing, endSync('orders')).syncing).toEqual({});
  });

  it('ignores an empty name in the sync bookkeeping', () => {
    const state = initial();

    expect(reducer(state, startSync('')).syncing).toEqual({});
    expect(reducer(state, setSyncCompletedAt({ name: '' })).syncCompletedAt).toEqual({});
    expect(reducer(state, setSyncLastError({ name: '' })).syncLastError).toEqual({});
  });

  it('stores and clears sync metadata', () => {
    const name = 'orders';
    const completedAt = '2026-01-01T00:00:00Z';
    let state = reducer(initial(), setSyncCompletedAt({ name, completedAt }));
    state = reducer(state, setSyncLastError({ name, error: 'boom' }));

    expect(state.syncCompletedAt[name]).toBe(completedAt);
    expect(state.syncLastError[name]).toBe('boom');
    state = reducer(state, setSyncCompletedAt({ name }));
    state = reducer(state, setSyncLastError({ name }));
    expect(state.syncCompletedAt).toEqual({});
    expect(state.syncLastError).toEqual({});
  });

  it('downgrades a sync whose job is gone, keeping live ones', () => {
    const state = initial({
      syncStatus: {
        gone: 'syncing',
        live: 'syncing',
        done: 'success',
      } as Record<string, SyncStatusValue>,
    });

    const next = reducer(state, downgradeOrphanedSyncStatus(['live']));

    expect(next.syncStatus).toEqual({ gone: 'failed', live: 'syncing', done: 'success' });
  });

  it('resets the page whenever the view is narrowed', () => {
    const state = initial({ currentPage: 3 });

    expect(reducer(state, setSearchValue('a')).currentPage).toBe(1);
    expect(reducer(state, clearAllFilters()).currentPage).toBe(1);
  });

  it.each([
    [
      'one value of a list',
      { status: ['a', 'b'] },
      { key: 'status', value: 'a' },
      { status: ['b'] },
    ],
    ['a date range', { dateRange: { from: 'x' } }, { key: 'dateRange' }, { dateRange: {} }],
    ['a scalar filter', { hasDrift: 'true' }, { key: 'hasDrift' }, {}],
    ['everything', { status: ['a'] }, { key: 'status', clearAll: true }, {}],
  ])('removes %s', (_label, appliedFilters, payload, expected) => {
    const state = initial({ appliedFilters, currentPage: 2 });

    const next = reducer(state, removeFilterValue(payload));

    expect(next.appliedFilters).toEqual(expected);
    expect(next.currentPage).toBe(1);
  });

  it('adds and removes a selected name, ignoring an empty one', () => {
    let state = reducer(initial(), toggleSelectedName({ name: 'a', checked: true }));
    expect(state.selectedNames).toEqual(['a']);

    state = reducer(state, toggleSelectedName({ name: 'a', checked: false }));
    expect(state.selectedNames).toEqual([]);

    expect(reducer(state, toggleSelectedName({ name: '', checked: true })).selectedNames).toEqual(
      [],
    );
  });
});

describe('applications thunk results in the slice', () => {
  const application = buildApplication({ name: 'orders' });

  it('stores the list and clears the error', () => {
    const next = reducer(
      initial({ error: 'old' }),
      fetchAllApplicationsThunk.fulfilled([application], 'id'),
    );

    expect(next).toMatchObject({
      applications: [application],
      loaded: true,
      error: null,
      loading: false,
    });
  });

  it('keeps showing the list through a failed reload', () => {
    const state = initial({ applications: [application], loaded: true });

    const next = reducer(
      state,
      fetchAllApplicationsThunk.rejected(new Error('x'), 'id', undefined, 'unreachable'),
    );

    expect(next.applications).toEqual([application]);
    expect(next.error).toBe('unreachable');
  });

  it('a silent poll updates the list without an error flash', () => {
    const state = initial({ error: 'old' });

    const next = reducer(state, fetchAllApplicationsSilentThunk.fulfilled([application], 'id'));

    expect(next).toMatchObject({ applications: [application], error: null });
  });

  it('stores the details, then the error of a failed read', () => {
    const state = reducer(
      initial(),
      fetchApplicationDetailsThunk.fulfilled(application, 'id', 'orders'),
    );

    expect(state.details).toEqual(application);
    expect(
      reducer(state, fetchApplicationDetailsThunk.rejected(new Error('x'), 'id', 'orders', 'gone'))
        .error,
    ).toBe('gone');
  });

  it('drops a reset application from the list', () => {
    const state = initial({ applications: [application, buildApplication({ name: 'billing' })] });

    const next = reducer(state, resetApplicationThunk.fulfilled('orders', 'id', 'orders'));

    expect(next.applications.map((app) => app.name)).toEqual(['billing']);
  });

  it('tracks the snapshot list', () => {
    const arg = { canReadFiles: true };
    const loading = reducer(initial(), fetchApplicationSnapshotsThunk.pending('id', arg));
    expect(loading.snapshotsLoading).toBe(true);

    const failed = reducer(
      loading,
      fetchApplicationSnapshotsThunk.rejected(new Error('x'), 'id', arg, 'no files'),
    );
    expect(failed).toMatchObject({ snapshotsLoading: false, snapshotsError: 'no files' });
  });

  it('caches manifests under a limit, oldest out first', () => {
    let state = initial();
    const newest = SNAPSHOT_MANIFEST_CACHE_LIMIT + 4;
    for (let i = 0; i <= newest; i += 1) {
      const arg = { manifestKey: `m${i}`, snapshotId: 's', namespace: 'n', generation: i };
      state = reducer(
        state,
        fetchSnapshotManifestThunk.fulfilled({ manifestKey: `m${i}`, data: {} }, 'id', arg),
      );
    }

    expect(Object.keys(state.snapshotManifests)).toHaveLength(SNAPSHOT_MANIFEST_CACHE_LIMIT);
    expect(state.snapshotManifests.m0).toBeUndefined();
    expect(state.snapshotManifests[`m${newest}`]).toEqual({
      loading: false,
      error: null,
      data: {},
    });
  });

  it('records a manifest read that failed', () => {
    const arg = { manifestKey: 'm', snapshotId: 's', namespace: 'n', generation: 1 };
    const pending = reducer(initial(), fetchSnapshotManifestThunk.pending('id', arg));
    expect(pending.snapshotManifests.m.loading).toBe(true);

    const failed = reducer(
      pending,
      fetchSnapshotManifestThunk.rejected(new Error('x'), 'id', arg, 'no manifest'),
    );

    expect(failed.snapshotManifests.m).toMatchObject({ loading: false, error: 'no manifest' });
  });
});

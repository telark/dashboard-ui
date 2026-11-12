import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Endpoints } from '../../../constants';
import { mockEndpoint, mockNetworkError, resetStore, store } from '../../../test';
import {
  ensureGlobalConfigThunk,
  fetchGlobalConfigThunk,
  GLOBAL_CONFIG_CACHE_TTL_MS,
  selectGlobalConfigState,
  setGlobalConfig,
} from '.';

const state = () => selectGlobalConfigState(store.getState());
const NOW = Date.UTC(2026, 5, 1);

describe('global config store', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: NOW, toFake: ['Date'] });
    resetStore();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('loads and stores the config', async () => {
    mockEndpoint('exporter', Endpoints.GLOBALCONFIG.GET, { data: { ai: { enabled: true } } });

    await store.dispatch(fetchGlobalConfigThunk());

    expect(state()).toMatchObject({
      initialized: true,
      loading: false,
      error: null,
      data: { ai: { enabled: true } },
      lastFetchedAt: NOW,
    });
  });

  it('keeps an empty config when the server sends none', async () => {
    mockEndpoint('exporter', Endpoints.GLOBALCONFIG.GET, {});

    await store.dispatch(fetchGlobalConfigThunk());

    expect(state().data).toEqual({});
  });

  it('records a failed load', async () => {
    mockNetworkError('exporter', Endpoints.GLOBALCONFIG.GET);

    await store.dispatch(fetchGlobalConfigThunk());

    expect(state()).toMatchObject({ initialized: true, loading: false, error: 'Network Error' });
  });

  it('accepts a config set directly', () => {
    store.dispatch(setGlobalConfig({ snapshots: { maxPerApp: 3 } }));

    expect(state()).toMatchObject({ initialized: true, data: { snapshots: { maxPerApp: 3 } } });
  });

  it('fetches once while fresh, and again once stale', async () => {
    const mock = mockEndpoint('exporter', Endpoints.GLOBALCONFIG.GET, { data: {} });

    await store.dispatch(ensureGlobalConfigThunk());
    await store.dispatch(ensureGlobalConfigThunk());
    expect(mock.calls).toHaveLength(1);

    vi.setSystemTime(NOW + GLOBAL_CONFIG_CACHE_TTL_MS + 1);
    await store.dispatch(ensureGlobalConfigThunk());
    expect(mock.calls).toHaveLength(2);
  });
});

import storage from 'redux-persist/lib/storage';
import type { PersistConfig } from 'redux-persist';

/**
 * We only persist the data, not the loading/error/syncing/details
 * using default localStorage
 */

export const rootPersistConfig: PersistConfig<any> = {
  key: 'root',
  storage,
  whitelist: ['grouper', 'workload', 'bridge', 'insights', 'applications', 'retry'],
};

export const grouperPersistConfig: PersistConfig<any> = {
  key: 'grouper',
  storage,
  whitelist: ['groupers'],
};

export const workloadPersistConfig: PersistConfig<any> = {
  key: 'workload',
  storage,
  whitelist: ['apps', 'batches'],
};

export const bridgePersistConfig: PersistConfig<any> = {
  key: 'bridge',
  storage,
  whitelist: ['bridges'],
};

export const applicationsPersistConfig: PersistConfig<any> = {
  key: 'applications',
  storage,
  whitelist: [
    'applications',
    'syncing',
    'syncStatus',
    'syncCompletedAt',
    'layoutMode',
    'bulkMode',
    'selectedNames',
    'healthQuickFilter',
    'searchValue',
    'currentPage',
    'appliedFilters',
  ],
};

export const insightsPersistConfig: PersistConfig<any> = {
  key: 'insights',
  storage,
  whitelist: ['hasClusterInsight', 'initialized'],
};

export const retryPersistConfig: PersistConfig<any> = {
  key: 'retry',
  storage,
  whitelist: ['byKey'],
};

export const groupsPersistConfig: PersistConfig<any> = {
  key: 'groups',
  storage,
  whitelist: ['groups'],
};

export const usersPersistConfig: PersistConfig<any> = {
  key: 'users',
  storage,
  whitelist: ['users'],
};

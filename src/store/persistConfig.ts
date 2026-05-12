import storage from 'redux-persist/lib/storage';
import type { PersistConfig } from 'redux-persist';

export const rootPersistConfig: PersistConfig<any> = {
  key: 'root',
  storage,
  whitelist: ['applications', 'retry'],
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

export const globalConfigPersistConfig: PersistConfig<any> = {
  key: 'globalconfig',
  storage,
  whitelist: ['data', 'initialized', 'lastFetchedAt'],
};

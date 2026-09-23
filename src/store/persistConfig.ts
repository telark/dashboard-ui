import storage from 'redux-persist/lib/storage';

export const applicationsPersistConfig = {
  key: 'applications',
  storage,
  whitelist: [
    'applications',
    'layoutMode',
    'bulkMode',
    'selectedNames',
    'healthQuickFilter',
    'searchValue',
    'currentPage',
    'appliedFilters',
  ],
};

export const retryPersistConfig = {
  key: 'retry',
  storage,
  whitelist: ['byKey'],
};

export const groupsPersistConfig = {
  key: 'groups',
  storage,
  whitelist: ['groups'],
};

export const usersPersistConfig = {
  key: 'users',
  storage,
  whitelist: ['users'],
};

export const rolesPersistConfig = {
  key: 'roles',
  storage,
  whitelist: ['roles'],
};

export const protectionPlansPersistConfig = {
  key: 'protectionPlans',
  storage,
  whitelist: ['plans'],
};

export const globalConfigPersistConfig = {
  key: 'globalconfig',
  storage,
  whitelist: ['data', 'initialized', 'lastFetchedAt'],
};

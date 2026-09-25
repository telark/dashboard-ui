import storage from 'redux-persist/es/storage';

export const applicationsPersistConfig = {
  key: 'applications',
  storage,
  whitelist: [
    'applications',
    'viewMode',
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

// Restored on reload so the sidebar and the route gate render at once; the
// startup fetch then revalidates them silently.
export const permissionsPersistConfig = {
  key: 'permissions',
  storage,
  whitelist: ['userID', 'roles', 'scopeIndex', 'ready'],
};

export const categoriesPersistConfig = {
  key: 'categories',
  storage,
  whitelist: ['categoriesByScope'],
};

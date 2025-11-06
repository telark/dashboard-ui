import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import type { PersistConfig } from 'redux-persist';

export const rootPersistConfig: PersistConfig<any> = {
  key: 'root',
  storage,
  whitelist: ['grouper', 'workload', 'bridge', 'insights'], // Only persist these reducers
};

export const grouperPersistConfig: PersistConfig<any> = {
  key: 'grouper',
  storage,
  whitelist: ['groupers'], // Only persist groupers array, not loading/error/syncing/details
};

export const workloadPersistConfig: PersistConfig<any> = {
  key: 'workload',
  storage,
  whitelist: ['apps', 'batches'], // Only persist data arrays, not loading/error/syncing/details
};

export const bridgePersistConfig: PersistConfig<any> = {
  key: 'bridge',
  storage,
  whitelist: ['bridges'], // Only persist bridges array, not loading/error/syncing/details
};

export const insightsPersistConfig: PersistConfig<any> = {
  key: 'insights',
  storage,
  whitelist: ['hasClusterInsight', 'initialized'], // Persist these, not loading/error
};

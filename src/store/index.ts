import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import grouperReducer from './groupers/slices/grouperSlice';
import insightsReducer from './insights/slices/insightsSlice';
import workloadReducer from './workloads/slices/workloadSlice';
import bridgeReducer from './bridges/slices/bridgeSlice';
import groupsReducer from './groups/slices/groupSlice';
import {
  grouperPersistConfig,
  insightsPersistConfig,
  workloadPersistConfig,
  bridgePersistConfig,
  groupsPersistConfig,
} from './persistence/persistConfig';

const persistedGrouperReducer = persistReducer(grouperPersistConfig, grouperReducer);
const persistedInsightsReducer = persistReducer(insightsPersistConfig, insightsReducer);
const persistedWorkloadReducer = persistReducer(workloadPersistConfig, workloadReducer);
const persistedBridgeReducer = persistReducer(bridgePersistConfig, bridgeReducer);
const persistedGroupsReducer = persistReducer(groupsPersistConfig, groupsReducer);

const store = configureStore({
  reducer: {
    grouper: persistedGrouperReducer,
    insights: persistedInsightsReducer,
    workload: persistedWorkloadReducer,
    bridge: persistedBridgeReducer,
    groups: persistedGroupsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
        warnAfter: 128, // default is 32ms
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
export default store;

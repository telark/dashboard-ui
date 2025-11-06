import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import grouperReducer from './groupers/slices/grouperSlice';
import insightsReducer from './insights/slices/insightsSlice';
import workloadReducer from './workloads/slices/workloadSlice';
import bridgeReducer from './bridges/slices/bridgeSlice';
import {
  grouperPersistConfig,
  insightsPersistConfig,
  workloadPersistConfig,
  bridgePersistConfig,
} from './persistConfig';

const persistedGrouperReducer = persistReducer(grouperPersistConfig, grouperReducer);
const persistedInsightsReducer = persistReducer(insightsPersistConfig, insightsReducer);
const persistedWorkloadReducer = persistReducer(workloadPersistConfig, workloadReducer);
const persistedBridgeReducer = persistReducer(bridgePersistConfig, bridgeReducer);

const store = configureStore({
  reducer: {
    grouper: persistedGrouperReducer,
    insights: persistedInsightsReducer,
    workload: persistedWorkloadReducer,
    bridge: persistedBridgeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
        // Increase warning threshold from 32ms to 128ms
        warnAfter: 128,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export persistor for PersistGate
export { store };
export default store;
